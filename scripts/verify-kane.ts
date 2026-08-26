import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const objectives: Record<string, { objective: string; timeout?: number; maxSteps?: number }> = {
	storefront: { objective: "Go to http://localhost:3000, verify the Telapsy storefront loads, the hero says 'Better things, chosen well.', and exactly four category shortcuts are visible." },
	search: {
		objective: "Go to http://localhost:3000/products, search for 'Pulse Wireless Headphones', verify only matching results remain, open the product, and verify its name, Electronics category, price, stock status, and Add to bag control are visible.",
	},
	filter: { objective: "Go to http://localhost:3000/products, filter by Electronics, verify Electronics products are shown and that a Fashion product named Velocity Sneakers is not shown in the filtered results." },
	guestCart: {
		objective: "Go to http://localhost:3000/products/velocity-sneakers, increase quantity to 2, add it to the bag, open the bag, and verify it contains Velocity Sneakers with quantity 2 and the line total equals twice the unit price.",
	},
	promoKane: {
		objective: "Go to http://localhost:3000/products/velocity-sneakers, add one item to the bag, open the bag, apply promo code KANE, verify a 20% discount is shown and the total is 80% of the subtotal, proceed to checkout, and verify the same discount and total persist.",
	},
	promoKane2026: { objective: "Go to http://localhost:3000/products/velocity-sneakers, add one item to the bag, open the bag, apply promo code ' kane2026 ', verify a 20% discount is shown and the total is 80% of the subtotal." },
	registration: {
		objective: "Go to http://localhost:3000/signup, create a new account using a unique email and a password of at least 8 characters containing letters and numbers, then verify the account page shows the authenticated user's name and an Available Telapsy Balance of $1,000.00.",
	},
	checkoutGuest: {
		objective: "Go to http://localhost:3000/products/velocity-sneakers, add one item to the bag, proceed through cart to checkout as a guest, enter valid contact and delivery details, choose Simulated Card, place the order, and verify the confirmation shows an order number, the correct product and quantity, matching subtotal and total, and Payment successful.",
		timeout: 360,
		maxSteps: 40,
	},
	checkoutBalance: {
		objective: "Go to http://localhost:3000/signup and create a new account with a unique email and a compliant password. Verify the starting Telapsy Balance is $1,000.00. Open Velocity Sneakers, add one to the bag, apply KANE, proceed to checkout, enter valid contact and delivery information, select Telapsy Balance, and place the order. Verify order confirmation shows Velocity Sneakers, a $68.00 subtotal, a $13.60 discount, a $54.40 total, and Payment successful. Then open the account and verify Available Telapsy Balance is exactly $945.60.",
		timeout: 480,
		maxSteps: 60,
	},
	orderHistory: {
		objective: "Go to http://localhost:3000/signup and create a new account with a unique email and compliant password. Buy one Velocity Sneakers using Telapsy Balance with valid checkout details. From confirmation, open My Orders, verify the newest order is listed, open it, and verify the product is Velocity Sneakers, quantity is 1, total is $68.00, delivery information is present, payment method is Telapsy Balance, and order status is processing.",
		timeout: 480,
		maxSteps: 60,
	},
};

async function reachable(url: string) {
	try {
		const response = await fetch(url);
		return response.ok;
	} catch {
		return false;
	}
}
async function main() {
	const key = process.argv[2] ?? "storefront";
	const config = objectives[key];
	if (!config) {
		console.error(`Unknown flow '${key}'. Available: ${Object.keys(objectives).join(", ")}`);
		process.exit(2);
	}
	if (!(await reachable("http://localhost:3000"))) {
		console.error("Telapsy is not reachable at http://localhost:3000. Start it with npm run dev.");
		process.exit(2);
	}
	const runDir = path.join(process.cwd(), "verification", "runs");
	await mkdir(runDir, { recursive: true });
	const stamp = new Date().toISOString().replace(/[:.]/g, "-");
	const outputPath = path.join(runDir, `${stamp}-${key}.ndjson`);
	const child = spawn("kane-cli", ["run", config.objective, "--agent", "--headless", "--timeout", String(config.timeout ?? 240), "--max-steps", String(config.maxSteps ?? 30)], { env: { ...process.env, KANE_CLI_USER_AGENT: "codex" } });
	let stdout = "";
	let stderr = "";
	child.stdout.on("data", (chunk) => (stdout += chunk));
	child.stderr.on("data", (chunk) => (stderr += chunk));
	const exitCode = await new Promise<number>((resolve) => child.on("close", (code) => resolve(code ?? 2)));
	await writeFile(outputPath, stdout);
	const events = stdout
		.split(/\r?\n/)
		.filter(Boolean)
		.flatMap((line) => {
			try {
				return [JSON.parse(line)];
			} catch {
				return [];
			}
		});
	const end = events.findLast((event) => event.type === "run_end");
	const failures = events.filter((event) => event.step && event.status === "failed");
	console.log(
		JSON.stringify(
			{
				flow: key,
				status: end?.status ?? "error",
				summary: end?.summary ?? stderr.trim() ?? "Kane did not return a terminal result.",
				duration: end?.duration,
				steps: events.filter((e) => e.step).length,
				failures: failures.map((f) => ({ step: f.step, remark: f.remark })),
				testUrl: end?.test_url,
				runDir: end?.run_dir,
				outputPath,
			},
			null,
			2,
		),
	);
	process.exit(exitCode || end?.status !== "passed" ? 1 : 0);
}
main().catch((error) => {
	console.error(error);
	process.exit(2);
});
