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
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: ['http://localhost:1337', 'http://localhost:3000', '*'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
]; 
