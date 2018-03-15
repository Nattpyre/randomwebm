import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';
import WebmType from '../types/WebmType';
import Webm from '../models/Webm';
import Tag from '../models/Tag';

const confirmWebm = {
  type: WebmType,
  args: {
    id: { type: new NonNull(StringType) },
    source: { type: StringType },
    tags: { type: new List(StringType) },
  },
  resolve(value, { id, source, tags }) {
    return Webm.update({ source, isChecked: true },
      { returning: true, where: { id } },
    ).then(([affectedRows, [webm]]) => {
      const promises = tags.map(tag => Tag.findOrCreate({ where: { name: tag.toLowerCase() } }));

      Promise.all(promises).then((results) => {
        const tagsArray = results.map(result => result[0]);

        webm.setTags(tagsArray);
      });

      return webm;
    });
  },
};

export default confirmWebm;
