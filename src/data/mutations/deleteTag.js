import {
  GraphQLID as ID,
  GraphQLInt as IntegerType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import TagType from '../types/TagType';
import Tag from '../models/Tag';
import Webm from '../models/Webm';

const deleteTag = {
  type: TagType,
  args: {
    id: { type: new NonNull(IntegerType) },
    webmId: { type: new NonNull(ID) },
  },
  resolve(value, { id, webmId }) {
    return Tag.findByPrimary(id).then((tag) => {
      Webm.findByPrimary(webmId).then((webm) => {
        webm.removeTag(tag);
      });

      return tag;
    });
  },
};

export default deleteTag;
