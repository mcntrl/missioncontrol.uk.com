import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const outputDir = resolve(process.cwd(), "public/assets/live");
await mkdir(outputDir, { recursive: true });

const assets = {
  "vulcan-works-hq.jpg": "https://wearemissioncontrol.com/img/vulcan-works-hq.jpg",
  "director.png": "https://wearemissioncontrol.com/img/director.png",
  "crew.png": "https://wearemissioncontrol.com/img/crew.png",
  "crew-2.png": "https://wearemissioncontrol.com/img/crew-2.png",
  "crew-3.png": "https://wearemissioncontrol.com/img/crew-3.png",
  "crew-4.png": "https://wearemissioncontrol.com/img/crew-4.png",
  "crew-5.png": "https://wearemissioncontrol.com/img/crew-5.png",
  "clickbsl.png": "https://assets.cdn.filesafe.space/jWVYkhK8m7JctGKdVpG4/media/68fe94236782e57dc7dc093f.png",
  "smartr.png": "https://wearemissioncontrol.com/img/clients/smartr.png",
  "rack.png": "https://wearemissioncontrol.com/img/clients/rack.png",
  "bikeaway.png": "https://bikeaway.com/wp-content/uploads/2025/12/bikeaway-warrior-logo-cycle-lockers.png",
  "blog-ai-app.webp": "https://missionhq.uk/wp-content/uploads/2026/02/65fc9dbd6fac491685435066_image-401.webp",
  "blog-right-tool.png": "https://missionhq.uk/wp-content/uploads/2025/08/Blog-Image-2.png",
  "blog-framework.jpg": "https://missionhq.uk/wp-content/uploads/2025/08/frametux.jpg",
  "blog-omarchy.png": "https://missionhq.uk/wp-content/uploads/2025/08/image.png",
  "clickbsl-detail.png": "https://missioncontrol.uk.com/wp-content/uploads/2026/02/clickbsl-1024x550.png",
  "framework-choices.png": "https://missioncontrol.uk.com/wp-content/uploads/2025/08/image-7-1024x692.png",
  "native-cross-platform.png": "https://missioncontrol.uk.com/wp-content/uploads/2025/08/image-8.png",
  "framework16.jpg": "https://missioncontrol.uk.com/wp-content/uploads/2025/08/framework16-768x1024.jpg",
  "displayport.jpg": "https://missioncontrol.uk.com/wp-content/uploads/2025/08/displayport-768x1024.jpg",
  "fairphone.png": "https://missioncontrol.uk.com/wp-content/uploads/2025/08/image-6-1024x344.png",
  "framework-tux.jpg": "https://missionhq.uk/wp-content/uploads/2025/08/frametux-1024x768.jpg",
  "linux-seminar.png": "https://missioncontrol.uk.com/wp-content/uploads/2025/08/image-4.png",
  "hyprland.png": "https://missioncontrol.uk.com/wp-content/uploads/2025/08/image-2-1024x576.png",
  "omarchy-use.png": "https://missioncontrol.uk.com/wp-content/uploads/2025/08/image-5.png",
  "linux-desktop.png": "https://missionhq.uk/wp-content/uploads/2025/08/image-1024x328.png",
};

const failures = [];
for (const [filename, url] of Object.entries(assets)) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    await writeFile(resolve(outputDir, filename), Buffer.from(await response.arrayBuffer()));
    console.log(`Downloaded ${filename}`);
  } catch (error) {
    failures.push({ filename, url, error: error.message });
    console.warn(`Skipped ${filename}: ${error.message}`);
  }
}

if (failures.length) console.warn(JSON.stringify({ failures }, null, 2));
