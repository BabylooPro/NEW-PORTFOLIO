/**
 * contact-section router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::contact-section.contact-section', {
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
