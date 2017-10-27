import React from 'react';
import Layout from '../../components/Layout';
import WebmPage from '../../components/WebmPage';

export default {

  path: ['/', '/random'],

  action() {
    return {
      component: <Layout><WebmPage isRandom /></Layout>,
    };
  },

};
