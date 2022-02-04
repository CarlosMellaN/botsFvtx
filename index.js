const dotenv = require('dotenv')
dotenv.config()
const puppeteer = require('puppeteer')
const express = require('express'); // Adding Express
const app = express(); // Initializing Express
const browserObject = require('./browser');
const scraperControllerParis = require('./controllers/pageControllerParis');
const scraperControllerLider = require('./controllers/pageControllerLider');
const scraperControllerRipley = require('./controllers/pageControllerRipley');
const scraperControllerFalabella = require('./controllers/pageControllerFalabella');
const scraperControllerABCDIN = require('./controllers/pageControllerABCDIN');
const scraperControllerEasy = require('./controllers/pageControllerEasy');
const scraperControllerSodimac = require('./controllers/pageControllerSodimac');
const scraperControllerLaPolar = require('./controllers/pageControllerLaPolar');
const getProductsFavatex = require('./favatexCom/productFavatexWeb')
const getAccessToken = require('./mercadolibre/apiML')
const saveProductsFavatex = require('./favatexCom/insertProductsDB')
const saveOrdersFavatex = require('./favatexCom/insertOrderProducts')
const getAnalyticsSite = require('./favatexCom/analyticsFavatexCom')

app.get('/auth', (req, res) => {
    res.send('hola')
});

//getAccessToken()
//run manually
app.get('/callbots', (req,res) =>{
    callBots()
});
app.get('/abcdin', function(req, res) {
    res.send(`<html><body><h2>Descargando archivo ABCDIN</h2></body></html>`)
    let browserInstance = browserObject.startBrowser();
    scraperControllerABCDIN(browserInstance)
});
app.get('/easy', function(req, res) {
    res.send(`<html><body><h2>Descargando archivo Easy</h2></body></html>`)
    let browserInstance = browserObject.startBrowser();
    scraperControllerEasy(browserInstance)
});
app.get('/falabella', function(req, res) {
    res.send(`<html><body><h2>Descargando archivo Falabella</h2></body></html>`)
    let browserInstance = browserObject.startBrowser();
    scraperControllerFalabella(browserInstance)
});
app.get('/lapolar', function(req, res) {
    res.send(`<html><body><h2>Descargando archivo La Polar</h2></body></html>`)
    let browserInstance = browserObject.startBrowser();
    scraperControllerLaPolar(browserInstance)
});
app.get('/lider', function(req, res) {
    res.send(`<html><body><h2>Descargando archivo Lider</h2></body></html>`)
    let browserInstance = browserObject.startBrowser();
    scraperControllerLider(browserInstance)
});
app.get('/paris', function(req, res) {
    res.send(`<html><body><h2>Descargando archivo Paris</h2></body></html>`)
    let browserInstance = browserObject.startBrowser();
    scraperControllerParis(browserInstance)
});
app.get('/ripley', function(req, res) {
    res.send(`<html><body><h2>Descargando archivo Ripley</h2></body></html>`)
    //Start the browser and create a browser instance
    let browserInstance = browserObject.startBrowser();
    // Pass the browser instance to the scraper controller
    scraperControllerRipley(browserInstance)
    console.log('ripley bot')
});
app.get('/sodimac', function(req, res) {
    res.send(`<html><body><h2>Descargando archivo Sodimac</h2></body></html>`)
    let browserInstance = browserObject.startBrowser();
    scraperControllerSodimac(browserInstance)
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const callBots = async() =>{
    app.get('/', (req, res) => {
        res.send('<html><body><h1>Favatex</h1></body></html>')
    })
    let mainBrowser;
    mainBrowser = await puppeteer.launch({
        headless: true,
        slowMo: 10,
        args: ["--disable-setuid-sandbox"],
        'ignoreHTTPSErrors': true
    });
    let url = 'http://localhost:3000/'
    let mainPage = await mainBrowser.newPage();
    await mainPage.goto(url);
    await mainPage.waitForTimeout(5000);
    await mainPage.reload(url);
    
    app.get('/abcdin', function(req, res) {
        res.send(`<html><body><h2>Descargando archivo ABCDIN</h2></body></html>`)
        let browserInstance = browserObject.startBrowser();
        scraperControllerABCDIN(browserInstance)
    });
    await mainPage.goto(url+'abcdin');
    await delay(60000 * 5) 

    app.get('/easy', function(req, res) {
        res.send(`<html><body><h2>Descargando archivo Easy</h2></body></html>`)
        let browserInstance = browserObject.startBrowser();
        scraperControllerEasy(browserInstance)
    });
    await mainPage.goto(url+'easy');
    await delay(60000 * 4)

    app.get('/falabella', function(req, res) {
        res.send(`<html><body><h2>Descargando archivo Falabella</h2></body></html>`)
        let browserInstance = browserObject.startBrowser();
        scraperControllerFalabella(browserInstance)
    })
    await mainPage.goto(url+'falabella');
    await delay(60000 * 4) 

    app.get('/lapolar', function(req, res) {
        res.send(`<html><body><h2>Descargando archivo La Polar</h2></body></html>`)
        let browserInstance = browserObject.startBrowser();
        scraperControllerLaPolar(browserInstance)
    });
    await mainPage.goto(url+'lapolar');
    await delay(60000 * 4)

    app.get('/lider', function(req, res) {
        res.send(`<html><body><h2>Descargando archivo Lider</h2></body></html>`)
        let browserInstance = browserObject.startBrowser();
        scraperControllerLider(browserInstance)
    });
    await mainPage.goto(url+'lider');
    await delay(60000 * 2)

    app.get('/paris', function(req, res) {
        res.send(`<html><body><h2>Descargando archivo Paris</h2></body></html>`)
        let browserInstance = browserObject.startBrowser();
        scraperControllerParis(browserInstance)
    });
    await mainPage.goto(url+'paris');
    await delay(60000 * 5)

    // Wrapping the Puppeteer browser logic in a GET request
    app.get('/ripley', function(req, res) {
        res.send(`<html><body><h2>Descargando archivo Ripley</h2></body></html>`)
        //Start the browser and create a browser instance
        let browserInstance = browserObject.startBrowser();
        // Pass the browser instance to the scraper controller
        scraperControllerRipley(browserInstance)
    });
    await mainPage.goto(url+'ripley');
    await delay(60000 * 3) /// waiting 40 second.

    app.get('/sodimac', function(req, res) {
        res.send(`<html><body><h2>Descargando archivo Sodimac</h2></body></html>`)
        let browserInstance = browserObject.startBrowser();
        scraperControllerSodimac(browserInstance)
    });
    await mainPage.goto(url+'sodimac');
    await delay(60000 * 4) /// waiting 40 second.
    
    console.log('close Main Page')
    await mainPage.close();
    await mainBrowser.close();
}

// Making Express listen on port 3000
app.listen(3000, function() {
  console.log('Running on port 3000.');
});
//saveProductsFavatex()
//saveOrdersFavatex()
//getAccessToken()
async function funcInterval(){
    var d = new Date();
    var minutes = d.getMinutes();
    if(minutes < 10){
        minutes.toString()
        minutes = '0' + minutes
    }else{
        minutes.toString()    
    }
    var hours = d.getHours();
    if(hours < 10){
        hours.toString()
        hours = '0' + hours
    }else{
        hours.toString()    
    }
    if(hours+':'+minutes=='07:00'){
        console.log('it is '+hours+':'+minutes+' time to run!') 
        await saveProductsFavatex()
        await saveOrdersFavatex()
        await callBots()//execute
    }
    if(hours+':'+minutes=='15:00'){
        console.log('it is '+hours+':'+minutes+' time to run! for Don Manuel') 
        await saveProductsFavatex()
    }
    console.log(hours.toString() +':'+minutes.toString()) 
}
setInterval(funcInterval, 60000 * 1);//one minute is 60000.
clearInterval(funcInterval())