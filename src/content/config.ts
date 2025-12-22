import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const keyboards = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/keyboards' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      url: z.string().url(),
      category: z.string(),
      tags: z.string().optional(),
      // Allow either a local image (processed by Astro) or a remote fallback string
      image: image().optional().or(z.string().url()),
      image_fallback: z.string().url().optional(), // Store original URL if download failed
    }),
});

export const collections = {
  keyboards,
};
