const express = require('express'); // Adding Express
const app = express(); // Initializing Express
const fetch = require('cross-fetch');
const urlGetAccessToken = process.env.URL_GET_ACCESS_TOKEN
const client_id = process.env.CLIENT_ID
const client_secret= process.env.CLIENT_SECRET
const redirectUrl = 'https://www.favatex.com/'

const getAccessToken = async()=>{

    /*var meli = require('mercadolibre-nodejs-sdk');
    let apiInstance = new meli.OAuth20Api();
    let apiInstance = new meli.RestClientApi();
    let resource = "resource_example"; // String | 
    let accessToken = "accessToken_example"; // String | 
    apiInstance.resourceGet(resource, accessToken, (error, data, response) => {
    if (error) {
        console.error(error);
    } else {
        console.log('API called successfully.');
    }
    });

    // Get the Auth URL, for example, country Argentina -> 1
    const authUrl = 'https://auth.mercadolibre.com/'
    // Auth URLs Options by country
    // [0]  - https://api.mercadolibre.com (default API endpoint)
    // [1]  - https://auth.mercadolibre.com.ar
    // [2]  - https://auth.mercadolivre.com.br
    // [3]  - https://auth.mercadolibre.com.co
    // [4]  - https://auth.mercadolibre.com.mx
    // [5]  - https://auth.mercadolibre.com.uy
    // [6]  - https://auth.mercadolibre.cl
    // [7]  - https://auth.mercadolibre.com.cr
    // [8]  - https://auth.mercadolibre.com.ec
    // [9]  - https://auth.mercadolibre.com.ve
    // [10] - https://auth.mercadolibre.com.pa
    // [11] - https://auth.mercadolibre.com.pe
    // [12] - https://auth.mercadolibre.com.pt
    // [13] - https://auth.mercadolibre.com.do

    // Use the correct auth URL
    apiInstance.apiClient.basePath = authUrl;

    let responseType = 'code'; // String |
    let clientId = client_id; // String |
    let redirectUri = redirectUrl; // String |
    apiInstance.auth(
    responseType,
    clientId,
    redirectUri,
    (error, data, response) => {
            if (error) {
                console.error(error);
            } else {
                console.log('API called successfully.');
                console.log(response)
            }
        }
    );*/

    async function getAccessTokenML(){
        console.log('ml')
        await fetch('https://api.mercadolibre.com/oauth/token', {
            method:"POST",
            headers:{
                'accept': '*/*',
                'content-type': 'multipart/form-data; boundary=<calculated when request is sent>',
            },
            data :{
                'grant_type':'authorization_code',
                'client_id': `${client_id}`,
                'client_secret':`${client_secret}`,
                'code':'TG-61e98f09804314001b6cee4a-673868683',
                'redirect_uri':`${redirectUrl}`
            }
        })
        .then((response)=>{
            return response.json()
        })
        .then((resp)=>{
            console.log(resp)
        })
        .catch(error=>{
            console.log(error)
        })
    }
    getAccessTokenML()
}
module.exports = getAccessToken;