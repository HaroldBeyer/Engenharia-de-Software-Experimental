import { Post } from './post';
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);
export class Instance {
  usage: number = 0;
  name: string;
  currentUsage

  constructor(name: string, currentUsage: number) {
    this.name = name;
    this.currentUsage = currentUsage;
    this.usage += currentUsage;
  }


  async post(req: any, res: any) {
    const init = Date.now();
    const body = req.body;
    const title = body.title;
    await db.get('posts').push({ id: (Math.random() * 1000), title }).write();
    await db.update('count', (n: number) => n++).write();
    await db.get("exec").push({
      type: "post",
      time: Date.now() - init
    }).write();

    this.usage -= this.currentUsage;

    return res.json({
      status: 201,
      message: `${title} succesfully inserted`
    });
  }

  async get(req:any, res:any) {
    const init = Date.now();
    const posts: Post[] = await db.get('posts').map('title').value();

    const response = res.json({
      message: `Posts: ${posts}`,
      code: 200
    })

    await db.get("exec").push({
      type: "get",
      time: Date.now() - init,
      size: posts.length
    }).write()

    this.usage -= this.currentUsage;

    return response;
  }
}