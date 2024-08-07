import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

import Footer from 'components/layout/footer';

export default async function ProductPage({ params }: { params: { jwt: string } }) {
  const { jwt } = params;

  return (
    <div className="min-h-[calc(100vh-76px)] flex flex-col">
      <div className="flex-1 flex items-center">
        <div className="mx-auto px-4 my-auto">
          <a 
            href={`/api/download/${jwt}`}
            className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black flex items-center cursor-pointer"
          >
            <ArrowDownTrayIcon width={64} height={64}/>
            <p className="font-bold text-xl">Download your items</p>
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
