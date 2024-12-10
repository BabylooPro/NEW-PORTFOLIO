/**
 * hero-section controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::hero-section.hero-section', ({strapi}) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        audioFile: true
      }
    };
    
    const { data, meta } = await super.find(ctx);
    
    // DEBUG
    console.log('Hero Section Data:', data);
    
    return { data, meta };
  }
})); 
