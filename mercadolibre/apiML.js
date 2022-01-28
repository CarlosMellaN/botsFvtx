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
    let page = await mlBroser.newPage();
    await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
    await page.setViewport({
        width: 1920 + Math.floor(Math.random() * 100),
        height: 3000 + Math.floor(Math.random() * 100),
        deviceScaleFactor: 1,
        hasTouch: false,
        isLandscape: false,
        isMobile: false,
    });
    await page.goto(urlGetAccessToken);
    await page.waitForSelector('#login_user_form',{delay:2000});
    await page.type('#user_id', process.env.USER_ML, {delay: 1000})
    
    //console.log('wait for solve captcha')
    await page.$eval('.andes-button.andes-button--large.andes-button--loud.andes-button--full-width', el => el.click())
    await page.waitForTimeout(10000);
    await page.waitForSelector('iframe[src*="recaptcha/"]');
    await page.$eval('.andes-button.andes-button--large.andes-button--loud.andes-button--full-width', el => el.click())
    let currentUrl = page.url()
    console.log(currentUrl);
    /*await page.goto(currentUrl)
    await page.waitForSelector('#login_user_form',{delay:2000});
    await page.waitForTimeout(10000); 
    //await page.type('#user_id', process.env.USER_ML, {delay: 100})
    await page.waitForSelector('iframe[src*="recaptcha/"]');
    console.log('wait for solve captcha')
    await page.$eval('.andes-button.andes-button--large.andes-button--loud.andes-button--full-width', el => el.click())
    //await page.goto('https://www.mercadolibre.com/jms/mlc/lgz/msl/login/H4sIAAAAAAAEAzWNQQ6DMAwE_7LnCO459iORAQeiOgQ5pmlV8fcqqjiudmf2Cylr2oN9DobHwpFOMTgcQhaL5pAWeGSBQ03Gd5z7hJQyG2uF_3bPysuDY9FuiiSV4UCnbSFKafD_KzikGvhtrDtJaDy9Evf2JtYCj83sqH4cW2tDZp1pKZIm5WEWXA6RqgVTmp_wpidfP2Z_u0jIAAAA/enter-pass');
    //await page.type('#password', process.env.PASS_ML, {delay: 200})
    //await page.$eval('#action-complete', el => el.click())
    //await mainPage.waitForTimeout(5000);
    //await mainPage.reload(url);*/

    
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