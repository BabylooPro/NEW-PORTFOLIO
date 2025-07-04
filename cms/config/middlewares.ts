module.exports = [
    'strapi::errors',
    {
        name: 'strapi::security',
        config: {
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'connect-src': ["'self'", 'http:', 'https:', 'ws:', 'wss:'],
                    'img-src': [
                        "'self'",
                        'data:',
                        'blob:',
                        'dl.airtable.com',
                        `${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`,
                        process.env.CLOUDFRONT_URL,
                    ],
                    'media-src': [
                        "'self'",
                        'data:',
                        'blob:',
                        'dl.airtable.com',
                        `${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`,
                        process.env.CLOUDFRONT_URL,
                    ],
                    upgradeInsecureRequests: null,
                },
            },
        },
    },
    './src/middlewares/rate-limit.ts', // Add rate limiting middleware
    {
        name: 'strapi::cors',
        config: {
            enabled: true,
            headers: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
            origin: process.env.NODE_ENV === 'production' 
                ? ['https://maxremy.dev', 'https://www.maxremy.dev', 'https://cms.maxremy.dev']
                : ['http://localhost:3000', 'http://localhost:1337', 'http://127.0.0.1:3000', 'http://127.0.0.1:1337'],
            maxAge: 31536000,
            credentials: true,
        },
    },
    'strapi::poweredBy',
    'strapi::logger',
    'strapi::query',
    {
        name: 'strapi::body',
        config: {
            formLimit: "100mb", // Reduced from 10GB to 100MB for security
            jsonLimit: "10mb", // Reduced from 10GB to 10MB for security
            textLimit: "10mb", // Reduced from 10GB to 10MB for security
            formidable: {
                maxFileSize: 100 * 1024 * 1024, // 100MB maximum file size
                maxFieldsSize: 2 * 1024 * 1024, // 2MB for form metadata
                keepExtensions: true,
                multiples: true,
                maxFields: 50, // Reduced from 100 to 50 fields maximum
            },
        },
    },
    {
        name: 'strapi::session',
        config: {
            cookieSecure: process.env.NODE_ENV === 'production',
            maxAge: 86400000, // 24 hours in milliseconds
        },
    },
    'strapi::favicon',
    'strapi::public',
];

