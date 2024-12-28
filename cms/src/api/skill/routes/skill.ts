/**
 * skill router
 */

import { factories } from '@strapi/strapi';

const routes = {
    routes: [
        {
            method: 'PUT',
            path: '/skills/:id/update-hours',
            handler: 'skill.updateHours',
            config: {
                auth: false,
                policies: [],
            },
        },
    ],
};

export default factories.createCoreRouter('api::skill.skill', {
    prefix: '',
    only: ['find', 'findOne', 'create', 'update', 'delete'],
    except: [],
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
        create: {
            auth: false,
            policies: [],
            middlewares: [],
        },
        update: {
            auth: false,
            policies: [],
            middlewares: [],
        },
        delete: {
            auth: false,
            policies: [],
            middlewares: [],
        },
    },
});

export { routes }; 
