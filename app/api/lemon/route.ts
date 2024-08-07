import crypto from 'node:crypto';

import { emptyCart } from 'lib/shopify';
import { streamToBuffer } from 'lib/utils';

const webhookSecret = process.env.LEMON_WEBHOOK_SECRET as string;

const LEMON_EVENTS = {
  orderCreated: 'order_created',
};

export async function GET(request: Request) {
  const { headers } = request;

  const hmac = crypto.createHmac('sha256', webhookSecret);

  const signature = Buffer.from(headers.get('x-signature') ?? '', 'utf8');
  const rawBody = await streamToBuffer(request.body as ReadableStream<Uint8Array>);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');

  if (!crypto.timingSafeEqual(digest, signature)) {
    throw new Error('invalid-sign');
  }

  const body = JSON.parse(new TextDecoder().decode(rawBody));

  const eventName = body.meta.event_name;

  if (eventName === LEMON_EVENTS.orderCreated) {
    const { cartId } = body.meta.custom_data;

    await emptyCart(cartId);
  }
}
