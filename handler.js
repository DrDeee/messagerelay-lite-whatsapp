const Whatsapp = require('venom-bot').Whatsapp

const api = require('./api')
const parser = require('./parser')
const db = require('./db')

/**
 * 
 * @param {Whatsapp} client 
 */
module.exports = (client) => {
    client.onMessage(async(msg) => {
        if (msg.isGroupMsg) {
            let data
            switch (msg.chatId._serialized.toLowerCase()) {
                case process.env.WID_MIRROR:
                    data = await api.sendMessage('wid', parser.WhatsAppToHTML(msg.content))
                    db.addMessage(msg.id, data.id)
                    db.save()
                    break
                case process.env.IAOW_MIRROR:
                    ldata = await api.sendMessage('iaow', parser.WhatsAppToHTML(msg.content))
                    db.addMessage(msg.id, data.id)
                    db.save()
                    break
            }
        }
    })
}