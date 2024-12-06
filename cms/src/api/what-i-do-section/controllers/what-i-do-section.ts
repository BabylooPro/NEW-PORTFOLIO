/**
 * what-i-do-section controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::what-i-do-section.what-i-do-section', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = { ...ctx.query, populate: '*' }
    const { data } = await super.find(ctx);
    return { data };
  }
})); 
