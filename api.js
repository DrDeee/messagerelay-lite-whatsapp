const { URL } = require('url')
require('dotenv').config({ path: './process.env' })

const axios = require('axios').default.create({
    baseURL: (new URL('/api/v1/frontend', `https://${process.env.API_ORIGIN}`)).href,
})

require('./openid').init(axios).then(async() => {
    console.info('API client logged in.')
})

module.exports = {
    async sendMessage(target, content) {
        return (await axios.post('/messages/create', {
            target: target,
            content: content
        })).data
    },
    async deleteMessage(id) {
        return (await axios.delete('/messages/' + id)).data
    }
}