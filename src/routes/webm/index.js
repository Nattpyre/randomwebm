import React from 'react';
import Layout from '../../components/Layout';
import Webm from '../../components/Webm';

export default {

  path: '/webm/:id',

  action(context) {
    return {
      component: <Layout><Webm id={context.params.id} /></Layout>,
    };
  },

};
