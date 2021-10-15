const venom = require('venom-bot')

venom
    .create()
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

async function start(client) {
    console.log('')
    for (const chat of await client.getAllChats()) {
        if (chat.name == undefined) continue
        console.log(chat.name, chat.id._serialized)
    }
    client.close()
    process.exit()
}

const close = () => {
    client.close()
}

process.on('SIGINT', close)
process.on('SIGTERM', close)