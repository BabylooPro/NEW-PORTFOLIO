export default {
  routes: [
    {
      method: 'GET',
      path: '/skill-years',
      handler: 'skill-year.find',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/skill-years/:id',
      handler: 'skill-year.findOne',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
}; 
