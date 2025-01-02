export default {
    async find(ctx) {
        try {
            let entity = await strapi.db.query("api::visitor-count.visitor-count").findOne({
                where: {},
                orderBy: { id: 'asc' }
            });

            if (!entity) {
                entity = await strapi.db.query("api::visitor-count.visitor-count").create({
                    data: {
                        count: 0,
                        history: [{
                            count: 0,
                            timestamp: new Date().toISOString()
                        }]
                    }
                });
            }

            return { data: { attributes: { count: entity.count, history: entity.history } } };
        } catch (error) {
            console.error("Find error:", error);
            ctx.throw(500, "Failed to fetch visitor count");
        }
    },

    async increment(ctx) {
        try {
            let entity = await strapi.db.query("api::visitor-count.visitor-count").findOne({
                where: {},
                orderBy: { id: 'asc' }
            });

            const newCount = entity ? entity.count + 1 : 1;
            const newEntry = {
                count: newCount,
                timestamp: new Date().toISOString()
            };

            if (!entity) {
                entity = await strapi.db.query("api::visitor-count.visitor-count").create({
                    data: {
                        count: newCount,
                        history: [newEntry]
                    }
                });
            } else {
                // KEEP ALL ENTRIES
                const history = [...(entity.history || []), newEntry];

                entity = await strapi.db.query("api::visitor-count.visitor-count").update({
                    where: { id: entity.id },
                    data: {
                        count: newCount,
                        history
                    }
                });
            }

            return { data: { attributes: { count: entity.count, history: entity.history } } };
        } catch (error) {
            console.error("Increment error:", error);
            ctx.throw(500, "Failed to increment visitor count");
        }
    }
};

