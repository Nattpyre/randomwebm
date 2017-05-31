import React from 'react';
import Layout from '../../components/Layout';
import RandomWebm from './RandomWebm';

const title = 'Random Webm';

export default {

  path: '/random',

  action() {
    return {
      title,
      component: <Layout><RandomWebm title={title} /></Layout>,
    };
  },

};
