import { NextResponse } from 'next/server';
import { PricingPackage } from '@/models';

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shreefertilityacademy.com';
  let packagesText = '';
  
  try {
    const packages = await PricingPackage.findAll({ where: { isActive: true } });
    if (packages.length > 0) {
      packagesText = packages.map((pkg: any) => `- ${pkg.title}: INR ${(pkg.price / 1000).toFixed(0)}k`).join('\n');
    } else {
      packagesText = 'No programs available at the moment.';
    }
  } catch (err) {
    packagesText = 'Failed to load programs.';
  }

  const content = `# Shree Fertility Academy
  
We provide clinical mastery programs for Reproductive Medicine and IVF. Gain comprehensive practical training with direct guidance from Dr. Vaishali Grover.

## Quick Links
- Home: ${baseUrl}/
- About: ${baseUrl}/about
- Courses: ${baseUrl}/courses
- Pricing: ${baseUrl}/pricing

## Available Programs
${packagesText}

## Contact
Email: info@shreefertilityacademy.com
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
