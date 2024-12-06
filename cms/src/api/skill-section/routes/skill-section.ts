/**
 * skill-section router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::skill-section.skill-section', {
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
