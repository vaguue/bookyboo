import { fileURLToPath } from 'node:url';
import process from 'node:process';

import { createClient } from '@vercel/kv';
import 'dotenv/config'

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const collections = {
  main: {
    handle: 'main',
    title: 'Our shop',
    description: 'main shop',
    seo: {
      title: 'shop',
      description: 'shop',
    },
    products: [],
    updatedAt: new Date(Date.now()),
  },
  'three-items': {
    handle: 'three-items',
    title: 'Main books',
    description: 'main books',
    seo: {
      title: 'main books',
      description: 'main books',
    },
    products: [],
    updatedAt: new Date(Date.now()),
  },
}

const pages = {
  main: {
    id: 'main',
    title: 'Main page',
    handle: 'main-page',
    body: '',
    bodySummary: '',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  },
};

const products = {};

const addProduct = ({ id, title, amount, url, description, parentCollections = [], downloadUrl, priority = 1e9 }) => {
  products[id] = {
    variants: [{
      id,
      title,
      availableForSale: true,
      selectedOptions: [],
      price: {
        amount,
        currencyCode: 'USD',
      },
    }],
    images: [
      {
        url,
        altText: title,
        width: '1080',
        height: '1350',
      },
    ],
    handle: id,
    availableForSale: true,
    title,
    description,
    descriptionHtml: description,
    options: [],
    priceRange: {
      maxVariantPrice: {
        amount,
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount,
        currencyCode: 'USD',
      },
    },
    featuredImage: {
      url,
    },
    seo: {
      title,
      description,
    },
    tags: [],
    updatedAt: new Date(Date.now()),
    downloadUrl,
    priority,
  };

  parentCollections.forEach(colId => collections[colId].products.push(id));
};


addProduct({
  id: 'evolution-book',
  title: 'The Evolution of Museological Paradigms: Insights and Developments',
  amount: '10',
  url: 'https://cdn.bookyboo.shop/evolution-cover.png',
  description: 'An open book with pages transforming into artifacts and objects, including statues, manuscripts, and modern devices, symbolizing the evolution of museology across different eras.',
  parentCollections: ['main', 'three-items'],
  downloadUrl: 'https://cdn.bookyboo.shop/evolution-book.pdf',
  priority: 0,
});

addProduct({
  id: 'culture-book',
  title: 'Understanding Culture: An Interdisciplinary Approach',
  amount: '10',
  url: 'https://cdn.bookyboo.shop/understanding.png',
  description: 'A big article with my takes about cultural studies as an integrative and interdisciplinary form of knowledge',
  parentCollections: ['main', 'three-items'],
  downloadUrl: 'https://cdn.bookyboo.shop/culture-book.pdf',
  priority: 1,
});

addProduct({
  id: 'transformation-book',
  title: 'Transformative Museology: Concepts, Practices, and Paradigms of the Late 20th and Early 21st Centuries',
  amount: '10',
  url: 'https://cdn.bookyboo.shop/transformation-conver.png',
  description: 'A comprehensive exploration of contemporary museology, covering key concepts, digital innovations, inclusive practices, and the evolving role of museums in promoting diversity, equity, and social justice.',
  parentCollections: ['main', 'three-items'],
  downloadUrl: 'https://cdn.bookyboo.shop/transformation-book.pdf',
  priority: 2,
});

addProduct({
  id: 'impact-book',
  title: 'Museums of the Future: Evolution of Space and Experience',
  amount: '10',
  url: 'https://cdn.bookyboo.shop/impact-cover.png',
  description: '"Museums of the Future: Evolution of Space and Experience" explores the transformation of museums in the modern age, from architecture to digital technologies, showcasing how they adapt to a changing world and create unique experiences for visitors.',
  parentCollections: ['main'],
  downloadUrl: 'https://cdn.bookyboo.shop/impact-book.pdf',
  priority: 3,
});

const data = { pages, products, collections };

export async function seed() {
  try {
    await Promise.all(Object.entries(data).map(([entity, dict]) => 
      Promise.all(
        Object.entries(dict).map(([k, v]) => kv.hset(entity, { [k]: v }))
      ),
    ));

    console.log('ok');
  } catch(err) {
    console.error(err);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await seed();
}
