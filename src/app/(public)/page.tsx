import React from 'react';
import HeroSection from './_components/home/HeroSection';
import StatsBanner from './_components/home/StatsBanner';
import FeaturedCourses from './_components/home/FeaturedCourses';
import FeaturesGrid from './_components/home/FeaturesGrid';
import EmbryoProgression from './_components/home/EmbryoProgression';
import FacultySpotlight from './_components/home/FacultySpotlight';
import UpcomingBootcamps from './_components/home/UpcomingBootcamps';
import TestimonialsSection from './_components/home/TestimonialsSection';
import CTASection from './_components/home/CTASection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-inter selection:bg-blue-600 selection:text-white">
      <HeroSection />
      <StatsBanner />
      <FeaturedCourses />
      <FeaturesGrid />
      <EmbryoProgression />
      <FacultySpotlight />
      <UpcomingBootcamps />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
