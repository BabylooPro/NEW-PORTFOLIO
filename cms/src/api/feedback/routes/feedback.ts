/**
 * feedback router
 */

import { factories } from '@strapi/strapi';

const routes = {
    routes: [
        {
            method: 'GET',
            path: '/feedbacks',
            handler: 'feedback.find',
            config: {
                auth: false,
            },
        },
        {
            method: 'POST',
            path: '/feedbacks',
            handler: 'feedback.create',
            config: {
                auth: false,
            },
        },
        {
            method: 'GET',
            path: '/feedbacks/stats',
            handler: 'feedback.getFeedbackStats',
            config: {
                auth: false,
            },
        },
    ],
};

export default routes; 
