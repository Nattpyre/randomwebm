import {
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
  GraphQLID as ID,
} from 'graphql';
import WebmType from '../types/WebmType';
import Webm from '../models/Webm';

const toggleLike = {
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
        likes: hasLike ? webm.likes - 1 : webm.likes + 1,
        dislikes: hasDislike ? webm.dislikes - 1 : webm.dislikes,
      });

      return webm;
    });
  },
};

export default toggleLike;
