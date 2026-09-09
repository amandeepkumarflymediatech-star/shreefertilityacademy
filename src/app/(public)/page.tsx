import React from 'react';
import HeroSection from './_components/home/HeroSection';
import IntroSection from './_components/home/IntroSection';
import AudienceSection from './_components/home/AudienceSection';
import FeaturesBanner from './_components/home/FeaturesBanner';
import CourseDetails from './_components/home/CourseDetails';
import WhyChooseSection from './_components/home/WhyChooseSection';
import MentorHighlight from './_components/home/MentorHighlight';
import ProgramJourney from './_components/home/ProgramJourney';
import FaqAndForm from './_components/home/FaqAndForm';
import FooterCta from './_components/home/FooterCta';

export default function PublicHomePage() {
  return (
    <main className="w-full flex flex-col items-center bg-primary-bg overflow-x-hidden">
      <HeroSection />
      <IntroSection />
      <AudienceSection />
      <FeaturesBanner />
      <CourseDetails />
      <WhyChooseSection />
      <MentorHighlight />
      <ProgramJourney />
      <FaqAndForm />
      <FooterCta />
    </main>
  );
}
