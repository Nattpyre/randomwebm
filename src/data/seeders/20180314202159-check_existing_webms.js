import Webm from '../models/Webm';

export default {
  up: () => Webm.update({ isChecked: true }, { where: { isChecked: false } }),
  down: () => Webm.update({ isChecked: false }, { where: { isChecked: true } }),
};
