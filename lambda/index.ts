import lambdaLocal = require("lambda-local");
let init = Date.now();
import express, { json } from 'express';
const app = express();
app.use(json());
const port = Math.floor(Math.random() * 10000);
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const adapter = new FileAsync('db.json');

let getTimeoutCounter = 6000;
let postTimeoutCounter = 6000;

app.get('/', async (req: any, res: any) => {
    console.log(`get timeout: ${getTimeoutCounter}`)
    const event = {
        isCold: getTimeoutCounter >= 6000 ? true : false
    }
    const response = await lambdaLocal.execute({
        event,
        lambdaPath: './lambdas',
        timeoutMs: 200,
        lambdaHandler: 'getHandler'
    });

    getTimeoutCounter = 0;
    return response;
});

app.post('/', async (req, res) => {
    console.log(`Counter: ${postTimeoutCounter}`);
    const event = {
        title: req.body.title,
        isCold: postTimeoutCounter >= 6000 ? true : false
    }
    
    await lambdaLocal.execute({
        event,
        lambdaPath: './lambdas',
        timeoutMs: 200,
        lambdaHandler: 'postHandler'
    });

    postTimeoutCounter = 0;
    return {
        message: `${req.body.title} inserted`,
        status: 201
    };

});

app.listen(port, async () => {
    console.log(`Running on ${port}`);
    const db = await low(adapter);
    prepareDb(db);
});

function prepareDb(db: any) {
    db.defaults({ posts: [], count: 0, init: [], exec: [] }).write();
    db.get('init').push(Date.now() - init).write();

    setInterval(() => {
        getTimeoutCounter += 600;
        postTimeoutCounter += 600;
    }, 600);
}