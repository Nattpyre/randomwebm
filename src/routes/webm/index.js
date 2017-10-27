import React from 'react';
import Layout from '../../components/Layout';
import WebmPage from '../../components/WebmPage';

export default {

  path: '/webm/:id',

  action(context) {
    return {
      component: <Layout><WebmPage id={context.params.id} /></Layout>,
    };
  },

};
