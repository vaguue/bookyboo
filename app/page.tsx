import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';

//rebuild

export const metadata = {
  description: 'Unique collection of ebooks dedicated to Museology',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
  );
}
