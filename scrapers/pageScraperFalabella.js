const nodemailer = require('nodemailer')

function errorEmail(messageErrorEmail) {
    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.PASS_MAIL
        }
    });
    // Definimos el email
    var mailOptions = {
        from: process.env.USER_MAIL,
        to: 'carlosmellaneira@gmail.com,lsantana@favatex.com',
        subject: 'Problemas con el bot de Falabella',
        text: 'error del bot ' + messageErrorEmail
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info){
        if (error){
            console.log(error);
            //send(500, err.message);
        } else {
            console.log("Email error send");
            //status(200).jsonp(req.body);
        }
    });
}
let checkError = 0
const scraperObject = {
    url: 'https://b2b.falabella.com/b2bprd/grafica/html/index.html',
    async scraper(browser){
        console.log('_____________________________________________________________________________________________________________________')
        console.log('---------------------------------------------------FALABELLA---------------------------------------------------------')
        console.log('_____________________________________________________________________________________________________________________')
        const path = require('path');
        let page = await browser.newPage();
        let folder = require('fs');
        let date = new Date();
        let day = date.getDate();
        if(day < 10){
            day.toString()
            day = '0' + day
        }else{
            day.toString()    
        }
        let month = date.getMonth()+1;
        if(month < 10){
            month.toString()
            month = '0' + month
        }else{
            month.toString()    
        }
        //K:\COMERCIAL\VERDE\RESPALDO STK PORTALES-MANAGER-VTA PEND\STK B2B BAJADA\2022
        let dir = 'K:/COMERCIAL/VERDE/RESPALDO STK PORTALES-MANAGER-VTA PEND/STK B2B BAJADA/2022/'+day+'.'+month;
        if (!folder.existsSync(dir)){
            console.log('create folder')
            folder.mkdirSync(dir);
        }
        let dirEnterprise = dir+'/falabella'
        if(!folder.existsSync(dirEnterprise)){
            console.log('create folder enterprise')
            folder.mkdirSync(dirEnterprise);
        }
        try {
            console.log(`Navigating to ${this.url}...`);
            await page.goto(this.url);
            // Wait for the required DOM to be rendered
            await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
            await page.setViewport({
                width: 1920 + Math.floor(Math.random() * 100),
                height: 3000 + Math.floor(Math.random() * 100),
                deviceScaleFactor: 1,
                hasTouch: false,
                isLandscape: false,
                isMobile: false,
            });
            const elementHandle = await page.waitForSelector('frame');
            const frame = await elementHandle.contentFrame();   
            await frame.waitForSelector('.tablaGeneral',{delay:2000});
            await frame.select('select[name=CADENA]', '1');
            await frame.type('#empresa', process.env.EMPRESA_FALABELLA, {delay: 100})
            await frame.type('#usuario', process.env.USER_FALABELLA, {delay: 200})
            await frame.type('#clave', process.env.PASS_FALABELLA, {delay: 200})
            await frame.$eval('#entrar2', el => el.click())
            console.log('login successful')
            await frame.waitForTimeout(10000);
            await frame.waitForSelector('.tablaPrincipal',{delay:2000});
            await frame.$eval('#Bar6', el => el.click())
            await frame.$eval('#menuItem724_12', el => el.click())
            await frame.waitForTimeout(60000);
            await frame.$eval('[onclick="javascript:submitFiltro();"]', el => el.click(), {delay: 10});
            await frame.waitForTimeout(60000);
            await frame.$eval('.displayTagexcel', el => el.click())
            await frame._client.send("Page.setDownloadBehavior", {
                behavior: "allow",
                downloadPath: path.resolve('K:/COMERCIAL/VERDE/RESPALDO STK PORTALES-MANAGER-VTA PEND/STK B2B BAJADA/2022/', dirEnterprise)
              })
            await page.waitForTimeout(30000)
            console.log('download successful \nclose browser')
            await page.close();
            await browser.close(); 
        } catch (error) {
            console.log ("Timeout or other error: ", error)
            messageErrorEmail = 'Primer intento y tengo este error: '+error+'\na revisar'
            checkError++
            if(checkError==1){
                try {
                    /*console.log(`Navigating to ${this.url}...`);
                    await page.goto(this.url);
                    // Wait for the required DOM to be rendered
                    await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
                    await page.setViewport({
                        width: 1920 + Math.floor(Math.random() * 100),
                        height: 3000 + Math.floor(Math.random() * 100),
                        deviceScaleFactor: 1,
                        hasTouch: false,
                        isLandscape: false,
                        isMobile: false,
                    });
                    const elementHandle = await page.waitForSelector('frame');
                    const frame = await elementHandle.contentFrame();   
                    await frame.waitForSelector('.tablaGeneral',{delay:2000});
                    await frame.select('select[name=CADENA]', '1');
                    await frame.type('#empresa', process.env.EMPRESA_FALABELLA, {delay: 100})
                    await frame.type('#usuario', process.env.USER_FALABELLA, {delay: 200})
                    await frame.type('#clave', process.env.PASS_FALABELLA, {delay: 200})
                    await frame.$eval('#entrar2', el => el.click())
                    console.log('login successful')*/
                    await page.goto(this.url);
                    console.log(`Navigating to ${this.url}...`);
                    await frame.waitForTimeout(10000);
                    const elementHandle = await page.waitForSelector('frame');
                    const frame = await elementHandle.contentFrame();
                    await frame.waitForTimeout(10000);
                    await frame.waitForSelector('.tablaPrincipal',{delay:2000});
                    await frame.$eval('#Bar6', el => el.click())
                    await frame.$eval('#menuItem724_12', el => el.click())
                    await frame.waitForTimeout(60000);
                    await frame.$eval('[onclick="javascript:submitFiltro();"]', el => el.click(), {delay: 10});
                    await frame.waitForTimeout(60000);
                    await frame.$eval('.displayTagexcel', el => el.click())
                    await frame._client.send("Page.setDownloadBehavior", {
                        behavior: "allow",
                        downloadPath: path.resolve('K:/COMERCIAL/VERDE/RESPALDO STK PORTALES-MANAGER-VTA PEND/STK B2B BAJADA/2022/', dirEnterprise)
                    })
                    await page.waitForTimeout(30000)
                    console.log('download successful \nclose browser')
                    await page.close();
                    await browser.close();
                } catch (error) {
                    console.log('segunda vez que se ejecuta '+checkError)
                    messageErrorEmail = 'Segundo intento y tengo este error '+error+'\na revisar'
                    await errorEmail(messageErrorEmail);
                    await page.close();
                    await browser.close();
                }
            }
        }
    }
}
module.exports = scraperObject;