import express, { json } from 'express';
const app = express();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const port = Math.floor(Math.random() * 10000);

const adapter = new FileSync('db.json');
const db = low(adapter);

//padrão
db.defaults({ posts: [], count: 0 }).write();



app.get('/', (req, res) => {
    return res.json({
        message: `Posts: ${JSON.stringify(db.get('post').find().value())}`,
        code: 200
    })
});

app.post('/', (req, res) => {
    const body = req.body;
    console.log(JSON.stringify(body));

    db.get('posts').push({ id: (Math.random() * 1000), title: body.title }).write();
    db.update('count', (n: number) => n++).write();
    res.send("sent post request");
});

app.listen(port, () => {
    console.log(`Running on ${port}`);
});