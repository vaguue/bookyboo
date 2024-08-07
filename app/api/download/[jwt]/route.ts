import path from 'node:path';
import axios from 'axios';
import { kv } from '@vercel/kv';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import AdmZip from 'adm-zip';
import type { Cart } from 'lib/shopify/types';

const jwtSecret = process.env.JWT_SECRET as string;
const algorithms = [process.env.JWT_ALGORITHMS as string];
const issuer = process.env.JWT_ISSUER as string;
const audience = process.env.JWT_AUDIENCE as string;

export async function GET(request: Request, { params }: { params: { jwt: string } }) {
  const { jwt } = params;

  const secret = new TextEncoder().encode(jwtSecret);

  const { payload } = await jwtVerify(jwt, secret, {
    algorithms,
    issuer,
    audience,
  });

  const cart = await kv.get<Cart>(`cart:${payload.cartId}`);

  if (!cart) {
    return new Response('Not found', { status: 404 });
  }

  const zip = new AdmZip();

  for (const line of cart.lines) {
    const { product } = line.merchandise;

    if (product.downloadUrl) {
      const resp = await axios.get(product.downloadUrl, { responseType: 'arraybuffer' });
      zip.addFile(product.handle + path.parse(product.downloadUrl).ext, Buffer.from(resp.data));
    }
  }

  const buf = zip.toBuffer();

  return new Response(buf, {
    status: 200,
    headers: new Headers({
      'content-disposition': 'attachment; filename=order.zip',
      'content-type': 'application/zip',
      'content-length': String(buf.length),
    }),
  });
}
