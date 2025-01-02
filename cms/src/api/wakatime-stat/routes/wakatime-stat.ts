export default {
    routes: [
        {
            method: 'POST',
            path: '/wakatime-stats/upsert',
            handler: 'wakatime-stat.upsertStats',
            config: {
                auth: false,
                policies: [],
            },
        }
    ]
};
