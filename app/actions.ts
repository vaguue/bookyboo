'use server'

import type { Cart } from 'lib/shopify/types';
import { SignJWT } from 'jose';
import moment from 'moment';
import { lemonSqueezySetup, listProducts, listVariants, getProduct, createCheckout, listCheckouts } from '@lemonsqueezy/lemonsqueezy.js';
import { kv } from '@vercel/kv';

const apiKey = process.env.LEMON_API_KEY as string;
const storeId = process.env.LEMON_STORE_ID as string;
const productId = process.env.LEMON_PRODUCT_ID as string;
const variantId = process.env.LEMON_VARIANT_ID as string;
const webhookSecret = process.env.LEMON_WEBHOOK_SECRET as string;
const expireInterval = (process.env.LEMON_EXPIRE_INTERVAL as string).split(' ');
const testMode = (process.env.LEMON_TEST_MODE as string) == 'true' ? true : false;

const jwtSecret = process.env.JWT_SECRET as string;
const alg = process.env.JWT_ALGORITHMS as string;
const jwtIssuer = process.env.JWT_ISSUER as string;
const jwtAudience = process.env.JWT_AUDIENCE as string;
const expTime = process.env.JWT_EXPIRE as string;

export async function getCheckoutUrl(
  _prevState: any,
  formData: FormData,
): Promise<string> {
  const coupon = formData.get('email') as string
  const cartId = formData.get('cartId') as string

  lemonSqueezySetup({
    apiKey: apiKey,
    onError: (err) => {
      console.error(`Lemon error`, err);
    },
  });

  if (cartId?.length > 0) {
    const cart = await kv.get<Cart>(`cart:${cartId}`);
    if (!cart) {
      throw new Error('Cart not found');
    }

    const payload = { cartId };

    const secret = new TextEncoder().encode(jwtSecret);

    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setIssuer(jwtIssuer)
      .setAudience(jwtAudience)
      .setIssuedAt()
      .setExpirationTime(expTime)
      .sign(secret);

    const { href } = new URL(`/download/${jwt}`, process.env.PUBLIC_URL);
    const newCheckout = {
      customPrice: Number(cart.cost.totalAmount),
      productOptions: {
        name: 'Your cart',

        receipt_button_text: 'Download your items',
        receipt_link_url: href,

        redirect_url: href,
      },
      checkoutOptions: {
        embed: true,
        media: false,
        logo: false,
      },
      checkoutData: {
        custom: {
          cartId: cartId,
        },
      },
      expiresAt: moment().add(...expireInterval).toISOString(),
      preview: true,
      testMode: testMode,
    };

    return createCheckout(storeId, variantId, newCheckout).then(resp => resp?.data?.data?.attributes?.url as string);
  }
  else {
    throw new Error('Invalid cart id');
  }
}
