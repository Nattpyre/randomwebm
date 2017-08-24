import React from 'react';
import Layout from '../../components/Layout';
import WebmList from '../../components/WebmList';

export default {
  path: '/',
  children: [

    {
      path: '/recent',
      action() {
        const title = 'Recent';

        return {
          title,
          component: <Layout><WebmList title={title} withoutTag /></Layout>,
        };
      },
    },

    {
      path: '/top',
      action() {
        const title = 'Top Rated';

        return {
          title,
          component: <Layout><WebmList title={title} order="likes" withoutTag /></Layout>,
        };
      },
    },

    {
      path: '/popular',
      action() {
        const title = 'Most Viewed';

        return {
          title,
          component: <Layout><WebmList title={title} order="views" withoutTag /></Layout>,
        };
      },
    },
  ],
};
