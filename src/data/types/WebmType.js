import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLInt as IntegerType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';
import TagType from './TagType';
import Webm from '../models/Webm';

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
    likes: { type: new NonNull(IntegerType) },
    dislikes: { type: new NonNull(IntegerType) },
    createdAt: {
      type: new NonNull(StringType),
      resolve(model) {
        return new Date(model.createdAt).toLocaleString('en-US', {
          day: 'numeric',
          year: 'numeric',
          month: 'long',
        });
      },
    },
    updatedAt: {
      type: new NonNull(StringType),
      resolve(model) {
        return new Date(model.updatedAt).toLocaleString('en-US', {
          day: 'numeric',
          year: 'numeric',
          month: 'long',
        });
      },
    },
    tags: {
      type: new List(TagType),
      resolve(model) {
        return Webm.findByPrimary(model.id).then(webm => webm.getTags());
      },
    },
  },
});

export default WebmType;
