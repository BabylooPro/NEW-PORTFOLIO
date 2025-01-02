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
            const { hours: newHours = 0, minutes: newMinutes = 0 } = ctx.request.body;

            // GET CURRENT SKILL
            const skill = await strapi.entityService.findOne('api::skill.skill', id, {
                populate: '*'
            });

            if (!skill) {
                return ctx.notFound('Skill not found');
            }

            // CONVERT CURRENT AND NEW TIME TO MINUTES
            const currentTotalMinutes = (skill.hours || 0) * 60 + (skill.minutes || 0);
            const newTotalMinutes = newHours * 60 + newMinutes;

            // ADD THE NEW TIME TO THE CURRENT TOTAL
            const finalTotalMinutes = currentTotalMinutes + newTotalMinutes;

            // CONVERT BACK TO HOURS AND MINUTES
            const finalHours = Math.floor(finalTotalMinutes / 60);
            const finalMinutes = finalTotalMinutes % 60;

            console.log("[SKILL] Hours calculation:", {
                current: { hours: skill.hours || 0, minutes: skill.minutes || 0, totalMinutes: currentTotalMinutes },
                new: { hours: newHours, minutes: newMinutes, totalMinutes: newTotalMinutes },
                final: { hours: finalHours, minutes: finalMinutes, totalMinutes: finalTotalMinutes }
            });

            // UPDATE SKILL WITH NEW TOTAL
            const updatedSkill = await strapi.entityService.update('api::skill.skill', id, {
                data: {
                    hours: finalHours,
                    minutes: finalMinutes,
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
