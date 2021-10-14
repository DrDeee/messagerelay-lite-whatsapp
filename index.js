require('dotenv').config()

const venom = require('venom-bot')
const Websocket = require('ws').WebSocket

const parseHtml = require('./parser')

const apiToken = process.env.API_TOKEN
const gateway = new Websocket('wss://' + process.env.API_ORIGIN + '/api/v1/gateway/backend')

const iaows = process.env.IAOW.split('|')
const wids = process.env.WID.split('|')

let waClient

gateway.onopen = () => {
    console.log('Websocket connected.')
    gateway.send(JSON.stringify({ type: 'code', code: apiToken }))
}

gateway.onerror = (e) => {
    console.log('Error:', e)
}

gateway.onmessage = async(msg) => {
    const data = JSON.parse(msg.data)
    switch (data.type) {
        case 'error':
            console.error('Error with gateway:', data.msg)
            break
        case 'verified':
            console.info('Gateway connection verified.')
            break
        case 'create':
            switch (data.target) {
                case 'wid':
                    for (const wid of wids)
                        waClient.sendText(wid, parseHtml(data.content))
                    break
                case 'iaow':
                    for (const iaow of iaows)
                        waClient.sendText(iaow, parseHtml(data.content))
                    break
            }

    }
}

venom
    .create()
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

async function start(client) {
    waClient = client
    client.onMessage((message) => {
        if (message.body === 'Hi' && message.isGroupMsg === false) {
            client
                .sendText(message.from, 'Welcome Venom 🕷')
                .then((result) => {
                    console.log('Result: ', result)
                })
                .catch((erro) => {
                    console.error('Error when sending: ', erro)
                })
        }
    })
}

const close = () => {
    client.close()
}

process.on('SIGINT', close)
process.on('SIGTERM', close)