const http = require('http');

const url = "127.0.0.1";
const port = 2517;

const data = JSON.stringify({
    title: "Teste"
})

let counter = 50;

setInterval(() => {
    if (counter == 0) {
        console.log("ENding");
        return;
    }

    // const req = http.request(
    //     {
    //         host: url,
    //         port,
    //         method: 'POST',
    //         path: '/',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Content-Length': data.length,
    //         },
    //     },
    //     (res) => {
    //         res.on('data', (d) => {
    //             process.stdout.write(d);
    //             console.log("Done a post")
    //         })
    //     });

    // req.on('error', error => console.error(error));

    // req.write(data);

    // req.end();
    http.get('http://' + url + ':' + port, (res) => {
        console.log("Done a request");
        counter--;
    });
}, 6000);