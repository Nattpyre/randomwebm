import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import randomWebm from './queries/randomWebm';
import webms from './queries/webms';
import uploadWebm from './mutations/uploadWebm';

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
    },
  }),
});

export default schema;
