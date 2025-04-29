# AlmondSpark

A Next.js application that uses Google's Gemini API to generate comic strips.

## Understanding Environment Variables

### For Developers
When developing this application, you'll need to create a local `.env` file with your Gemini API key. This file stays on your development machine and isn't committed to the repository.

### For Production Deployment
When deploying this application to a production server:
- The server administrator needs to set up the environment variables on the server
- End users who visit the website don't need to provide any API keys - they're using the key configured on the server
- The web server handles all requests using its configured API key

## Setup Instructions

### Local Development Environment

This application requires a Gemini API key to function. For local development:

1. Create a copy of the `.env.example` file and name it `.env`:
   ```
   cp .env.example .env
   ```

2. Get your Gemini API key from [Google AI Studio](https://ai.google.dev/)

3. Edit your `.env` file and replace `your_api_key_here` with your actual Gemini API key

### Production Deployment

For production deployment, set the environment variables according to your hosting platform:

- **Vercel**: Configure environment variables in the Vercel dashboard
- **Netlify**: Add environment variables in site settings
- **Traditional hosting**: Set environment variables according to your web server configuration

### Important

- The `.env` file is listed in `.gitignore` to ensure API keys are not committed to the repository
- In production, the server uses a single API key for all website visitors
- The application will only look for the API key in the environment variables, not expecting users of the website to provide their own keys

## Running the Application

```
npm install
npm run dev
```

Visit `http://localhost:3000` to use the application.