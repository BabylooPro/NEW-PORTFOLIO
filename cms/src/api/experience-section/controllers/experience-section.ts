/**
 * experience-section controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::experience-section.experience-section', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = { ...ctx.query, populate: '*' }
    const { data } = await super.find(ctx);
    return { data };
  }
}));
