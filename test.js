const http = require('http');

const url = "127.0.0.1";
const port = 5827;

const data = JSON.stringify({
    title: "Teste"
})

let getCounter = 50;
let postCounter = 50;

setInterval(() => {
    if (postCounter > 0) {
        const req = http.request(
            {
                host: url,
                port,
                method: 'POST',
                path: '/',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                },
            },
            (res) => {
                res.on('data', (d) => {
                    process.stdout.write(d);
                    console.log("Done a post")
                })
            });

        req.on('error', error => console.error(error));

        req.write(data);
        postCounter--;

        req.end();
    }
    if (getCounter > 0) {
        http.get('http://' + url + ':' + port, (res) => {
            console.log("Done a request");
            getCounter--;
        });
    }
}, 1);