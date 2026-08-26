---
mode: testing
max_steps: 50
timeout: 180
target: chrome
headless: true
---

# Session: protected-routes

## Step 1
Go to http://localhost:3000/orders and verify an unauthenticated visitor is redirected to the Telapsy sign-in page. Then go to http://localhost:3000/account and verify the visitor is again redirected to sign in.
