import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://backend-journal.vercel.app";

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Dynamic Project Routes
  const contentDir = path.join(process.cwd(), "content/projects");
  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir);
    files.forEach((file) => {
      if (file.endsWith('.md')) {
        const id = file.replace('.md', '');
        routes.push({
          url: `${baseUrl}/projects/${id}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    });
  }

  return routes;
}
