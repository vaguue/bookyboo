<p align='center'>
  <img src='public/bookyboo.svg' width='180' alt='Lemon and book'>
</p>

# Bookyboo

This project is a hackable fork of vercel/commerce, swapping out Shopify for LemonSqueezy and @vercel/kv. The aim is to make it super easy for anyone to set up a digital product store using React. Whether you're selling ebooks, software, or any other digital goods, this setup has got you covered.

## Why?

There should be some easy way to set up a website to sell digital goods without too much of a hustle for a developer. I hope this would be it.

## Next.js Commerce x LemonSqueezy

A Next.js 14 and App Router-ready ecommerce template featuring:

- Next.js App Router
- Optimized for SEO using Next.js's Metadata
- React Server Components (RSCs) and Suspense
- Server Actions for mutations
- Edge Runtime
- New fetching and caching paradigms
- Dynamic OG images
- Styling with Tailwind CSS
- Checkout and payments with Shopify
- Automatic light/dark mode based on system settings

<h3 id="v1-note"></h3>

> Note: Looking for Next.js Commerce v1? View the [code](https://github.com/vercel/commerce/tree/v1), [demo](https://commerce-v1.vercel.store), and [release notes](https://github.com/vercel/commerce/releases/tag/v1).

## LemonSqueezy

[LemonSqueezy](https://www.lemonsqueezy.com/) is a payments, tax & subscriptions service for software companies, that enables the most convinient and smooth integration for commercial projects online. Checkout their [Github](https://github.com/lmsqueezy) page for more details.

## Getting started

1. Install packages

```bash
npm i
```

2. You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js Commerce. Copy the contents of .env.example to a .env file in the root of your Next.js Commerce project, and make sure that you have @vercel/kv and lemonsqueezy variables.

> Note: You should not commit your `.env` file or it will expose secrets.

3. Seed the storage

```bash
npm run seed
```

4. Run the server

```bash
npm run dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).
