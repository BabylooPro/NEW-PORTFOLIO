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
    {
        name: 'strapi::cors',
        config: {
            enabled: true,
            headers: ['*'],
            origin: ['*'],
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
            formLimit: "10240mb", // 10GB in MB
            jsonLimit: "10240mb", // 10GB in MB
            textLimit: "10240mb", // 10GB in MB
            formidable: {
                maxFileSize: 10 * 1024 * 1024 * 1024, // 10GB IN BYTES
                maxFieldsSize: 10 * 1024 * 1024, // 10MB (Increased for form metadata)
                keepExtensions: true,
                multiples: true,
                maxFields: 100, // Maximum number of fields
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

