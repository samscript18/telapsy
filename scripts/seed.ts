import { loadEnvConfig } from "@next/env";
import { connectDb } from "../src/lib/db";
import { catalog } from "../src/lib/catalog";
import { Product } from "../src/models/Product";

loadEnvConfig(process.cwd());

async function seed() {
	await connectDb();
	await Product.bulkWrite(
		catalog.map((entry) => {
			const product = {
				name: entry.name,
				slug: entry.slug,
				description: entry.description,
				priceCents: entry.priceCents,
				category: entry.category,
				image: entry.image,
				stock: entry.stock,
				featured: entry.featured,
				rating: entry.rating,
				reviewCount: entry.reviewCount,
			};
			return { updateOne: { filter: { slug: product.slug }, update: { $set: product }, upsert: true } };
		}),
	);
	const slugs = catalog.map((product) => product.slug);
	await Product.deleteMany({ slug: { $nin: slugs } });
	const counts = await Product.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
	console.log(JSON.stringify({ total: await Product.countDocuments(), categories: counts }, null, 2));
	process.exit(0);
}

seed().catch((error) => {
	console.error(error);
	process.exit(1);
});
