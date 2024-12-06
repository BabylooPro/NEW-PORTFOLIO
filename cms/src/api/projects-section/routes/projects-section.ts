/**
 * projects-section router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::projects-section.projects-section', {
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
