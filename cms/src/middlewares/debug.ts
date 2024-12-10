export default () => {
  return async (ctx, next) => {
    console.log('Request:', {
      method: ctx.method,
      url: ctx.url,
      query: ctx.query,
      headers: ctx.headers,
    });

    try {
      await next();
    } catch (err) {
      console.error('Error in request:', err);
      throw err;
    }

    console.log('Response:', {
      status: ctx.status,
      body: ctx.body,
    });
  };
}; 
