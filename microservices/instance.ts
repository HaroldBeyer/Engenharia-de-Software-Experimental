import { Post } from './post';
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

export class Instance {
  usage: number = 0;
  name: string;
  currentUsage: number;

  db: any;

  constructor(name: string, currentUsage: number) {
    this.name = name;
    this.currentUsage = currentUsage;
    this.usage += currentUsage;
    const adapter = new FileAsync('db.json');
    this.prepareDB(adapter);

  }

  private async prepareDB(adapter: any) {
    this.db = await low(adapter);
  }

  async post(req: any, res: any) {
    const init = Date.now();
    const body = req.body;
    const title = body.title;
    await this.db.get('posts').push({ id: (Math.random() * 1000), title }).write();
    await this.db.update('count', (n: number) => n++).write();
    await this.db.get("exec").push({
      type: "post",
      time: Date.now() - init,
      instance: this.name
    }).write();

    this.usage -= this.currentUsage;

    return res.json({
      status: 201,
      message: `${title} succesfully inserted`
    });
  }

  async get(req: any, res: any) {
    const init = Date.now();
    const posts: Post[] = await this.db.get('posts').map('title').value();

    const response = res.json({
      message: `Posts: ${posts}`,
      code: 200
    })

    await this.db.get("exec").push({
      type: "get",
      time: Date.now() - init,
      size: posts.length
    }).write()

    this.usage -= this.currentUsage;

    return response;
  }
}