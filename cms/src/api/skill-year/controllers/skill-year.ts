/**
 * skill-year controller
 */

export default {
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        skills: {
          sort: ['name:asc'],
        },
      },
    };
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.db.query('api::skill-year.skill-year').findOne({
      where: { id },
      populate: {
        skills: {
          sort: ['name:asc'],
        },
      },
    });
    return { data: entity };
  },
}; 
