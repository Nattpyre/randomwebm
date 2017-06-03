import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import sequelize from '../sequelize';
import WebmType from '../types/WebmType';
import Webm from '../models/Webm';

const uploadWebm = {
  type: WebmType,
  args: {
    originalName: { type: new NonNull(StringType) },
    source: { type: StringType },
    hash: { type: new NonNull(StringType) },
    url: { type: new NonNull(StringType) },
    previewUrl: { type: new NonNull(StringType) },
  },
  resolve(value, { originalName, source, hash, url, previewUrl }) {
    return Webm.create({ originalName, source, hash, url, previewUrl }).then(response => response);
  },
};

export default uploadWebm;
