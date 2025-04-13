module.exports = [
    'strapi::errors',
    {
        name: 'strapi::security',
        config: {
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'connect-src': ["'self'", 'http:', 'https:', 'ws:', 'wss:'],
                    'img-src': ["'self'", 'data:', 'blob:', 'http:', 'https:', 'localhost:*'],
                    'media-src': ["'self'", 'data:', 'blob:', 'http:', 'https:', 'localhost:*'],
                    'default-src': ["'self'", 'http:', 'https:', 'localhost:*'],
                    upgradeInsecureRequests: null,
                },
            },
            frameguard: false,
        },
    },
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::logger',
    'strapi::query',
    {
        name: 'strapi::body',
        config: {
            formLimit: "2048mb",
            jsonLimit: "2048mb",
            textLimit: "2048mb",
            formidable: {
                maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB IN BYTES
            },
        },
    },
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
]; 
