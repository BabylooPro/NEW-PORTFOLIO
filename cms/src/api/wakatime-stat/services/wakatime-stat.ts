/**
 * wakatime-stat service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::wakatime-stat.wakatime-stat', ({ strapi }) => ({
    async publish(id: number) {
        // USE DIRECT DB QUERY TO FORCE PUBLISH
        await strapi.db.query('api::wakatime-stat.wakatime-stat').update({
            where: { id },
            data: {
                publishedAt: new Date()
            }
        });

        // ALSO UPDATE USING ENTITY SERVICE FOR GOOD MEASURE
        return await strapi.entityService.update('api::wakatime-stat.wakatime-stat', id, {
            data: {
                publishedAt: new Date()
            }
        });
    }
})); 
