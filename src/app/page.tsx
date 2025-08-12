import Hero from '@/components/hero/Hero'
import Partners from '@/components/autoSlider/AutoSlider';
import ServicesSection from '@/components/servicesSection/ServicesSection';
import { Suspense } from 'react';
import  News  from '@/components/news/News'
import Footer from '@/components/footer/Footer'
export default function Home() {
  return (
    <>
    <Suspense fallback={<div>Loading Hero...</div>}>
        <Hero />
       <Partners />
       <ServicesSection />
       <News />
       <Footer />
    </Suspense>
    </>
  );
}
