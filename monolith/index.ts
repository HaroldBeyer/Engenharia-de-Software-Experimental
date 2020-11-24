import express, { json } from 'express';
const app = express();
app.use(json());
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
// const port = Math.floor(Math.random() * 10000);
const port = 8358;
const adapter = new FileSync('db.json');
const db = low(adapter);

//padrão
db.defaults({ posts: [], count: 0 }).write();



app.get('/', (req, res) => {
    const posts: Post[] = db.get('posts').map('title').value();

    return res.json({
        message: `Posts: ${posts}`,
        code: 200
    })
});

app.post('/', (req, res) => {
    const body = req.body;
    const title = body.title;

    db.get('posts').push({ id: (Math.random() * 1000), title }).write();
    db.update('count', (n: number) => n++).write();
    res.send("sent post request");
});

app.listen(port, () => {
    console.log(`Running on ${port}`);
});


class Post {
    id: string;
    title: string;
    constructor(id: string, title: string) {
        this.id = id;
        this.title = title;
    }
}