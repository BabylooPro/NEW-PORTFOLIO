/**
 * showcase-video router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::showcase-video.showcase-video', {
    config: {
        find: {
            auth: false,
            policies: [],
            middlewares: [],
        },
        findOne: {
            auth: false,
            policies: [],
            middlewares: [],
        },
    },
});
