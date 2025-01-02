/**
 * wakatime-stat controller
 */

import { factories } from '@strapi/strapi';
import { Context } from 'koa';

interface WakatimeStat {
    id: number;
    date: string;
    seconds: number;
    skill: number;
}

interface UpsertStatsBody {
    skillId: number;
    date: string;
    seconds: number;
}

// @ts-ignore - Strapi types are not perfect
const contentType = 'api::wakatime-stat.wakatime-stat';

export default {
    async upsertStats(ctx) {
        const { skillId, date, seconds } = ctx.request.body;
        console.log("Received upsert request:", { skillId, date, seconds });

        try {
            // VERIFY SKILL EXISTS
            const skill = await strapi.entityService.findOne('api::skill.skill', skillId);
            if (!skill) {
                throw new Error(`Skill with ID ${skillId} not found`);
            }

            // FIND EXISTING STAT FOR THIS SKILL AND DATE
            const existingStat = await strapi.db.query('api::wakatime-stat.wakatime-stat').findOne({
                where: {
                    skill: skillId,
                    date: date
                }
            });

            console.log("Existing stat:", existingStat);

            let result;
            if (existingStat) {
                // UPDATE EXISTING STAT BY ADDING NEW SECONDS
                result = await strapi.entityService.update('api::wakatime-stat.wakatime-stat', existingStat.id, {
                    data: {
                        seconds: existingStat.seconds + seconds,
                        skill: skillId // ENSURE SKILL RELATION IS MAINTAINED
                    }
                });
            } else {
                // CREATE NEW STAT
                result = await strapi.entityService.create('api::wakatime-stat.wakatime-stat', {
                    data: {
                        skill: skillId, // SET SKILL RELATION
                        date: date,
                        seconds: seconds
                    }
                });
            }

            // GET ALL STATS FOR THIS SKILL
            const allStats = await strapi.db.query('api::wakatime-stat.wakatime-stat').findMany({
                where: {
                    skill: skillId
                }
            });

            const totalSeconds = allStats.reduce((acc, curr) => acc + curr.seconds, 0);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);

            console.log("Updating skill hours:", { totalSeconds, hours, minutes });

            // UPDATE SKILL HOURS
            await strapi.entityService.update('api::skill.skill', skillId, {
                data: {
                    hours,
                    minutes
                }
            });

            return { data: result };
        } catch (error) {
            console.log("Error in upsertStats:", error);
            ctx.throw(400, error);
        }
    }
}
