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
  resolve(root, { id, hasLike, hasDislike }) {
    return Webm.findByPrimary(id).then((webm) => {
      if (!webm) {
        return null;
      }

      const likes = hasLike ? webm.likes - 1 : webm.likes;
      const dislikes = hasDislike ? webm.dislikes - 1 : webm.dislikes + 1;

      webm.update({
        dislikes: dislikes >= 0 ? dislikes : 0,
        likes: likes >= 0 ? likes : 0,
      });

      return webm;
    });
  },
};

export default toggleDislike;
