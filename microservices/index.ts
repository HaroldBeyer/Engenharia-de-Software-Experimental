let init = Date.now();
import express, { json } from 'express';
import { Instance } from './instance';
import { Loader } from './loader';
const app = express();
app.use(json());
const port = Math.floor(Math.random() * 10000);

const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const adapter = new FileAsync('db.json');


const instances: Instance[] = [new Instance('instance1', 0), new Instance('instance2', 0)];
const loader = new Loader(instances);




app.get('/', (req, res) => {
  return loader.run('get', req, res);
});

app.post('/', (req, res) => {
  return loader.run('post', req, res);
});

app.listen(port, async () => {
  console.log(`Running on ${port}`);
  const db = await low(adapter);
  prepareDb(db);
});

function prepareDb(db: any) {
  db.defaults({ posts: [], count: 0, init: [], exec: [] }).write();
  db.get('init').push(Date.now() - init).write();
}
