const fs = require('fs')

let db
module.exports = {
    load() {
        console.info('Loading database..')
        try {
            const file = fs.readFileSync('database.json', {
                encoding: 'utf8'
            })
            db = JSON.parse(file)
        } catch (e) {
            console.error('Error while loading database', e)
            db = {
                msgs: {},
                mirror: {}
            }
            this.save()
        }
        console.info('Database loaded.')
    },
    save() {
        try {
            fs.writeFileSync('database.json', JSON.stringify(db), {
                encoding: 'utf8'
            })
            console.log('Database saved.')
        } catch (e) {
            console.error('Error while saving database', e)
            console.log('------ DATABASE JSON ------')
            console.log(db)
            console.log('------ DATABASE JSON ------')
        }
    },
    saveAsync() {
        fs.writeFile('database.json', JSON.stringify(db), (e) => {
            if (e) {
                console.error('Error while saving database', e)
                console.log('------ DATABASE JSON ------')
                console.log(db)
                console.log('------ DATABASE JSON ------')
            }
        })
    },

    getMessages(id) {
        const msgs = db.msgs[id]
        return msgs ? msgs : []
    },
    addMessage(id, msgId) {
        if (!db.msgs[id]) db.msgs[id] = []
        db.msgs[id].push(msgId)
    },
    removeMessages(id) {
        delete db.msgs[id]
    },
    addMirror(waId, msgId) {
        db.mirror[waId] = msgId
    },

    getMirrorById(id) {
        for (const waId in db.mirror) {
            if (db.mirror[waId] === id)
                return waId
        }
        return null
    },

    getMirrorByWaId(waId) {
        return db.mirror[waId] ? db.mirror[waId] : null
    },

    deleteMirror(msgId) {
        for (const waId in db.mirror) {
            if (msgId === db.mirror[waId])
                delete db.mirror[waId]
        }
    }
}