import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLInt as IntegerType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const WebmType = new ObjectType({
  name: 'Webm',
  fields: {
    id: { type: new NonNull(ID) },
    originalName: { type: new NonNull(StringType) },
    source: { type: StringType },
    hash: { type: new NonNull(StringType) },
    views: { type: new NonNull(IntegerType) },
    url: { type: new NonNull(StringType) },
    previewUrl: { type: new NonNull(StringType) },
    createdAt: { type: new NonNull(StringType) },
    updatedAt: { type: new NonNull(StringType) },
  },
});

export default WebmType;
