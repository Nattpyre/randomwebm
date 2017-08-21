import {
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import TagType from '../types/TagType';
import Tag from '../models/Tag';
import Webm from '../models/Webm';

const addTag = {
  type: TagType,
  args: {
    name: { type: new NonNull(StringType) },
    webmId: { type: ID },
  },
  resolve(value, { name, webmId }) {
    return Tag.findOrCreate({ where: { name } }).then((data) => {
      const tag = data[0];

      if (webmId) {
        Webm.findByPrimary(webmId).then((webm) => {
          webm.addTag(tag);
        });
      }

      return tag;
    });
  },
};

export default addTag;
