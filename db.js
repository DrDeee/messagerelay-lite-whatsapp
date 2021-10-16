const fs = require('fs')

let db = {}
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
            db = {}
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
        const msgs = db[id]
        return msgs ? msgs : []
    },
    addMessage(id, msgId) {
        if (!db[id]) db[id] = []
        db[id].push(msgId)
    },
    removeMessages(id) {
        delete db[id]
    }
}