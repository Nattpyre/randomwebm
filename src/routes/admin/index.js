import React from 'react';
import Layout from '../../components/Layout';

export default {

  path: '/admin',

  children: [
    {
      path: '/',
      async action(context) {
        const title = 'Pending Webms';

        if (!context.user || context.user.roles.indexOf('administrator') === -1) {
          return { redirect: '/login' };
        }

        const Admin = await require.ensure([], require => require('./Admin').default, 'admin');

        return {
          title,
          chunk: 'admin',
          component: <Layout><Admin title={title} /></Layout>,
        };
      },
    },
    {
      path: '/webm/:id',
      async action(context) {
        const title = 'Edit Webm';

        if (!context.user || context.user.roles.indexOf('administrator') === -1) {
          return { redirect: '/login' };
        }

        const Admin = await require.ensure([], require => require('./Admin').default, 'admin');

        return {
          title,
          chunk: 'admin',
          component: <Layout><Admin id={context.params.id} title={title} /></Layout>,
        };
      },
    },
  ],

};
