const { Issuer } = require('openid-client');

module.exports = {
    init(axios) {
        return new Promise((resolve, reject) => {
            Issuer.discover(process.env.OPENID_DISCOVERY).then(async function(issuer) {
                const client = new issuer.Client({
                    client_id: process.env.OPENID_CLIENT,
                    token_endpoint_auth_method: 'none'
                })

                let tokenSet = await client.grant({
                    grant_type: 'password',
                    username: process.env.OPENID_USER,
                    password: process.env.OPENID_PASSWORD,
                });

                axios.defaults.headers.common['Authorization'] = tokenSet.token_type + ' ' + tokenSet.access_token

                setInterval(async() => {
                    const refreshToken = tokenSet.refresh_token;
                    tokenSet = await client.refresh(refreshToken);
                    axios.defaults.headers.common['Authorization'] = tokenSet.token_type + ' ' + tokenSet.access_token

                }, 58 * 1000);
                resolve()
            })
        })
    }
}