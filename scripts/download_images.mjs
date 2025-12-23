import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Configuration
const CONTENT_DIR = './src/content/keyboards';
// Images are stored relative to the content files.
// We generally put them in src/content/keyboards/images
const IMAGE_DIR = './src/content/keyboards/images';
const IMAGE_WIDTH = 600; // 2x for 300px display width (Retina support)

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function downloadAndResize(url, filename) {
  const targetPath = path.join(IMAGE_DIR, filename);

  // Smart Caching: Skip if exists
  try {
    await fs.access(targetPath);
    return true; // Exists
  } catch {}

  console.log(`[DOWNLOADING] ${url}...`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.arrayBuffer();

    // Resize and save as WebP
    await sharp(Buffer.from(buffer))
      .resize(IMAGE_WIDTH, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(targetPath);

    return true;
  } catch (err) {
    console.error(`[FAILED] ${url}: ${err.message}`);
    return false;
  }
}

// Simple slugify for filenames
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

async function main() {
  await ensureDir(IMAGE_DIR);

  // Find all markdown files in subdirectories
  // We use a simple recursive directory scan since we don't have 'glob' package installed by default?
  // Ah, we can just use recursive readdir or just install 'glob'.
  // Let's use recursive readdir for zero-dep (besides sharp).

  async function getFiles(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
      })
    );
    return files.flat();
  }

  const files = await getFiles(CONTENT_DIR);
  const mdFiles = files.filter((f) => f.endsWith('.md'));

  console.log(`Scanning ${mdFiles.length} files for remote images...`);

  for (const filePath of mdFiles) {
    let content = await fs.readFile(filePath, 'utf-8');
    let changed = false;

    // Regex to find "image: https://..."
    // We are looking for the YAML frontmatter key `image:`
    const imageRegex = /^image:\s*["']?(https?:\/\/[^"'\n]+)["']?/m;
    const match = content.match(imageRegex);

    if (match) {
      const remoteUrl = match[1];

      // Derive a filename. We can't easily get the "slug" from the file content
      // without parsing more, but we can use the basename of the file
      // OR the basename of the URL.
      // Let's use the file basename to keep it linked to the keyboard.
      // We slugify it to ensure it is URL safe (no spaces, special chars)
      const fileBasename = path.basename(filePath, '.md');
      const imageFilename = `${slugify(fileBasename)}.webp`;

      const success = await downloadAndResize(remoteUrl, imageFilename);

      if (success) {
        // Update the file content
        // Path should be relative from the markdown file to the image.
        // Markdown file: src/content/keyboards/split/foo.md
        // Image:         src/content/keyboards/images/foo.webp
        // Relative:      ../images/foo.webp

        const localPath = `../images/${imageFilename}`;
        content = content.replace(remoteUrl, localPath);

        // Also add image_fallback if not present
        if (!content.includes('image_fallback:')) {
          // Insert after image line
          const replacement = `image: ${localPath}\nimage_fallback: ${remoteUrl}`;
          content = content.replace(`image: ${localPath}`, replacement);
        }

        changed = true;
        console.log(`[UPDATED] ${path.basename(filePath)}`);
      }
    }

    if (changed) {
      await fs.writeFile(filePath, content);
    }
  }
}

main().catch(console.error);
