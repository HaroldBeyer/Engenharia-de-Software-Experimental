"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = express_1.default();
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var port = Math.floor(Math.random() * 10000);
var adapter = new FileSync('db.json');
var db = low(adapter);
//padrão
db.defaults({ posts: [], count: 0 }).write();
app.get('/', function (req, res) {
    return res.json({
        message: "Posts: " + JSON.stringify(db.get('post').find().value()),
        code: 200
    });
});
app.post('/', function (req, res) {
    var body = req.body;
    console.log(JSON.stringify(body));
    db.get('posts').push({ id: (Math.random() * 1000), title: body.title }).write();
    db.update('count', function (n) { return n++; }).write();
    res.send("sent post request");
});
app.listen(port, function () {
    console.log("Running on " + port);
});
