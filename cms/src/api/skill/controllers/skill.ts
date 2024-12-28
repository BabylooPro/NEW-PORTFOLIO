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
    },

    async updateHours(ctx) {
        try {
            const { id } = ctx.params;
            const { hours = 0, minutes = 0 } = ctx.request.body;

            // GET CURRENT SKILL
            const skill = await strapi.entityService.findOne('api::skill.skill', id, {
                populate: '*'
            });

            if (!skill) {
                return ctx.notFound('Skill not found');
            }

            // UPDATE SKILL WITH NEW HOURS AND MINUTES
            const updatedSkill = await strapi.entityService.update('api::skill.skill', id, {
                data: {
                    hours,
                    minutes,
                }
            });

            return {
                data: {
                    id: updatedSkill.id,
                    attributes: {
                        ...updatedSkill,
                        id: undefined
                    }
                }
            };
        } catch (error) {
            ctx.throw(500, error);
        }
    }
})); 
