import {
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
  GraphQLID as ID,
} from 'graphql';
import WebmType from '../types/WebmType';
import Webm from '../models/Webm';

const toggleDislike = {
  type: WebmType,
  args: {
    id: { type: new NonNull(ID) },
    hasLike: { type: BooleanType },
    hasDislike: { type: BooleanType },
  },
  resolve(value, { id, hasLike, hasDislike }) {
    return Webm.findByPrimary(id).then((webm) => {
      if (!webm) {
        return null;
      }

      webm.update({
        dislikes: hasDislike ? webm.dislikes - 1 : webm.dislikes + 1,
        likes: hasLike ? webm.likes - 1 : webm.likes,
      });

      return webm;
    });
  },
};

export default toggleDislike;
