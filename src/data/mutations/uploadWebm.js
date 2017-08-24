import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';
import WebmType from '../types/WebmType';
import Webm from '../models/Webm';
import Tag from '../models/Tag';

const uploadWebm = {
  type: WebmType,
  args: {
    originalName: { type: new NonNull(StringType) },
    source: { type: StringType },
    hash: { type: new NonNull(StringType) },
    url: { type: new NonNull(StringType) },
    previewUrl: { type: new NonNull(StringType) },
    tags: { type: new List(StringType) },
  },
  resolve(value, { originalName, source, hash, url, previewUrl, tags }) {
    return Webm.create({ originalName, source, hash, url, previewUrl }).then((webm) => {
      const promises = tags.map(tag => Tag.findOrCreate({ where: { name: tag.toLowerCase() } }));

      Promise.all(promises).then((results) => {
        const tagsArray = results.map(result => result[0]);

        webm.setTags(tagsArray);
      });

      return webm;
    });
  },
};

export default uploadWebm;
