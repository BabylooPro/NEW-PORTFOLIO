/**
 * header-section controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::header-section.header-section', ({strapi}) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        profile: {
          populate: ['titles', 'avatar']
        },
        socialLinks: true
      }
    };
    
    return await super.find(ctx);
  }
})); 
