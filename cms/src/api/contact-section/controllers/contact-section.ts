/**
 * contact-section controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::contact-section.contact-section', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = { ...ctx.query, populate: '*' }
    const { data } = await super.find(ctx);
    return { data };
  }
})); 
