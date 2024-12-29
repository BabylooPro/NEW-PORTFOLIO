/**
 * feedback controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::feedback.feedback', ({ strapi }) => ({
    async getFeedbackStats(ctx) {
        try {
            const feedbacks = await strapi.db.query('api::feedback.feedback').findMany();

            const totalFeedbacks = feedbacks.length;
            const averageRating = totalFeedbacks > 0
                ? feedbacks.reduce((acc: number, curr: any) => acc + (curr.rating || 0), 0) / totalFeedbacks
                : 0;

            const ratingDistribution = {
                '0-1': 0,
                '1-2': 0,
                '2-3': 0,
                '3-4': 0,
                '4-5': 0,
            };

            feedbacks.forEach((feedback: any) => {
                const rating = feedback.rating || 0;
                if (rating <= 1) ratingDistribution['0-1']++;
                else if (rating <= 2) ratingDistribution['1-2']++;
                else if (rating <= 3) ratingDistribution['2-3']++;
                else if (rating <= 4) ratingDistribution['3-4']++;
                else ratingDistribution['4-5']++;
            });

            return {
                data: {
                    totalFeedbacks,
                    averageRating,
                    ratingDistribution,
                }
            };
        } catch (error) {
            ctx.throw(500, error);
        }
    },
})); 
