import { isShopifyError } from 'lib/type-guards';
import { ensureStartsWith } from 'lib/utils';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid'
import { kv } from '@vercel/kv'

import {
  Cart,
  Collection,
  Connection,
  Image,
  Menu,
  Page,
  Product,
} from './types';

let data;

const ex = 24 * 60 * 60;

export async function createCart(): Promise<Cart> {
  const cart = {
    id: nanoid(),
    checkoutUrl: '',
    cost: {
      subtotalAmount: {
        amount: '0',
        currencyCode: 'USD',
      },
      totalAmount: {
        amount: '0',
        currencyCode: 'USD',
      },
      totalTaxAmount:{
        amount: '0',
        currencyCode: 'USD',
      },    
    },
    lines: [],
    totalQuantity: 0,
  };

  await kv.set<Cart>(`cart:${cart.id}`, cart, { ex });

  return cart;
}

async function saveCart(cart: Cart): Promise<void> {
  await kv.set<Cart>(`cart:${cart.id}`, cart, { ex });
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cart = await getCart(cartId);
  const products = await kv.hgetall<Record<string, Product>>('products');

  if (!products) return cart;

  lines.forEach(line => {
    const { merchandiseId } = line;
    const product = products[merchandiseId];
    if (!product) return;
    const cost = Number(product.priceRange.maxVariantPrice.amount);

    cart.lines.push({
      id: merchandiseId,
      quantity: 1,
      cost: {
        totalAmount: {
          amount: cost.toString(),
          currencyCode: 'USD',
        },
      },
      merchandise: {
        id: product.id,
        title: product.title,
        selectedOptions: [],
        product,
      },
    });

    cart.cost.totalAmount.amount = String(Number(cart.cost.totalAmount.amount) + cost);
    cart.totalQuantity += 1;
  });

  await saveCart(cart);

  return cart;
}

export async function emptyCart(cartId: string): Promise<void> {
  const cart = await getCart(cartId);

  cart.lines = [];
  cart.cost.totalAmount.amount = '0';
  cart.totalQuantity = 0;

  await saveCart(cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const cart = await getCart(cartId);

  cart.lines = cart.lines.filter(line => !lineIds.includes(line.id));
  cart.cost.totalAmount.amount = String(cart.lines.reduce((res, e) => res + Number(e.cost.totalAmount.amount), 0));
  cart.totalQuantity = cart.lines.length;

  await saveCart(cart);

  return cart;
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  return getCart(cartId);
}

export async function getCart(cartId: string): Promise<Cart> {
  const fromkv = await kv.get<Cart>(`cart:${cartId}`);
  if (fromkv) return fromkv;

  return createCart();
}

export async function getCollection(handle: string): Promise<Collection | null> {
  return kv.hget<Collection>(`collections`, handle);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const [col, products] = await Promise.all([getCollection(collection), kv.hgetall<{ [s: string]: Product; }>('products')]);

  if (!products || !col) return [];

  return Object.values(products).filter(e => col.products.includes(e?.variants?.[0]?.id as string)).sort((a, b) => (a.priority ?? 1e9) - (b.priority ?? 1e9));
}

export async function getCollections(): Promise<Collection[]> {
  return Object.values((await kv.hgetall<Record<string, Collection>>('collections')) ?? {});
}

export async function getMenu(handle: string): Promise<Menu[]> {
  return (await kv.get(`menu:${handle}`)) ?? [{ title: 'Welcome', path: '/' }];
}

export async function getPage(handle: string): Promise<Page> {
  return kv.hget<Page>('pages', handle) as Promise<Page>;
}

export async function getPages(): Promise<Page[]> {
  return Object.values((await kv.hgetall<Record<string, Page>>('pages')) ?? {});
}

export async function getProduct(handle: string): Promise<Product | null> {
  return kv.hget<Product>('products', handle);
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  return [];
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = Object.values((await kv.hgetall<Record<string, Product>>('products')) ?? {});

  if (query) {
    return res.filter(e => `${e.title}: ${e.description}`.includes(query));
  }

  return res;
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
