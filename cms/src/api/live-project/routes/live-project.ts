export default {
    routes: [
        {
            method: 'GET',
            path: '/live-projects',
            handler: 'live-project.find',
            config: {
                auth: false,
            }
        },
        {
            method: 'GET',
            path: '/live-projects/:id',
            handler: 'live-project.findOne',
            config: {
                auth: false,
            }
        },
        {
            method: 'POST',
            path: '/live-projects',
            handler: 'live-project.create',
        },
        {
            method: 'PUT',
            path: '/live-projects/:id',
            handler: 'live-project.update',
        },
        {
            method: 'DELETE',
            path: '/live-projects/:id',
            handler: 'live-project.delete',
        }
    ]
} 
