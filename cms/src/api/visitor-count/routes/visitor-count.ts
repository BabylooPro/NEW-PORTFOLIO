export default {
    routes: [
        {
            method: "GET",
            path: "/visitor-count",
            handler: "visitor-count.find",
            config: {
                auth: false
            }
        },
        {
            method: "POST",
            path: "/visitor-count/increment",
            handler: "visitor-count.increment",
            config: {
                auth: false
            }
        },
    ],
};

