import React from 'react';
import Layout from '../../components/Layout';
import About from './About';

const title = 'About Us';

export default {

  path: '/about',

  action() {
    return {
      title,
      component: <Layout><About title={title} /></Layout>,
    };
  },

};
