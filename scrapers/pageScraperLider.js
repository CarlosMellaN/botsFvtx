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
        subject: 'Problemas con el bot de Lider',
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
    url: 'https://b2b.walmartdigital.cl/s/stock/list',
    async scraper(browser){
        console.log('_____________________________________________________________________________________________________________________')
        console.log('-----------------------------------------------------LIDER-----------------------------------------------------------')
        console.log('_____________________________________________________________________________________________________________________')
        let page = await browser.newPage();
        const path = require('path');
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
        let dirEnterprise = dir+'/lider'
        if(!folder.existsSync(dirEnterprise)){
            console.log('create folder enterprise')
            folder.mkdirSync(dirEnterprise);
        }
        try {
            console.log(`Navigating to ${this.url}...`);
            await page.goto(this.url);
            await page.waitForTimeout(10000)
            // Wait for the required DOM to be rendered
            await page.waitForSelector('form[name=login]');
            await page.type('#input_0', process.env.USER_LIDER, {delay: 500})
            await page.type('#input_1', process.env.PASS_LIDER, {delay: 500})
            await page.$eval('.login-button', el => el.click(),{delay: 100});
            console.log('login successful')
            await page.waitForTimeout(10000)
            await page.waitForSelector('#content', {delay: 1000});
            await page.waitForTimeout(5000)
            await page.$eval('#stock-button-download', el => el.click(), {delay: 1000});
            await page._client.send("Page.setDownloadBehavior", {
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
                console.log(checkError)
                checkError++
                try {
                    console.log(`Navigating to ${this.url}...`);
                    await page.goto(this.url);
                    await page.waitForTimeout(10000)
                    // Wait for the required DOM to be rendered
                    //await page.waitForSelector('form[name=login]');
                    //await page.type('#input_0', process.env.USER_LIDER, {delay: 500})
                    //await page.type('#input_1', process.env.PASS_LIDER, {delay: 500})
                    //await page.$eval('.login-button', el => el.click(),{delay: 100});
                    //console.log('login successful')
                    await page.waitForTimeout(10000)
                    await page.waitForSelector('#content', {delay: 1000});
                    await page.waitForTimeout(5000)
                    await page.$eval('#stock-button-download', el => el.click(), {delay: 100});
                    await page._client.send("Page.setDownloadBehavior", {
                        behavior: "allow",
                        downloadPath: path.resolve('K:/COMERCIAL/VERDE/RESPALDO STK PORTALES-MANAGER-VTA PEND/STK B2B BAJADA/2022/', dirEnterprise)
                    })
                    await page.waitForTimeout(30000)
                    console.log('download successful \nclose browser')
                    await page.close();
                    await browser.close(); 
                } catch (error) {
                    console.log('second try')
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