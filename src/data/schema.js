import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import getWebm from './queries/getWebm';
import getWebmList from './queries/getWebmList';
import getTags from './queries/getTags';
import uploadWebm from './mutations/uploadWebm';
import toggleLike from './mutations/toggleLike';
import toggleDislike from './mutations/toggleDislike';
import addTag from './mutations/addTag';
import deleteTag from './mutations/deleteTag';
import userLogin from './mutations/userLogin';
import confirmWebm from './mutations/confirmWebm';
import removeWebm from './mutations/removeWebm';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      getWebm,
      getWebmList,
      getTags,
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      uploadWebm,
      toggleLike,
      toggleDislike,
      addTag,
      deleteTag,
      userLogin,
      confirmWebm,
      removeWebm,
    },
  }),
});

export default schema;
