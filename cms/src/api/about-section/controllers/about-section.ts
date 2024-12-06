/**
 * about-section controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController<any, any>('api::about-section.about-section', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        audioFile: true,
        personalInfo: true,
        languages: {
          populate: {
            languages: true
          }
        },
        education: {
          populate: {
            platforms: true
          }
        }
      }
    };
    
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  }
})); 
