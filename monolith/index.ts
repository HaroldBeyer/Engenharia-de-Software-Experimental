let init = Date.now();
import express, { json } from 'express';
const app = express();
app.use(json());
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const port = Math.floor(Math.random() * 10000);
// const port = 8358;
const adapter = new FileSync('db.json');
const db = low(adapter);

//padrão
db.defaults({ posts: [], count: 0, init: [], exec: [] }).write();

app.get('/', async (req, res) => {
    init = Date.now();
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

    return response;
});

app.post('/', async (req, res) => {
    init = Date.now();
    const body = req.body;
    const title = body.title;
    await db.get('posts').push({ id: (Math.random() * 1000), title }).write();
    await db.update('count', (n: number) => n++).write();
    await db.get("exec").push({
        type: "post",
        time: Date.now() - init
    }).write();
    res.send("sent post request");
});

app.listen(port, () => {
    console.log(`Running on ${port}`);
    db.get('init').push(Date.now() - init).write();
});


class Post {
    id: string;
    title: string;
    constructor(id: string, title: string) {
        this.id = id;
        this.title = title;
    }
}