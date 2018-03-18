import path from 'path';
import config from '../src/config/server';
import { spawn } from './lib/cp';

const options = {
  cwd: path.resolve(__dirname, '../'),
  stdio: ['ignore', 'inherit', 'inherit'],
};

async function migrate() {
  await spawn('node_modules/.bin/babel-node', ['node_modules/.bin/sequelize', 'db:migrate', '--url', process.env.DATABASE_URL], options);
}

export default migrate;
