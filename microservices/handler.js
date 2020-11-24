const express = require('express');
const app = express();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const port = Math.floor(Math.random() * 10000);

const adapter = new FileSync('db.json');
const db = low(adapter);

//padrão
db.defaults({ posts: [], count: 0 }).write();


/**
 * simulate
 */

const instances = [{ port: number, isInUse: boolean }];

if (instances.length > 0) {

} else {


}

app.post('/', () => {

});

app.get('/', () => {

});

app.listen(port, () => {
    console.log("Microservices handler on");
})