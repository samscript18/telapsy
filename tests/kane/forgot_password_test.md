---
mode: testing
max_steps: 60
timeout: 480
target: chrome
headless: true
---

# Session: forgot-password

## Step 1
Go to http://localhost:3000/signup and create a new Telapsy account using a unique email and compliant password. Sign out, open Sign in, choose Forgot password, submit the same email, verify the generic reset confirmation, open the local reset link, set a different compliant password, verify the password was updated, then sign in with the new password and verify the account page shows the user's ,000.00 Telapsy Balance.
