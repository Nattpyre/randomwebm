/* eslint-disable global-require */

export default {

  path: '/',

  children: [
    require('./random').default,
    require('./about').default,
    require('./list').default,
    require('./login').default,
    require('./admin').default,
    require('./tag').default,
    require('./webm').default,

    require('./notFound').default,
  ],

  async action({ next }) {
    const route = await next();

    route.title = route.title ? `${route.title} - Random Webm` : 'Random Webm';
    route.description = route.description || '';

    return route;
  },

};
