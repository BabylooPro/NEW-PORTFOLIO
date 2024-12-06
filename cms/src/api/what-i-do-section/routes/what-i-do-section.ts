/**
 * what-i-do-section router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::what-i-do-section.what-i-do-section', {
  config: {
    find: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    findOne: {
      auth: false,
      policies: [],
      middlewares: [],
    },
  },
}); 
