/* eslint-disable global-require */

// The top-level (parent) route
export default {

  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [
    require('./random').default,
    require('./contact').default,
    require('./login').default,
    require('./register').default,
    require('./admin').default,

    require('./notFound').default,
  ],

  async action({ next }) {
    const route = await next();

    route.title = route.title || '';
    route.description = route.description || '';

    return route;
  },

};
