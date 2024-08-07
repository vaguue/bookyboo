import Link from 'next/link';

import FooterMenu from 'components/layout/footer-menu';
import LogoSquare from 'components/logo-square';
import { getMenu } from 'lib/shopify';
import { Suspense } from 'react';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700';
  const menu = await getMenu('next-js-frontend-footer-menu');
  const copyrightName = COMPANY_NAME || SITE_NAME || '';

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto px-2 flex items-center justify-between w-full max-w-7xl flex-row gap-6 border-t border-neutral-200 pt-4 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
        <div>
          <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
            <LogoSquare size="sm" />
            <span className="uppercase">{SITE_NAME}</span>
          </Link>
        </div>
        <div className="py-6 text-sm dark:border-neutral-700 flex sm:flex-row flex-col">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
            <div className="flex gap-2 sm:flex-row flex-col">
              <p>
                &copy; {copyrightDate} {copyrightName}
                {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
              </p>
              <a href="/terms.pdf" rel="noopener noreferrer" className="underline" target="_blank">
                Terms of use
              </a>
              <a href="/privacy.pdf" rel="noopener noreferrer" className="underline" target="_blank">
                Privacy policy
              </a>
              <a href={`mailto:support@bookyboo.shop`} rel="noopener noreferrer" className="underline" target="_blank">{process.env.PUBLIC_EMAIL}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
