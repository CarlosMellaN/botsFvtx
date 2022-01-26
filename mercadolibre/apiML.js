//https://auth.mercadolibre.com/authorization?response_type=code&client_id=8231588529441057&redirect_uri=https://www.favatex.com/
const express = require('express'); // Adding Express
const app = express(); // Initializing Express
const puppeteer = require('puppeteer')
const urlGetAccessToken = process.env.URL_GET_ACCESS_TOKEN
const client_id = process.env.CLIENT_ID
const client_secret= process.env.CLIENT_SECRET
const redirectUrl = 'https://www.favatex.com/'
    
const getAccessToken = async()=>{
    let mlBroser;
    mlBroser = await puppeteer.launch({
        headless: false,
        slowMo: 10,
        args: ["--disable-setuid-sandbox"],
        'ignoreHTTPSErrors': true
    });
    let mlPage = await mlBroser.newPage();
    await mlPage.goto(urlGetAccessToken);
    await mlPage.waitForSelector('#login_user_form',{delay:2000});
    await mlPage.type('#user_id', process.env.USER_ML, {delay: 100})
    //await page.waitForSelector('iframe[src*="recaptcha/"]');
    //console.log('wait for solve captcha')
    await mlPage.$eval('.andes-button.andes-button--large.andes-button--loud.andes-button--full-width', el => el.click())
    await mlPage.waitForTimeout(10000);
    let currentUrl = mlPage.url()
    console.log(currentUrl);
    await mlPage.goto(currentUrl)
    await mlPage.waitForSelector('#login_user_form',{delay:2000});
    await mlPage.waitForTimeout(10000); 
    //await mlPage.type('#user_id', process.env.USER_ML, {delay: 100})
    await mlPage.waitForSelector('iframe[src*="recaptcha/"]');
    console.log('wait for solve captcha')
    await mlPage.$eval('.andes-button.andes-button--large.andes-button--loud.andes-button--full-width', el => el.click())
    //await mlPage.goto('https://www.mercadolibre.com/jms/mlc/lgz/msl/login/H4sIAAAAAAAEAzWNQQ6DMAwE_7LnCO459iORAQeiOgQ5pmlV8fcqqjiudmf2Cylr2oN9DobHwpFOMTgcQhaL5pAWeGSBQ03Gd5z7hJQyG2uF_3bPysuDY9FuiiSV4UCnbSFKafD_KzikGvhtrDtJaDy9Evf2JtYCj83sqH4cW2tDZp1pKZIm5WEWXA6RqgVTmp_wpidfP2Z_u0jIAAAA/enter-pass');
    //await mlPage.type('#password', process.env.PASS_ML, {delay: 200})
    //await mlPage.$eval('#action-complete', el => el.click())
    //await mainPage.waitForTimeout(5000);
    //await mainPage.reload(url);

    
    app.get('/auth', (req, res) => {
        res.redirect(
            'https://auth.mercadolibre.com/authorization?response_type=code&client_id=8231588529441057&redirect_uri=https://www.favatex.com/',
        );
    });
    
    async function getAccessTokenML(){
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
}
module.exports = getAccessToken;