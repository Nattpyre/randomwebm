import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import randomWebm from './queries/randomWebm';
import webms from './queries/webms';
import uploadWebm from './mutations/uploadWebm';
import toggleLike from './mutations/toggleLike';
import toggleDislike from './mutations/toggleDislike';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      randomWebm,
      webms,
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      uploadWebm,
      toggleLike,
      toggleDislike,
    },
  }),
});

export default schema;
