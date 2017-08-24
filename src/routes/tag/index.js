import React from 'react';
import Layout from '../../components/Layout';
import WebmList from '../../components/WebmList';

export default {

  path: '/tag/:name',

  action(context) {
    const title = context.params.name.charAt(0).toUpperCase() + context.params.name.slice(1);

    return {
      title,
      component: <Layout><WebmList title={title} /></Layout>,
    };
  },

};
