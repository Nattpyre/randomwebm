import models from '../src/data/models';
import Webm from '../src/data/models/Webm';

/**
 * Add fake data to the database.
 */
models.sync({ force: true }).catch(err => console.error(err.stack)).then(() => {
  Webm.create({
    originalName: 'Грач, грачик, грачонок',
    source: 'https://vk.com/atypicalmakhachkala',
    hash: 'DDA9BEBE0E305C1090B0271FDEB7C5D1',
    url: 'http://webm.armarium.org/i/FtUx11.webm',
    previewUrl: 'https://i.ytimg.com/vi/NZtrSRvB7-w/maxresdefault.jpg',
  }).then(() => {
    Webm.create({
      originalName: 'Профура',
      hash: '0CBD87E046E8380DF49F4AD66EEF3AE5',
      url: 'http://webm.armarium.org/i/E1MfQJ.webm',
      previewUrl: 'https://i.ytimg.com/vi/m4cF3WjI8sA/maxresdefault.jpg',
    }).then(() => {
      Webm.create({
        originalName: 'А гу ША',
        source: 'https://vk.com/atypicalmakhachkala',
        hash: '415A9E2C92FA38DF6A00B80209954534',
        url: 'http://webm.armarium.org/i/GD7h8g.webm',
        previewUrl: 'https://i.ytimg.com/vi/qFNYRjAWeUg/hqdefault.jpg',
      });
    });
  });
});