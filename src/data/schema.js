import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import getWebm from './queries/getWebm';
import getWebmList from './queries/getWebmList';
import getTags from './queries/getTags';
import verifyToken from './queries/verifyToken';
import uploadWebm from './mutations/uploadWebm';
import toggleLike from './mutations/toggleLike';
import toggleDislike from './mutations/toggleDislike';
import adminLogin from './mutations/adminLogin';
import confirmWebm from './mutations/confirmWebm';
import removeWebm from './mutations/removeWebm';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      getWebm,
      getWebmList,
      getTags,
      verifyToken,
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      uploadWebm,
      toggleLike,
      toggleDislike,
      adminLogin,
      confirmWebm,
      removeWebm,
    },
  }),
});

export default schema;
