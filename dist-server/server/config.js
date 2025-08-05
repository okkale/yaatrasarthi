export const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-dev-only',
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigins: process.env.NODE_ENV === 'production'
        ? ['https://yaatrasarthi.netlify.app']
        : ['http://localhost:3000']
};
//# sourceMappingURL=config.js.map