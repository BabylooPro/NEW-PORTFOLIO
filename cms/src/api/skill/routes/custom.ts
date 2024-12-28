export default {
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
