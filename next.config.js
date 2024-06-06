/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    env: {
        NEXT_FIREBASE_API_KEY: process.env.NEXT_FIREBASE_API_KEY,
        NEXT_FIREBASE_AUTH_DOMAIN: process.env.NEXT_FIREBASE_AUTH_DOMAIN,
        NEXT_FIREBASE_PROJECT_ID: process.env.NEXT_FIREBASE_PROJECT_ID,
        NEXT_FIREBASE_STORAGE_BUCKET: process.env.NEXT_FIREBASE_STORAGE_BUCKET,
        NEXT_FIREBASE_SENDER_ID: process.env.NEXT_FIREBASE_SENDER_ID,
        NEXT_FIREBASE_APP_ID: process.env.NEXT_FIREBASE_APP_ID,
        NEXT_FIREBASE_MEASUREMENT_ID: process.env.NEXT_FIREBASE_MEASUREMENT_ID
    }
};

module.exports = nextConfig;
