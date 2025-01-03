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
    data: {
        skill: number;
        date: string;
        seconds: number;
    }
}

interface SkillYear {
    id: number;
    year: string;
    publishedAt?: Date;
}

interface Skill {
    id: number;
    name: string;
    publishedAt?: Date;
    skillYear?: SkillYear;
    wakatimeStats?: WakatimeStat[];
}

// @ts-ignore - Strapi types are not perfect
const contentType = 'api::wakatime-stat.wakatime-stat';

export default {
    async upsertStats(ctx) {
        const { data } = ctx.request.body as UpsertStatsBody;
        const skillId = data.skill;
        const { date, seconds } = data;

        console.log("Received upsert request:", { skillId, date, seconds });

        try {
            // VERIFY SKILL EXISTS AND GET FULL SKILL DATA
            let skill = await strapi.entityService.findOne('api::skill.skill', skillId, {
                populate: ['skillYear', 'wakatimeStats']
            }) as unknown as Skill;

            // IF SKILL NOT FOUND, TRY TO GET IT BY ID FIRST
            if (!skill) {
                console.log(`Skill ${skillId} not found, trying to get it by ID...`);
                const skills = await strapi.entityService.findMany('api::skill.skill', {
                    filters: {
                        id: skillId
                    },
                    populate: ['skillYear', 'wakatimeStats']
                });

                if (skills && skills.length > 0) {
                    skill = skills[0] as unknown as Skill;
                } else {
                    console.log(`Skill ${skillId} not found in database, creating it...`);
                    // CREATE THE SKILL IF IT DOESN'T EXIST
                    skill = await strapi.entityService.create('api::skill.skill', {
                        data: {
                            documentId: Math.random().toString(36).substring(2) + Date.now().toString(36),
                            name: `Skill ${skillId}`,
                            publishedAt: new Date()
                        }
                    }) as unknown as Skill;
                }
            }

            // FORCE PUBLISH THE SKILL
            await strapi.db.query('api::skill.skill').update({
                where: { id: skillId },
                data: {
                    publishedAt: new Date()
                }
            });

            // PUBLISH SKILL YEAR IF EXISTS
            if (skill.skillYear?.id) {
                await strapi.db.query('api::skill-year.skill-year').update({
                    where: { id: skill.skillYear.id },
                    data: {
                        publishedAt: new Date()
                    }
                });
            }

            // PUBLISH ALL WAKATIME STATS FOR THIS SKILL
            if (skill.wakatimeStats?.length > 0) {
                await Promise.all(skill.wakatimeStats.map(stat =>
                    strapi.db.query('api::wakatime-stat.wakatime-stat').update({
                        where: { id: stat.id },
                        data: {
                            publishedAt: new Date()
                        }
                    })
                ));
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
                // UPDATE EXISTING STAT
                result = await strapi.db.query('api::wakatime-stat.wakatime-stat').update({
                    where: { id: existingStat.id },
                    data: {
                        seconds: seconds,
                        publishedAt: new Date(),
                        skill: skillId
                    }
                });
            } else {
                // CREATE NEW STAT
                result = await strapi.db.query('api::wakatime-stat.wakatime-stat').create({
                    data: {
                        skill: skillId,
                        date: date,
                        seconds: seconds,
                        publishedAt: new Date()
                    }
                });
            }

            // GET ALL STATS FOR THIS SKILL
            const allStats = await strapi.db.query('api::wakatime-stat.wakatime-stat').findMany({
                where: {
                    skill: skillId
                }
            });

            // CALCULATE TOTAL SECONDS FROM ALL STATS
            const totalSeconds = allStats.reduce((acc, curr) => acc + curr.seconds, 0);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);

            console.log("Updating skill hours:", { totalSeconds, hours, minutes });

            // UPDATE SKILL HOURS WITH TOTAL FROM ALL STATS AND FORCE PUBLISH
            await strapi.db.query('api::skill.skill').update({
                where: { id: skillId },
                data: {
                    hours,
                    minutes,
                    publishedAt: new Date()
                }
            });

            return { data: result };
        } catch (error) {
            console.log("Error in upsertStats:", error);
            ctx.throw(400, error);
        }
    }
}
