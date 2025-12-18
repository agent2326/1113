
import JSZip from 'jszip';
import { LandingPageConfig } from '../types';

// Helper to mimic file-saver saveAs
const saveAs = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const exportProjectToZip = async (config: LandingPageConfig) => {
  const zip = new JSZip();
  const assets = zip.folder("assets");
  
  // Clone config to avoid mutating state
  const localConfig = JSON.parse(JSON.stringify(config));
  
  // Helper to fetch image and add to zip
  const processImage = async (url: string | undefined, filenamePrefix: string): Promise<string | undefined> => {
      if (!url || !url.startsWith('http')) return url; // Skip empty or already local/base64
      
      try {
          const response = await fetch(url);
          const blob = await response.blob();
          if (assets) {
              const mime = blob.type;
              const ext = mime.split('/')[1] || 'jpg';
              const filename = `${filenamePrefix}.${ext}`;
              assets.file(filename, blob);
              return `./assets/${filename}`;
          }
      } catch (e) {
          console.warn("Could not fetch image for zip:", url);
      }
      return url; // Fallback to original URL
  };

  // 1. Process Global/Hero Images
  if (localConfig.hero.image) {
      localConfig.hero.image = await processImage(localConfig.hero.image, 'hero_main');
  }
  if (localConfig.navbar.logoImage) {
      localConfig.navbar.logoImage = await processImage(localConfig.navbar.logoImage, 'logo');
  }

  // 2. Process Content Blocks
  for (let i = 0; i < localConfig.contentBlocks.length; i++) {
      const block = localConfig.contentBlocks[i];
      
      // Main block image
      if (block.image) {
          block.image = await processImage(block.image, `block_${i}_main`);
      }

      // Items images
      if (block.items) {
          for (let j = 0; j < block.items.length; j++) {
              const item = block.items[j];
              const imgUrl = item.image || item.url || item.avatar;
              if (imgUrl) {
                  const newUrl = await processImage(imgUrl, `block_${i}_item_${j}`);
                  if (item.image) item.image = newUrl;
                  if (item.url) item.url = newUrl;
                  if (item.avatar) item.avatar = newUrl;
              }
          }
      }
  }

  // 3. Process Static Sections (Gallery, Features, etc. if used directly from config roots)
  // (Assuming mostly contentBlocks are used, but checking static gallery just in case)
  if (localConfig.gallery && localConfig.gallery.items) {
      for (let j = 0; j < localConfig.gallery.items.length; j++) {
          const item = localConfig.gallery.items[j];
          if (item.url) {
              item.url = await processImage(item.url, `static_gallery_${j}`) || item.url;
          }
      }
  }

  // Add Project JSON
  zip.file("project.json", JSON.stringify(localConfig, null, 2));
  
  // Add a simple README
  zip.file("README.txt", `Project Export\n\nThis archive contains your project configuration (project.json) and downloaded assets.\nYou can import this JSON file back into the Landing Page Generator.`);

  // Generate and Save
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `project-${config.navbar.logoText.replace(/\s+/g, '-').toLowerCase() || 'export'}.zip`);
};
