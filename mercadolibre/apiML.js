//https://auth.mercadolibre.com/authorization?response_type=code&client_id=8231588529441057&redirect_uri=https://www.favatex.com/
const express = require('express'); // Adding Express
const app = express(); // Initializing Express
const urlGetAccessToken = 'https://auth.mercadolibre.com/authorization?response_type=code&client_id=8231588529441057&redirect_uri=https://www.favatex.com/'
const client_id = '8231588529441057'
const client_secret= 'o97kurod4Jc6vd6zqZH9m52rIzAyi2VJ'
const redirectUrl = 'https://www.favatex.com/'



const getAccessToken = async()=>{
    
    app.get('/mercadolibre', function (req,res) {
        var authCallback = GetBaseUrl() + '/auth/mercadolibre/callback';
        var redirectUrl = util.format(urlGetAccessToken,
        config.clientId, authCallback);
        res.redirect(redirectUrl);
    });
}
module.exports = getAccessToken;