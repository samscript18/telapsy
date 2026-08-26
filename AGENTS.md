# TELAPSY — AGENTS.md

## Mission

You are the primary autonomous coding agent responsible for building **Telapsy** from an empty repository into a complete, polished, working, demo-ready hackathon submission.

Telapsy is an **AI-verified e-commerce application**.

The application itself must provide a real end-to-end shopping experience, but the defining feature of the project is its development and verification loop:

**Codex writes or modifies Telapsy → Kane CLI opens the real application in a browser → Kane verifies the user flow → Kane returns structured verification results → Codex reads those results → Codex fixes any legitimate application failure → Kane reruns → verification passes.**

The final product must visibly demonstrate that the coding agent does not merely generate code. It verifies what it ships using Kane CLI and repairs real regressions based on Kane evidence.

This project is being built for the **Kane CLI Online Hackathon by TestMu AI**.

The hackathon prioritizes:

1. A working application that ships.
2. Meaningful verification using Kane CLI.
3. A genuine closed loop between the coding agent and Kane.
4. Craft, polish, usefulness, and technical quality.

Treat the **Codex ↔ Kane closed loop as a first-class product requirement**, not an afterthought.

---

# 1. NON-NEGOTIABLE DEVELOPMENT PRINCIPLES

Follow these rules for the entire project.

## 1.1 Build incrementally

Do not attempt to generate the entire application in one uncontrolled pass.

Work feature by feature.

For each meaningful feature:

1. Understand the requirement.
2. Implement the smallest complete version.
3. Run static checks.
4. Run relevant unit/business-logic checks where applicable.
5. Start or reuse the running application.
6. Invoke Kane CLI against the real browser.
7. Parse Kane's result.
8. If Kane reports an application failure, investigate it.
9. Fix the root cause.
10. Rerun Kane.
11. Continue only after the affected critical flow passes.

---

# 2. REQUIRED TECHNOLOGY STACK

Build Telapsy with:

* Next.js
* App Router
* TypeScript
* React
* Tailwind CSS
* React query
* Zustand
* MongoDB
* Mongoose
* Next.js Route Handlers and/or Server Actions
* Zod for validation where useful
* bcrypt or bcryptjs for password hashing
* secure session/authentication mechanism appropriate for Next.js
* Kane CLI for browser verification

Do not introduce unnecessary architectural complexity.

Do NOT build:

* a separate Express backend
* microservices
* Redis
* Kafka
* GraphQL unless absolutely necessary
* Stripe
* Paystack
* Flutterwave
* real cryptocurrency infrastructure
* blockchain integrations
* a real payment provider
* a separate admin application
* unnecessary enterprise systems

Keep Telapsy as one coherent Next.js full-stack application.

---

# 3. APPLICATION PURPOSE

Telapsy is a lightweight modern e-commerce store built around one idea:

An AI coding agent should not merely build software.

It should be able to **verify and repair what it builds**.

The e-commerce system exists because commerce naturally provides meaningful browser-verification opportunities:

* authentication
* search
* product discovery
* product details
* quantities
* carts
* state changes
* arithmetic
* discounts
* balances
* checkout
* forms
* validation
* order creation
* order history
* cross-page consistency

These workflows give Kane useful behavior to verify.

---

# 4. PRIMARY USER JOURNEY

The primary Telapsy journey is:

Landing page
→ Sign up OR continue as guest
→ Browse products
→ Search/filter products
→ Open product details
→ Choose quantity
→ Add product to cart
→ Modify cart
→ Optionally apply promo
→ Checkout
→ Enter customer information
→ Enter delivery information
→ Select simulated payment method
→ Place order
→ View successful confirmation
→ Registered users can view order history

Every stage must work with actual application state.

Do not fake navigation with static screenshots.

---

# 5. CORE PAGES

Build at minimum:

* `/`
* `/products`
* `/products/[slug]`
* `/cart`
* `/checkout`
* `/checkout/success/[orderNumber]` or equivalent
* `/signup`
* `/signin`
* `/account`
* `/orders`
* `/orders/[id]`

Additional routes may be added if required.

---

# 6. LANDING PAGE

The landing page should feel like a polished modern e-commerce storefront.

Include:

* Telapsy branding
* navigation
* product search
* featured product section
* category shortcuts
* featured/new product cards
* cart indicator
* account/sign-in entry
* strong hero area
* responsive design

A user should immediately understand that Telapsy is a shopping application.

Avoid excessive text explaining Kane on the storefront itself.

The consumer-facing application should feel like a real store.

---

# 7. PRODUCT CATEGORIES

Create exactly **4 primary categories** unless later requirements explicitly change this.

Use:

1. Fashion
2. Electronics
3. Home
4. Accessories

Seed exactly **10 products per category**.

Total seeded products:

**40 products**

---

# 8. PRODUCT SEEDING

Create a deterministic database seed script.

Recommended command:

```bash
npm run seed
```

The seed operation should be safely rerunnable.

Where appropriate, use upsert logic or clear/reseed only the seeded collections.

Each category must contain exactly 10 realistic products.

Each product should contain fields similar to:

```ts
{
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
  rating?: number;
  reviewCount?: number;
}
```

Use realistic but fictional product names.

Examples:

## Fashion

* Velocity Sneakers
* Urban Classic Hoodie
* Meridian Overshirt
* Everyday Relaxed Tee
* Nova Denim Jacket
* Avenue Chinos
* Cloud Knit Sweater
* Motion Joggers
* Studio Polo
* Metro Bomber

## Electronics

* Pulse Wireless Headphones
* Arc Mechanical Keyboard
* Halo Bluetooth Speaker
* Flux Wireless Mouse
* Beam Desk Light
* Orbit USB-C Hub
* Echo Mini Earbuds
* Frame Portable Monitor
* Volt Power Bank
* Nest Charging Stand

## Home

* Cove Table Lamp
* Loom Throw Blanket
* Terra Ceramic Vase
* Haven Storage Basket
* Drift Scent Diffuser
* Ember Coffee Mug Set
* Ridge Wall Clock
* Linen Cushion Set
* Grove Plant Pot
* Slate Serving Board

## Accessories

* Atlas Backpack
* Axis Wristwatch
* Metro Sunglasses
* Loop Leather Belt
* Forma Crossbody Bag
* Pivot Card Holder
* Trail Cap
* Halo Bracelet
* Grid Laptop Sleeve
* Meridian Tote

You may refine names, descriptions, stock quantities, images, and prices while preserving exactly 10 products per category.

---

# 9. PRODUCT IMAGES

Prefer stable local product assets under:

```text
/public/products/
```

Avoid making the demo depend on unreliable external image URLs.

If temporary placeholders are required during initial development, replace them before final submission.

All 40 products should have coherent visual presentation.

---

# 10. PRODUCT DISCOVERY

Users must be able to:

* browse products
* search products
* filter by category
* open product details
* see name
* see description
* see price
* see stock status
* choose quantity
* add product to cart

Search should work against product name and preferably description/category.

Filtering should update results correctly.

Empty search/filter states should be handled cleanly.

---

# 11. PRODUCT DETAILS

Product pages must display:

* product image
* name
* category
* price
* description
* stock status
* quantity selector
* Add to Cart button
* sensible related products if easy to implement

Do not allow quantity below 1.

Do not allow impossible quantities beyond available stock.

---

# 12. CART

The cart is one of the most important Kane verification targets.

The cart must display:

* product
* image
* unit price
* quantity
* line total
* subtotal
* discount
* shipping
* final total

Users must be able to:

* increase quantity
* decrease quantity
* remove item
* clear cart if useful
* continue shopping
* apply promo code
* proceed to checkout

All calculations must update immediately and consistently.

---

# 13. CART CALCULATION RULES

Use monetary values carefully.

Avoid floating-point errors where possible.

Prefer integer cents internally or another reliable monetary calculation strategy.

Calculation order:

```text
subtotal = sum(unitPrice × quantity)

discount = applicablePromo(subtotal)

discountedSubtotal = subtotal - discount

shipping = calculateShipping(discountedSubtotal)

finalTotal = discountedSubtotal + shipping
```

For the hackathon MVP:

Shipping should preferably be:

```text
FREE
```

or:

```ts
shipping = 0;
```

unless there is a strong implementation reason otherwise.

Keep arithmetic predictable for Kane verification.

---

# 14. PROMO CODES

Support both promo codes:

```text
KANE
KANE2026
```

Both grant:

**20% OFF merchandise subtotal**

Rules:

* codes should be case-insensitive
* trim whitespace
* only one promo may be active
* the same code cannot stack repeatedly
* both aliases represent the same promotion
* invalid codes produce a clear message
* discount must appear in cart
* discount must persist into checkout
* discount must appear on confirmation
* discount must persist into stored order data
* order history/details must display the correct discounted amount

Example:

```text
Subtotal: $200
Discount: -$40
Shipping: FREE
Total: $160
```

This flow is a critical Kane regression target.

---

# 15. ACCOUNT CREATION

Signup fields:

* name
* email
* password
* confirm password if desired

Requirements:

* validate email
* enforce reasonable password constraints
* ensure duplicate email addresses cannot create duplicate users
* hash passwords
* never store plain-text passwords

After successful registration:

* create session
* log user in
* initialize Telapsy balance
* redirect to account/dashboard or storefront

---

# 16. SIGNUP BONUS

Every newly registered user receives:

```text
$1,000.00
```

in simulated **Telapsy Balance**.

Store this internally as cents if possible:

```ts
balanceCents = 100000;
```

The balance is fictional demo money.

It has no real-world monetary value.

Never integrate real deposits, withdrawals, crypto transactions, or external payment rails.

Display it clearly as:

**Telapsy Balance**

Example:

```text
Available Balance
$1,000.00
```

---

# 17. GUEST SHOPPING

Guests can:

* browse
* search
* filter
* open products
* add items to cart
* modify cart
* apply promo codes
* checkout
* receive order confirmation

Guests do not receive the $1,000 signup balance.

Guests should use the simulated payment option.

Provide a guest checkout flow that does not require account creation.

---

# 18. AUTHENTICATION

Implement proper application authentication.

Support:

* signup
* signin
* signout
* authenticated user session
* protected account route
* protected order history route

Guest cart behavior must continue working independently.

Do not store sensitive authentication state insecurely.

---

# 19. SIMULATED PAYMENTS

There is **no real payment processing**.

Implement two payment choices for registered users:

### Telapsy Balance

Use the user's simulated $1,000 balance.

Rules:

* calculate final order total
* verify user has enough simulated balance
* if balance is sufficient, deduct final order total
* create order
* show confirmation
* updated account balance must be correct

Example:

```text
Balance before: $1,000.00
Order total: $160.00
Balance after: $840.00
```

Kane must verify these state transitions.

### Simulated Card

Available to guests and registered users.

This is a demo payment interface.

Do NOT collect or persist real card information.

Use obvious test/demo fields or omit sensitive-looking fields entirely.

If card-like fields are used, label the system clearly as simulated.

Valid completion of the form should result in payment success.

No external payment API should be called.

The simulated payment should deterministically succeed whenever the checkout form is valid.

---

# 20. CHECKOUT

Checkout must collect:

## Contact information

* name
* email
* phone

## Delivery information

* address
* city
* state
* country

## Payment

Registered users:

* Telapsy Balance
* Simulated Card

Guests:

* Simulated Card

Display a full order summary including:

* items
* quantities
* subtotal
* discount
* shipping
* total

The final checkout amount MUST match the cart.

This consistency is one of the most important Kane verification assertions.

---

# 21. ORDER CREATION

On successful checkout:

Create an Order document.

Order should persist:

* unique order number
* user ID when registered
* guest email if guest
* products
* product names at purchase
* quantities
* unit prices
* line totals
* subtotal
* discount
* promo code
* shipping
* final total
* customer information
* delivery information
* payment method
* payment status
* order status
* createdAt

Use immutable snapshots for purchase-critical product data.

Do not make historical orders depend solely on current product prices.

---

# 22. ORDER NUMBER

Generate human-readable order numbers such as:

```text
TEL-10482
```

Ensure reasonable uniqueness.

---

# 23. ORDER CONFIRMATION

After successful checkout show something equivalent to:

```text
Order Confirmed!

Order #TEL-10482

2 × Velocity Sneakers
1 × Urban Classic Hoodie

Subtotal: $240.00
Discount: -$48.00
Shipping: FREE
Total: $192.00

Payment: Successful
```

Include:

* Continue Shopping
* View Order

Registered users can navigate to order history.

---

# 24. ORDER HISTORY

Registered users must have:

```text
My Orders
```

Display:

* order number
* date
* total
* status

Clicking an order should show:

* products
* quantities
* purchase-time prices
* subtotal
* discount
* shipping
* final total
* delivery information
* payment method
* order status

Newest orders should appear first.

---

# 25. GUEST ORDER EXPERIENCE

At minimum, guests receive a confirmation page.

If time permits, implement guest order lookup using:

* order number
* checkout email

Do not let this delay core requirements.

---

# 26. MONGOOSE MODELS

Create well-designed models.

At minimum:

```text
User
Product
Order
```

Cart may be:

* persisted in database, OR
* managed client-side/server-side with appropriate session state

Choose the simplest robust architecture.

Promo codes may either:

* exist as database documents, or
* be implemented as deterministic application configuration

For this hackathon, avoid unnecessary database complexity.

---

# 27. RECOMMENDED USER MODEL

Conceptually:

```ts
User {
  name
  email
  passwordHash
  balanceCents
  createdAt
  updatedAt
}
```

---

# 28. RECOMMENDED PRODUCT MODEL

Conceptually:

```ts
Product {
  name
  slug
  description
  priceCents
  category
  image
  stock
  featured
  createdAt
  updatedAt
}
```

---

# 29. RECOMMENDED ORDER MODEL

Conceptually:

```ts
Order {
  orderNumber
  userId?
  guestEmail?
  items[]
  subtotalCents
  discountCents
  shippingCents
  totalCents
  promoCode?
  customer
  delivery
  paymentMethod
  paymentStatus
  orderStatus
  createdAt
}
```

---

# 30. UX / UI QUALITY

Telapsy must look deliberate and polished.

Prioritize:

* good spacing
* consistent typography
* responsive layouts
* skeleton/loading states where appropriate
* clear empty states
* readable forms
* button states
* disabled states
* error feedback
* success feedback
* mobile compatibility
* meaningful product cards
* polished cart
* polished checkout
* professional order confirmation

Avoid overengineering visual effects.

The storefront should look modern, fast, and coherent.

---

# 31. ACCESSIBILITY

Use:

* semantic HTML
* actual labels
* keyboard-accessible controls
* visible focus states
* meaningful button text
* alt text
* appropriate contrast

This also makes browser automation more reliable.

---

# 32. STABLE TESTABILITY

Build UI controls in a way that makes browser interaction deterministic.

Do not rely on unstable generated content for critical flow labels.

Use meaningful accessible names.

Where useful, add stable `data-testid` attributes, but do not design Kane flows around brittle selectors.

Kane works from natural-language browser objectives, so make the UI understandable to humans.

---

# 33. KANE CLI IS REQUIRED

For any task requiring a real browser:

* opening pages
* clicking UI
* filling forms
* verifying page state
* checking cart behavior
* validating checkout
* observing confirmation
* checking displayed balances
* testing authentication

use **Kane CLI**.

Do not replace Kane with:

* Playwright
* Puppeteer
* Selenium

for hackathon browser verification.

Unit tests and business-logic tests may use ordinary testing tools, but the real browser verification layer must be Kane CLI.

---

# 34. INSTALL KANE CLI

Ensure Kane is available.

Check:

```bash
kane-cli --version
```

If not installed:

```bash
npm install -g @testmuai/kane-cli
```

Also install the official Kane skill when appropriate:

```bash
npx @testmuai/kane-cli-skill
```

For Codex specifically, the official skill instructions may be appended to this project-level `AGENTS.md`.

Do not overwrite these Telapsy instructions when installing the Kane skill.

Append/merge carefully.

---

# 35. KANE AUTHENTICATION

Before verification:

```bash
kane-cli whoami
```

If authentication is required, use the supported TestMu credentials mechanism.

Do not commit credentials.

Never put:

* username
* access key
* tokens
* passwords

inside Git.

Use environment variables or local ignored configuration.

---

# 36. KANE AGENT MODE

Whenever Codex invokes Kane programmatically, use:

```bash
kane-cli run "<objective>" --agent
```

For headless execution:

```bash
kane-cli run "<objective>" --agent --headless
```

`--agent` is mandatory for machine-readable integration.

Do not build the closed loop by scraping human-oriented terminal rendering.

---

# 37. NDJSON HANDLING

Kane `--agent` mode outputs NDJSON.

Parse the stream line by line.

Do not assume progress events have stable schemas.

Use the final event where:

```json
{
  "type": "run_end"
}
```

as the authoritative terminal state for automation.

The post-run automation must derive:

* passed / failed
* summary
* useful failure reason
* run directory when available
* useful evidence references
* screenshots/logs where available

Do not report success merely because earlier progress steps passed.

Wait for `run_end`.

---

# 38. KANE OBJECTIVE DESIGN

Each Kane objective should represent one clear browser task.

Preferred style:

```bash
kane-cli run "Go to http://localhost:3000 and create a new Telapsy account, then verify the account page appears with a $1,000.00 Telapsy Balance." --agent
```

Avoid huge instructions containing dozens of unrelated behaviors.

If a journey becomes larger than roughly 15 meaningful interaction steps, split it into smaller verification objectives.

---

# 39. PERSISTED KANE TESTS

Create:

```text
tests/kane/
```

Maintain meaningful `_test.md` files for critical stable regression flows when appropriate.

Suggested files:

```text
tests/kane/
  registration_test.md
  login_test.md
  product_search_test.md
  product_filter_test.md
  guest_cart_test.md
  registered_cart_test.md
  cart_quantity_test.md
  coupon_kane_test.md
  coupon_kane2026_test.md
  checkout_guest_test.md
  checkout_balance_test.md
  checkout_card_test.md
  order_confirmation_test.md
  order_history_test.md
```

Commit these tests.

The test suite should represent actual product requirements.

---

# 40. REQUIRED KANE VERIFICATION FLOWS

At minimum Kane must verify the following.

## Flow 1 — Registration

```text
Open Telapsy
→ create account
→ verify account was created
→ verify user is authenticated
→ verify Telapsy Balance displays $1,000.00
```

## Flow 2 — Guest Shopping

```text
Continue as guest
→ browse products
→ open product
→ change quantity
→ add to cart
→ verify correct product and quantity appear
```

## Flow 3 — Product Search

```text
Search for a known seeded product
→ verify correct matching product appears
→ open product
→ verify product information
```

## Flow 4 — Category Filter

```text
Open products
→ filter by Electronics
→ verify Electronics products appear
→ verify products from unrelated categories are not presented as filtered results
```

## Flow 5 — Cart Mutation

```text
Add products
→ increase quantity
→ verify subtotal changes
→ decrease quantity
→ remove product
→ verify cart totals update correctly
```

## Flow 6 — KANE Promo

```text
Add known product
→ apply KANE
→ verify 20% discount
→ proceed to checkout
→ verify checkout uses discounted total
```

## Flow 7 — KANE2026 Promo

Repeat equivalent verification using:

```text
KANE2026
```

## Flow 8 — Guest Checkout

```text
Guest
→ product
→ cart
→ checkout
→ complete contact details
→ delivery details
→ simulated payment
→ place order
→ verify confirmation
```

## Flow 9 — Telapsy Balance Checkout

```text
Create/sign in to registered account
→ note initial $1,000.00 balance
→ buy known item
→ apply promo when relevant
→ pay using Telapsy Balance
→ verify order succeeds
→ verify exact correct balance deduction
```

## Flow 10 — Confirmation

Verify:

* order number
* products
* quantities
* subtotal
* discount
* total
* successful status

## Flow 11 — Order History

```text
Sign in
→ open My Orders
→ verify latest order exists
→ open it
→ verify products and amount match checkout
```

---

# 41. CLOSED-LOOP DEVELOPMENT

This is the core hackathon behavior.

Whenever Codex implements or changes a user-facing feature:

```text
CODE CHANGE
      ↓
STATIC CHECKS
      ↓
RUN APPLICATION
      ↓
KANE CLI
      ↓
REAL BROWSER
      ↓
PASS / FAIL
```

If PASS:

```text
record verification
continue development
```

If FAIL:

```text
capture run_end
      ↓
inspect Kane evidence
      ↓
determine whether this is:
application regression
test/objective issue
environment issue
      ↓
if application regression:
diagnose root cause
      ↓
fix code
      ↓
rerun checks
      ↓
rerun same Kane objective
      ↓
require PASS
```

Do not declare a feature complete after modifying code without re-verifying the browser behavior.

---

# 42. DO NOT BLINDLY FIX KANE FAILURES

A Kane failure does not automatically mean the product is broken.

When Kane fails:

1. Read `run_end`.
2. Inspect relevant logs.
3. Inspect screenshots/evidence where available.
4. Compare observed behavior with actual Telapsy requirements.
5. Classify the failure.

Classifications:

```text
APPLICATION_BUG
KANE_OBJECTIVE_PROBLEM
ENVIRONMENT_FAILURE
EXPECTED_BEHAVIOR_CHANGE
UNKNOWN
```

Only modify application code when the evidence supports an application bug.

Do not corrupt correct application behavior simply to make a flawed objective pass.

---

# 43. REGRESSION CAMPAIGN

Telapsy should contain a controlled regression verification campaign of approximately:

**65 distinct regression cases**

The purpose is to demonstrate that Kane can detect meaningful changes and Codex can repair them.

Do NOT inject all bugs simultaneously.

Do NOT leave intentionally broken behavior in the final application.

Instead:

```text
baseline passing application
→ activate one controlled regression
→ run targeted Kane verification
→ observe real failure
→ record evidence
→ Codex diagnoses
→ Codex repairs
→ rerun same Kane verification
→ confirm PASS
→ record resolution
→ proceed to next case
```

The final repository must be fully repaired and passing.

---

# 44. REGRESSION CAMPAIGN DISTRIBUTION

Target:

```text
Registration / authentication     8
Product discovery                 7
Product details                   5
Cart                             12
Promo codes                       8
Signup balance                    6
Checkout / payment               10
Confirmation / orders             9
-----------------------------------
TOTAL                            65
```

Individual cases should be genuinely different.

Do not count the same underlying bug repeatedly.

---

# 45. EXAMPLE REGRESSIONS

Possible controlled regressions include:

### Registration

* signup button fails
* account not persisted
* user isn't logged in after signup
* starting balance not assigned
* starting balance displayed incorrectly
* duplicate email accepted
* invalid form accepted
* redirect goes to wrong destination

### Product discovery

* search ignores term
* search returns unrelated products
* category filter ignored
* filter resets unexpectedly
* product card links wrong slug
* price shown incorrectly
* unavailable product mistakenly shown as available

### Product details

* quantity cannot increment
* quantity can become zero
* wrong product added to cart
* wrong price displayed
* Add to Cart does nothing

### Cart

* quantity changes don't update subtotal
* removing item doesn't update subtotal
* removed item remains visible
* duplicate additions create wrong quantity
* wrong unit price
* wrong line total
* stale subtotal
* empty-cart state broken
* cart count wrong
* cart disappears during navigation
* checkout receives stale cart
* multiple quantities calculated incorrectly

### Promo

* valid code rejected
* invalid code accepted
* code applied twice
* discount uses wrong percentage
* discount not persisted to checkout
* discount displayed but total unchanged
* whitespace handling broken
* KANE2026 alias broken

### Balance

* signup balance missing
* signup balance wrong
* balance not deducted
* balance deducted twice
* balance deduction ignores promo
* displayed balance stale after order

### Checkout

* cart items missing
* checkout subtotal stale
* checkout discount stale
* final total wrong
* required field ignored
* valid form incorrectly rejected
* payment choice not respected
* order not created
* duplicate order created
* simulated card completion fails

### Orders

* confirmation amount wrong
* confirmation quantity wrong
* order number missing
* latest order absent
* orders sorted incorrectly
* order details use current product price
* delivery information lost
* payment method incorrect
* order status missing

These are examples.

Choose deterministic regressions that Kane can clearly observe in the browser.

---

# 46. REGRESSION IMPLEMENTATION SAFETY

Do not create a dangerous uncontrolled mechanism that randomly breaks production.

Preferred approaches:

* temporary local code mutation
* dedicated development-only fault flag
* scripted source mutation that is immediately reverted/repaired
* isolated branch/commit experimentation

If adding fault flags, ensure they are:

* development-only
* disabled by default
* excluded from production behavior
* clearly documented

The final deployed Telapsy must never activate faults.

---

# 47. BUG LEDGER

Maintain both:

```text
verification/BUG_LEDGER.md
verification/bug-ledger.json
```

These documents must represent **actual verification runs**.

Do not fabricate Kane detections.

Do not populate a bug as “verified” until an actual Kane run has produced corresponding evidence.

---

# 48. BUG LEDGER ENTRY

Each issue should record:

```text
ID
Area
Description
Regression/mutation
Expected behavior
Observed behavior
Initial Kane status
Kane summary
Evidence/run location
Codex diagnosis
Root cause
Files changed
Fix
Re-verification Kane status
Final status
Timestamp
```

Example:

```text
TEL-BUG-017

Area:
Coupon / Checkout

Regression:
Checkout consumed original subtotal instead of discounted total.

Expected:
$80.00

Observed:
$100.00

Kane:
FAILED

Codex diagnosis:
Cart calculated discount correctly but checkout loaded subtotal instead of calculated final total.

Fix:
Checkout now uses canonical pricing calculation.

Kane re-verification:
PASSED

Status:
FIXED
```

---

# 49. MACHINE-READABLE LEDGER

Suggested schema:

```ts
interface VerificationBug {
  id: string;
  area: string;
  description: string;
  expected: string;
  observed: string;
  kaneRunBefore?: string;
  kaneStatusBefore: "passed" | "failed" | "error";
  diagnosis?: string;
  rootCause?: string;
  changedFiles?: string[];
  fix?: string;
  kaneRunAfter?: string;
  kaneStatusAfter?: "passed" | "failed" | "error";
  status: "detected" | "fixing" | "fixed" | "invalid";
  createdAt: string;
  fixedAt?: string;
}
```

Only persist evidence that genuinely exists.

---

# 50. VERIFICATION DIRECTORY

Use:

```text
verification/
├── BUG_LEDGER.md
├── bug-ledger.json
├── runs/
├── evidence/
└── reports/
```

Do not commit enormous disposable binaries if repository size becomes problematic.

Preserve useful evidence references.

---

# 51. AUTOMATED KANE WRAPPER

Create a project script for consistent verification.

Example conceptual interface:

```bash
npm run verify:kane -- checkout
```

The wrapper should:

1. ensure the application is reachable
2. invoke Kane with `--agent`
3. capture stdout
4. parse NDJSON
5. identify `run_end`
6. return non-zero when verification fails
7. preserve useful evidence
8. produce a concise summary

Do not hardcode secrets.

---

# 52. REPAIR LOOP

Where feasible, provide an orchestration script conceptually equivalent to:

```text
perform code change
→ start/verify dev server
→ run Kane
→ parse run_end

if passed:
    record success
    exit

if failed:
    expose Kane failure to Codex
    inspect evidence
    repair application
    rerun Kane
```

Codex itself is responsible for diagnosis and repair.

Do not implement fake logic that automatically edits code without understanding the failure.

---

# 53. DEVELOPMENT SERVER

Prefer:

```bash
npm run dev
```

During verification ensure the server is ready before invoking Kane.

Use:

```text
http://localhost:3000
```

unless another port is required.

Avoid launching duplicate development servers.

---

# 54. BUILD QUALITY GATES

Regularly run:

```bash
npm run lint
npm run typecheck
npm run build
```

Add scripts if required.

Before final submission all must pass.

---

# 55. DATABASE ENVIRONMENT

Use:

```env
MONGODB_URI=
```

Create:

```text
.env.example
```

Do not commit `.env.local`.

Handle absent MongoDB configuration with a useful error message.

---

# 56. DATABASE CONNECTION

Implement a reusable Mongoose connection utility that avoids excessive connections during Next.js development hot reloads.

Do not reconnect separately on every operation unnecessarily.

---

# 57. TRANSACTIONAL ORDER SAFETY

For Telapsy Balance checkout:

Prevent obvious double-submit problems.

Disable Place Order while an order is processing.

Where feasible:

* validate cart server-side
* calculate authoritative totals server-side
* verify available balance server-side
* deduct balance
* create order atomically or safely enough for this MVP

Never trust totals sent solely by the client.

---

# 58. SERVER-SIDE PRICING AUTHORITY

The server must recalculate:

* product prices
* quantities
* promo discount
* total

before creating the order.

The browser may display calculated values, but it must not be the ultimate pricing authority.

This creates meaningful full-stack behavior for Kane to verify.

---

# 59. SECURITY BASICS

Implement reasonable hackathon-level security:

* hash passwords
* validate inputs
* sanitize/normalize promo codes
* do not expose secrets
* protected routes
* verify user identity before fetching user orders
* prevent one user from reading another user's orders
* do not persist sensitive fake card information
* server-side total calculation

Do not overbuild advanced security systems at the expense of shipping.

---

# 60. DATA CONSISTENCY

Use a single shared pricing calculation function where practical.

Avoid duplicating promo arithmetic independently in:

* cart
* checkout
* order creation
* confirmation

Duplicated calculations create avoidable regressions.

However, regression tests should intentionally confirm that values remain consistent across all screens.

---

# 61. ERROR HANDLING

Handle:

* failed DB connection
* invalid login
* duplicate signup
* nonexistent product
* out-of-stock product
* invalid promo
* empty cart checkout
* invalid checkout fields
* insufficient Telapsy Balance
* missing order
* unauthorized order access

Errors should be useful to users and diagnosable by Kane.

---

# 62. RESPONSIVE DESIGN

Verify at least basic desktop and mobile behavior.

Primary hackathon demo should prioritize desktop reliability.

---

# 63. LOADING STATES

Prevent repeated actions caused by impatient clicks.

Examples:

* Creating account…
* Adding…
* Applying…
* Processing order…

Disable corresponding buttons when asynchronous operations are running.

---

# 64. EMPTY STATES

Implement polished states for:

* empty cart
* no products matching search
* no orders
* unavailable product

---

# 65. TOASTS / FEEDBACK

Use clear feedback for:

* added to cart
* item removed
* promo applied
* invalid promo
* signup success
* login error
* order success

Do not rely exclusively on transient toast messages for critical verification.

Important state should remain visible on the page.

---

# 66. TEST DATA

Create deterministic known users where useful for local regression testing.

If seeding a demo user, clearly document it.

Never put real credentials into the public repository.

A safe local demo account may be seeded using environment-driven credentials.

---

# 67. FINAL DEMO ACCOUNT

If judges require authentication, provide simple working demo credentials in the submission documentation only if they are safe demo-only credentials.

The hackathon requires judges to be able to run dependent authenticated flows.

---

# 68. README

Create a strong README containing:

* what Telapsy is
* why it exists
* architecture
* technologies
* setup
* environment variables
* MongoDB setup
* database seed command
* run command
* Kane installation
* Kane authentication prerequisites
* verification commands
* Codex ↔ Kane loop explanation
* bug ledger explanation
* screenshots if useful
* deployment/live URL placeholder
* demo credentials if needed
* hackathon explanation

The README should let judges run the app quickly.

---

# 69. ONE-COMMAND LOCAL START

Aim to make Telapsy runnable with minimal effort.

At minimum:

```bash
npm install
npm run seed
npm run dev
```

If feasible, create a simpler setup helper.

Do not sacrifice reliability for fancy bootstrap scripts.

---

# 70. GIT HYGIENE

Make meaningful commits.

Do not commit:

* `.env`
* access keys
* Kane credentials
* unnecessary generated files
* `node_modules`
* large disposable browser artifacts

Keep commit history understandable.

---

# 71. BUILD ORDER

Follow this implementation sequence unless a dependency requires slight adjustment.

## Phase 1 — Foundation

* initialize Next.js TypeScript project
* Tailwind
* environment validation
* Mongoose connection
* base layout
* navigation
* utility functions
* lint/typecheck/build scripts

Then run checks.

---

## Phase 2 — Product database

* Product model
* 4 categories
* 10 products each
* seed script
* 40 total products
* product listing
* product cards
* product details

Then use Kane to verify:

* homepage loads
* products appear
* a seeded product opens

Fix until passing.

---

## Phase 3 — Product discovery

Implement:

* search
* categories
* filters

Run targeted Kane verification.

Fix until passing.

---

## Phase 4 — Cart

Implement:

* add item
* update quantity
* remove item
* subtotal
* cart persistence
* cart indicator

Run multiple targeted Kane flows.

Fix until passing.

---

## Phase 5 — Promo

Implement:

```text
KANE
KANE2026
```

20% discount.

Verify:

* valid promo
* invalid promo
* duplicate attempt
* correct arithmetic
* persistence

Use Kane.

Fix until passing.

---

## Phase 6 — Authentication

Implement:

* signup
* login
* logout
* session
* protected account

Create:

```text
$1,000.00
```

signup balance.

Run Kane registration flow.

Fix until passing.

---

## Phase 7 — Checkout

Implement:

* customer form
* delivery form
* order summary
* registered/guest behavior

Then Kane.

---

## Phase 8 — Payment simulation

Implement:

* simulated card
* Telapsy Balance
* deterministic success
* correct balance deduction

Kane must validate exact values.

---

## Phase 9 — Orders

Implement:

* Order model
* order number
* confirmation
* order history
* order detail

Use Kane through entire user journey.

---

## Phase 10 — Closed-loop tooling

Implement:

* `tests/kane`
* verification wrapper
* NDJSON capture
* `run_end` parser
* bug ledger
* regression campaign support

---

## Phase 11 — Regression campaign

Execute controlled cases one at a time.

For each:

```text
PASS BASELINE
→ MUTATION
→ KANE FAIL
→ RECORD
→ DIAGNOSE
→ FIX
→ KANE PASS
→ RECORD
```

Do not fabricate results.

Do not leave mutated failures active.

---

## Phase 12 — Polish

Improve:

* loading states
* responsiveness
* visual consistency
* accessibility
* error messages
* empty states
* README

Run full Kane regression suite.

---

## Phase 13 — Production readiness

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

Seed clean DB.

Run primary Kane flows.

Confirm all critical flows pass.

---

# 72. FINAL REQUIRED END-TO-END KANE RUN

Before declaring Telapsy finished, Kane must prove the primary journey:

```text
Open Telapsy
→ create account
→ verify $1,000 balance
→ browse products
→ search for a product
→ open product
→ add quantity 2
→ open cart
→ verify subtotal
→ apply KANE2026
→ verify 20% discount
→ checkout
→ enter customer details
→ enter delivery details
→ select Telapsy Balance
→ place order
→ verify confirmation
→ verify correct total
→ verify balance deduction
→ open order history
→ verify new order appears
→ open order
→ verify product, quantity and amount
```

If this becomes too long for one Kane objective, split it into connected focused runs.

---

# 73. FINAL GUEST KANE RUN

Also prove:

```text
Open Telapsy
→ guest shopping
→ product
→ cart
→ checkout
→ simulated payment
→ order confirmation
```

---

# 74. HACKATHON DEMO PREPARATION

Prepare the project so a 3-minute demo can show:

1. Working Telapsy storefront.
2. Real product/cart/checkout flow.
3. A controlled regression.
4. Codex makes/has made a code change.
5. Kane automatically verifies.
6. Kane catches a meaningful failure.
7. Codex reads actual failure evidence.
8. Codex diagnoses the root cause.
9. Codex edits the application.
10. Kane reruns.
11. Kane passes.
12. Bug ledger displays the before/after verification record.

The audience should immediately understand the closed loop.

---

# 75. IDEAL DEMO REGRESSION

Use a visually understandable pricing regression.

Example:

Baseline:

```text
Product subtotal: $100
KANE2026 discount: $20
Checkout total: $80
```

Controlled regression causes checkout to display:

```text
$100
```

while cart correctly shows:

```text
$80
```

Kane should identify the mismatch.

Codex then discovers that checkout is consuming the raw subtotal instead of the discounted total.

Codex fixes the code.

Kane reruns.

Expected final output:

```text
Cart total: $80
Checkout total: $80
Confirmation total: $80
PASS
```

This demonstrates meaningful cross-page verification.

---

# 76. KANE CREDIT AWARENESS

The hackathon account provides a finite Kane credit allowance.

Do not waste credits.

During rapid low-level coding:

* use TypeScript
* lint
* unit/business-logic tests

Use Kane for meaningful browser behavior.

Once a stable Kane `_test.md` flow is available, prefer efficient repeatable regression execution where supported.

Do not execute the same expensive exploratory objective unnecessarily.

---

# 77. PARALLELISM

Independent Kane browser tasks may be run in parallel when this reduces time and does not create shared-state conflicts.

Do not parallelize:

* tests using the exact same user account when balances/orders mutate
* flows fighting over the same cart/session
* database-reset-dependent tests

Use isolated users or serial execution for stateful flows.

---

# 78. NEVER FAKE VERIFICATION

Never:

* mark Kane PASS without running Kane
* manually invent Kane output
* invent screenshots
* fabricate run IDs
* claim a bug was discovered when it was not
* write ledger evidence in advance
* alter application behavior merely to satisfy an incorrect test
* suppress legitimate failed runs from the ledger

The credibility of the project depends on real verification.

---

# 79. WHEN SOMETHING FAILS

Do not give up immediately.

Investigate in this order:

```text
1. Is Next.js running?
2. Is MongoDB connected?
3. Is seed data present?
4. Is the tested URL correct?
5. Is Kane authenticated?
6. Did Kane reach the application?
7. What does run_end report?
8. What do screenshots/logs show?
9. Is the application wrong?
10. Is the objective wrong?
11. Is state from an earlier test causing interference?
```

Fix the root cause.

---

# 80. NO UNNECESSARY FEATURES

Do not add features that jeopardize completion.

Do not add unless explicitly requested:

* marketplace
* sellers
* seller dashboard
* admin panel
* warehouse management
* advanced inventory workflows
* real payment gateway
* crypto wallet
* blockchain
* shipping-provider integration
* tax engine
* social login
* product reviews backend
* recommendations engine
* AI chatbot
* enterprise roles
* analytics platform
* mobile apps

Finish the core experience first.

---

# 81. DEFINITION OF DONE

Telapsy is complete only when:

* application starts successfully
* MongoDB connects
* 40 products seed correctly
* there are exactly 10 products in each of 4 categories
* search works
* category filtering works
* product details work
* cart works
* quantities work
* totals work
* KANE works
* KANE2026 works
* discount is exactly 20%
* signup works
* new user gets exactly $1,000
* login works
* guest checkout works
* registered checkout works
* simulated payment works
* Telapsy Balance works
* correct amount is deducted
* orders persist
* confirmation works
* order history works
* relevant Kane flows pass
* actual failures can flow back to Codex
* Codex can repair them
* Kane can re-verify the repair
* bug ledger contains genuine evidence
* no intentional regression remains active
* TypeScript passes
* lint passes
* production build passes
* README is complete
* repository contains no secrets
* final application is demo-ready

---

# 82. AUTONOMOUS EXECUTION BEHAVIOR

When instructed to build Telapsy:

Do not repeatedly stop to ask the human what to do next when requirements in this file already answer the question.

Make sensible implementation decisions.

Prefer:

```text
simple
reliable
maintainable
testable
demo-ready
```

over:

```text
complex
clever
experimental
unnecessary
```

When blocked by a genuinely external requirement such as:

* missing MongoDB URI
* missing Kane authentication
* deployment credentials

clearly state the exact requirement and continue completing all work that does not depend on it.

---

# 83. PROGRESS REPORTING

As development proceeds, maintain a concise project status file:

```text
verification/BUILD_STATUS.md
```

Track:

```text
Completed
In Progress
Blocked
Kane Verified
Needs Kane Verification
```

Do not substitute this file for real Kane evidence.

---

# 84. IMPORTANT TERMINOLOGY

The browser verification product used by this project is:

**Kane CLI**

The coding agent is:

**Codex**

Refer to the closed loop as:

**Codex ↔ Kane CLI**

Do not describe the browser-verification layer as ordinary Playwright testing.

---

# 85. FINAL BEHAVIORAL INSTRUCTION

You are not merely generating Telapsy.

You are responsible for **shipping and verifying Telapsy**.

Whenever you believe a major browser-facing feature is complete, ask yourself:

```text
Has Kane actually seen this work?
```

If the answer is no, verification is incomplete.

Whenever Kane reports a real product regression, ask:

```text
What exact evidence did Kane provide?
What requirement was violated?
What is the root cause?
What is the smallest correct repair?
Did Kane prove the repair afterward?
```

Do not stop at:

```text
code written
```

Stop at:

```text
code written
→ application running
→ Kane exercised it
→ result interpreted
→ regression repaired when necessary
→ Kane passed
→ evidence recorded
```

That closed loop is the defining engineering principle of Telapsy.
