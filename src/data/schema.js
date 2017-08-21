import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import randomWebm from './queries/randomWebm';
import getWebms from './queries/getWebms';
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
      randomWebm,
      getWebms,
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
