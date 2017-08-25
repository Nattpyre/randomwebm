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
    },
  }),
});

export default schema;
