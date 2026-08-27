import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { catalog } from "../src/lib/catalog";

const imageQueries: Record<string, string> = {
  "velocity-sneakers": "white sneakers product",
  "urban-classic-hoodie": "black hoodie clothing product",
  "meridian-overshirt": "mens overshirt fashion",
  "everyday-relaxed-tee": "minimal t shirt clothing",
  "nova-denim-jacket": "denim jacket fashion",
  "avenue-chinos": "chino trousers fashion",
  "cloud-knit-sweater": "knit sweater fashion",
  "motion-joggers": "jogger pants fashion",
  "studio-polo": "polo shirt fashion",
  "metro-bomber": "bomber jacket fashion",
  "pulse-wireless-headphones": "wireless headphones product",
  "arc-mechanical-keyboard": "mechanical keyboard product",
  "halo-bluetooth-speaker": "bluetooth speaker product",
  "flux-wireless-mouse": "wireless mouse product",
  "beam-desk-light": "modern desk lamp product",
  "orbit-usb-c-hub": "usb c hub product",
  "echo-mini-earbuds": "wireless earbuds product",
  "frame-portable-monitor": "portable monitor desk",
  "volt-power-bank": "power bank product",
  "nest-charging-stand": "wireless charging stand product",
  "cove-table-lamp": "modern table lamp interior",
  "loom-throw-blanket": "throw blanket interior",
  "terra-ceramic-vase": "ceramic vase product",
  "haven-storage-basket": "woven storage basket interior",
  "drift-scent-diffuser": "essential oil diffuser product",
  "ember-coffee-mug-set": "ceramic coffee mugs product",
  "ridge-wall-clock": "modern wall clock interior",
  "linen-cushion-set": "linen cushions interior",
  "grove-plant-pot": "indoor plant pot product",
  "slate-serving-board": "wooden serving board product",
  "atlas-backpack": "minimal backpack product",
  "axis-wristwatch": "wristwatch product",
  "metro-sunglasses": "sunglasses product",
  "loop-leather-belt": "leather belt product",
  "forma-crossbody-bag": "crossbody bag product",
  "pivot-card-holder": "leather card holder product",
  "trail-cap": "baseball cap product",
  "halo-bracelet": "minimal bracelet jewelry",
  "grid-laptop-sleeve": "laptop sleeve product",
  "meridian-tote": "canvas tote bag product",
};

interface UnsplashPhoto {
  id: string;
  premium?: boolean;
  plus?: boolean;
  urls: { raw: string };
  links: { html: string };
  user: { name: string; links: { html: string } };
}

interface UnsplashSearch {
  results: UnsplashPhoto[];
}

const outputDirectory = path.join(process.cwd(), "public", "products");
const usedPhotos = new Set<string>();
const credits: string[] = [];

async function fetchImage(slug: string, name: string) {
  const query = imageQueries[slug];
  if (!query) throw new Error(`Missing image query for ${slug}`);

  const searchUrl = new URL("https://unsplash.com/napi/search/photos");
  searchUrl.searchParams.set("query", query);
  searchUrl.searchParams.set("per_page", "20");
  searchUrl.searchParams.set("page", "1");
  const searchResponse = await fetch(searchUrl, { headers: { "User-Agent": "Telapsy catalog seeder" } });
  if (!searchResponse.ok) throw new Error(`Unsplash search failed for ${name}: ${searchResponse.status}`);
  const search = await searchResponse.json() as UnsplashSearch;
  const photo = search.results.find((candidate) => !candidate.premium && !candidate.plus && !usedPhotos.has(candidate.id));
  if (!photo) throw new Error(`No suitable free photograph found for ${name}`);
  usedPhotos.add(photo.id);

  const imageUrl = new URL(photo.urls.raw);
  imageUrl.searchParams.set("auto", "format");
  imageUrl.searchParams.set("fit", "crop");
  imageUrl.searchParams.set("fm", "webp");
  imageUrl.searchParams.set("h", "900");
  imageUrl.searchParams.set("q", "82");
  imageUrl.searchParams.set("w", "900");
  const imageResponse = await fetch(imageUrl, { headers: { "User-Agent": "Telapsy catalog seeder" } });
  if (!imageResponse.ok) throw new Error(`Image download failed for ${name}: ${imageResponse.status}`);
  const image = Buffer.from(await imageResponse.arrayBuffer());
  if (image.byteLength < 10_000) throw new Error(`Downloaded image for ${name} is unexpectedly small`);
  await writeFile(path.join(outputDirectory, `${slug}.webp`), image);
  credits.push(`- **${name}** — Photo by [${photo.user.name}](${photo.user.links.html}) on [Unsplash](${photo.links.html})`);
  process.stdout.write(`Downloaded ${name}\n`);
}

async function main() {
  if (catalog.length !== 40 || Object.keys(imageQueries).length !== 40) throw new Error("The image manifest must cover exactly 40 products.");
  await mkdir(outputDirectory, { recursive: true });
  for (let index = 0; index < catalog.length; index += 4) {
    await Promise.all(catalog.slice(index, index + 4).map((product) => fetchImage(product.slug, product.name)));
  }
  const attribution = [
    "# Product photography attribution",
    "",
    "Telapsy stores optimized local copies of these Unsplash photographs so the demo remains reliable. Product names and descriptions are fictional.",
    "",
    ...credits,
    "",
  ].join("\n");
  await writeFile(path.join(outputDirectory, "ATTRIBUTION.md"), attribution);
  process.stdout.write(`Prepared ${catalog.length} product images.\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
