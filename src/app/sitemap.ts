import { MetadataRoute } from 'next';
import { PricingPackage } from '@/models';

export const revalidate = 3600; // revalidate at most every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shreefertilityacademy.com';

  const defaultRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  try {
    const packages = await PricingPackage.findAll({ where: { isActive: true } });
    packages.forEach((pkg: any) => {
      defaultRoutes.push({
        url: `${baseUrl}/pricing#${pkg.id}`,
        lastModified: pkg.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
  }

  return defaultRoutes;
}
