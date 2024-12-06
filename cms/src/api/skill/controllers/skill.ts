/**
 * skill controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::skill.skill', ({ strapi }) => ({
  async find(ctx) {
    try {
      // USING FIND METHOD OF STRAPI BASE
      const entries = await strapi.db.query('api::skill.skill').findMany({
        populate: ['skillYear'],
      });

      // FORMAT RESPONSE
      return {
        data: entries.map(entry => ({
          id: entry.id,
          attributes: {
            ...entry,
            id: undefined
          }
        })),
        meta: {}
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  }
})); 
