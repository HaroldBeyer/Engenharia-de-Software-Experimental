const lambdaLocal = require('lambda-local');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('db.json');

let db;

const defaultColdStart = 200;

exports.getHandler = async (event, context) => {
    const init = Date.now();
    const isCold = event.cold;
    if (isCold)
        sleep(defaultColdStart);
    if (!db)
        await loadDB();
    const posts = await db.get('posts').map('title').value();

    await db.get("exec").push({
        type: "get",
        time: Date.now() - init,
        size: posts.length
    }).write()

    return {
        message: `Posts: ${posts}`,
        code: 200
    };
}


exports.postHandler = async (event, context) => {
    const init = Date.now();
    const isCold = event.cold;
    if (isCold)
        sleep(defaultColdStart);
    if (!db)
        await loadDB();

    const title = event.title;
    await db.get('posts').push({ id: (Math.random() * 1000), title }).write();
    await db.update('count', (n) => n++).write();
    await db.get("exec").push({
        type: "post",
        time: Date.now() - init,
    }).write();

    return {
        status: 201,
        message: `${title} succesfully inserted`
    };
}


/**
 * cold start é quando a função é chamda pela primeira vez
 * vai morrer qnd for iniciada
 * vai voltar dps de certo tempo sem ser chamada
 *
 * ou seja, pra eu "matar" o cold start eu preciso verificar se ela foi chamada nos ultimos 5 mins; aqui vou maudar pra 1 min;
 *
 */


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function loadDB() {
    db = await low(adapter);
    return;
}