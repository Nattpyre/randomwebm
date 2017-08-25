import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntegerType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const TagType = new ObjectType({
  name: 'Tag',
  fields: {
    id: { type: new NonNull(IntegerType) },
    name: {
      type: new NonNull(StringType),
      resolve(model) {
        return model.name.charAt(0).toUpperCase() + model.name.slice(1);
      },
    },
    createdAt: { type: new NonNull(StringType) },
    updatedAt: { type: new NonNull(StringType) },
  },
});

export default TagType;
