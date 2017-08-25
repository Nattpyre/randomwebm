import React from 'react';
import Layout from '../../components/Layout';
import Webm from '../../components/Webm';

export default {

  path: ['/', '/random'],

  action() {
    return {
      component: <Layout><Webm isRandom /></Layout>,
    };
  },

};
