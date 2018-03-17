import React from 'react';
import Layout from '../../components/Layout';
import Login from './Login';

const title = 'Log In';

export default {

  path: '/login',

  async action(context) {
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

    if (isVerified) {
      return { redirect: '/admin' };
    }

    return {
      title,
      component: <Layout><Login title={title} /></Layout>,
    };
  },

};
