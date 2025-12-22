import fs from 'node:fs/promises';
import path from 'node:path';

// Configuration
const CONTENT_DIR = './src/content/keyboards';
const IMAGE_DIR = './src/content/keyboards/images';

async function main() {
  console.log('🧹 Starting image cleanup...');

  // 1. Collect all referenced images from Markdown files
  const referencedImages = new Set();

  async function scanDirectory(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        await scanDirectory(res);
      } else if (dirent.name.endsWith('.md')) {
        const content = await fs.readFile(res, 'utf-8');
        // Look for image: path/to/image.webp
        // Matches: image: ../../images/foo.webp "
        // We only care about the filename because all images are flat in IMAGE_DIR
        const match = content.match(/^image:\s*["']?.*\/([^\/]+\.webp)["']?/m);
        if (match) {
          referencedImages.add(match[1]);
        }
      }
    }
  }

  await scanDirectory(CONTENT_DIR);
  console.log(`found ${referencedImages.size} referenced images in markdown.`);

  // 2. Scan Image Directory
  let deletedCount = 0;
  try {
    const imageFiles = await fs.readdir(IMAGE_DIR);
    for (const file of imageFiles) {
      if (!file.endsWith('.webp')) continue;

      if (!referencedImages.has(file)) {
        console.log(`[DELETE] Unused image: ${file}`);
        await fs.unlink(path.join(IMAGE_DIR, file));
        deletedCount++;
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') console.error(err);
  }

  console.log(`✨ Cleanup complete. Removed ${deletedCount} unused images.`);
}

main().catch(console.error);
