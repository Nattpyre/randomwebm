import React from 'react';
import Layout from '../../components/Layout';

export default {

  path: '/admin',

  children: [
    {
      path: '/',
      async action(context) {
        const title = 'Pending Webms';
        const token = process.env.BROWSER ? localStorage.getItem('token') : null;
        let isVerified = false;

        if (!process.env.BROWSER) {
          return {
            title,
            component: <Layout>
              <div />
            </Layout>,
          };
        }

        if (token) {
          isVerified = await context.fetch(`/graphql?query={verifyToken(token: "${token}")}`).then(response => response.json()).then(result => result.data.verifyToken);
        }

        if (!isVerified) {
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
        const token = process.env.BROWSER ? localStorage.getItem('token') : null;
        let isVerified = false;

        if (!process.env.BROWSER) {
          return {
            title,
            component: <Layout>
              <div />
            </Layout>,
          };
        }

        if (token) {
          isVerified = await context.fetch(`/graphql?query={verifyToken(token: "${token}")}`).then(response => response.json()).then(result => result.data.verifyToken);
        }

        if (!isVerified) {
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
