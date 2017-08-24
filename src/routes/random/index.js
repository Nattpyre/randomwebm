import React from 'react';
import Layout from '../../components/Layout';
import RandomWebm from './RandomWebm';

export default {

  path: ['/', '/random'],

  action() {
    return {
      component: <Layout><RandomWebm /></Layout>,
    };
  },

};
