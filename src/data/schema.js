import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import randomWebm from './queries/randomWebm';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      randomWebm,
    },
  }),
});

export default schema;
