/**
 * skill-section controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::skill-section.skill-section', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = { ...ctx.query, populate: '*' }
    const { data } = await super.find(ctx);
    return { data };
  }
})); 
