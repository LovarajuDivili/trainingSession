# To setup new email addres:

1.Open Google Account: https://myaccount.google.com/
2.Go to Security
3.Turn on 2-Step Verification (if not already).
4.After enabling 2FA, go to:
https://myaccount.google.com/apppasswords
5.Choose:
App: Mail
Device: Other (Custom) → Type: FastAPI
6.Google gives you a 16-character password.

## Creating a GROQ API Secret Key

This backend uses the **GROQ API** for AI-powered responses. Follow the steps below to generate and configure your GROQ secret key.

### Step 1: Sign in to GROQ

1. Open your browser and go to **https://console.groq.com**
2. Sign in using your GitHub or Google account.

### Step 2: Create an API Key

1. After logging in, navigate to the **API Keys** section.
2. Click on **Create API Key**.
3. Give the key a meaningful name (e.g., `backend-chatbot`).
4. Copy the generated **secret key** immediately.

> ⚠️ Important: The secret key will be shown only once. Store it securely.

### Step 3: Add the Key to Environment Variables

Create a `.env` file inside the `backend/` folder:

```bash
backend/.env
```
