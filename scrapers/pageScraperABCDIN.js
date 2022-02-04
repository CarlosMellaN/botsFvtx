const nodemailer = require('nodemailer')
const path = require('path');
let folder = require('fs');
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
        subject: 'Problemas con el bot de ABCDIN',
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
    url: 'https://sso.bbr.cl/auth/realms/abcdin/protocol/openid-connect/auth?response_type=code&client_id=abcdin-client-prod&redirect_uri=https%3A%2F%2Fportalb2b.abcdin.cl%2FABCDin%2FBBRe-commerce%2Fmain&state=8e44797c-f50a-4811-a722-a8641990e2e3&login=true&scope=openid',
    
    async scraper(browser){
        console.log('_____________________________________________________________________________________________________________________')
        console.log('------------------------------------------------------ABCDIN---------------------------------------------------------')
        console.log('_____________________________________________________________________________________________________________________')
        let page = await browser.newPage();
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
        let dirEnterprise = dir+'/abcdin'
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
            await page.setDefaultNavigationTimeout(10000);   
            await page.waitForSelector('#kc-form-login',{delay:2000});
            await page.type('#username', process.env.USER_ABCDIN, {delay: 100})
            await page.type('#password', process.env.PASS_ABCDIN, {delay: 200})
            await page.waitForSelector('iframe[src*="recaptcha/"]');
            console.log('wait for solve captcha')
            try {
                await page.solveRecaptchas();
            } catch (error) {
                console.log(error)
                await page.waitForTimeout(10000);
                await page.waitForSelector('#kc-form-login',{delay:2000});
                await page.type('#username', process.env.USER_ABCDIN, {delay: 100})
                await page.type('#password', process.env.PASS_ABCDIN, {delay: 200})
                await page.waitForSelector('iframe[src*="recaptcha/"]');
                console.log('wait for solve captcha, second try')
                await page.solveRecaptchas();
                try {
                    console.log('cant login')
                }catch (err) {
                    messageErrorEmail = 'Error al logearse: '+err+'\na revisar'
                    await errorEmail(messageErrorEmail);
                    console.log('close browser for errors in login')
                    await page.close();
                    await browser.close();
                }
            }
            await page.$eval('#kc-login', el => el.click())
            console.log('login successful')
            await page.goto('https://portalb2b.abcdin.cl/ABCDin/BBRe-commerce/main');
            await page.setDefaultNavigationTimeout(40000); 
            await page.waitForTimeout(10000); 
            const [button] = await page.$x("//span[contains(., 'Maestros')]");
            if (button) {
                await button.click();
                const [vev] = await page.$x("//span[contains(., 'Venta en Verde')]");
                await vev.click();
            }
            await page.waitForSelector('#gwt-uid-3',{delay:1000});
            await page.waitForTimeout(10000);
            await page.$eval('.v-button-btn-filter-search', el => el.click(),{delay:20000});
            console.log('wait for load data 40 seconds')
            await page.waitForTimeout(40000);
            //await page.waitForSelector('.v-slot-filter-toolbar',{delay:20000});
            //await page.waitForSelector('.v-slot.v-slot-toolbar-layout.v-align-right.v-align-middle',{delay:20000});
            await page.$eval('#gwt-uid-6', el => el.click(),{delay:20000});
            console.log('wait for load data 20 seconds')
            await page.waitForTimeout(20000)
                                            //*[@id="ABCDinBBRecommercemain-1676628978"]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div/div[2]/div/div/div/div/div[1]/div/div/div[3]/div/div[1]/div/span
            const elements = await page.$x('//*[@id="ABCDinBBRecommercemain-1676628978"]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div/div[2]/div/div/div/div/div[1]/div/div/div[3]/div/div[1]/div/span[@class="v-button-wrap"]')
            await elements[0].click() 
            console.log('wait for popup select format 60 seconds')
            await page.waitForTimeout(60000)
            await page.waitForSelector('div.v-window.v-widget.v-has-width.v-has-height.titleWindowsStyle.v-window-titleWindowsStyle > div.popupContent',{delay:20000});
            await page.$eval('#gwt-uid-43', el => el.click(),{delay: 1000});
            const [seleccionarLink] = await page.$x("//span[contains(., 'Seleccionar')]");
            seleccionarLink.click();
            console.log('wait for link download 35 seconds')
            await page.waitForTimeout(35000)
            await page.waitForSelector('.v-window.v-widget.v-has-width.v-has-height.titleWindowsStyle.v-window-titleWindowsStyle',{delay:20000});
            await page.$eval('div.v-horizontallayout.v-layout.v-horizontal.v-widget > div.v-slot > div.v-link.v-widget > a', el => el.click(),{delay: 1000});
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
                    await page.setDefaultNavigationTimeout(0);   
                    await page.waitForSelector('#kc-form-login',{delay:2000});
                    await page.type('#username', process.env.USER_ABCDIN, {delay: 100})
                    await page.type('#password', process.env.PASS_ABCDIN, {delay: 200})
                    await page.waitForSelector('iframe[src*="recaptcha/"]');
                    console.log('wait for solve captcha')
                    await page.solveRecaptchas();
                    await page.$eval('#kc-login', el => el.click())
                    console.log('login successful')*/
                    await page.goto('https://portalb2b.abcdin.cl/ABCDin/BBRe-commerce/main');
                    await page.setDefaultNavigationTimeout(40000); 
                    await page.waitForTimeout(10000); 
                    const [button] = await page.$x("//span[contains(., 'Maestros')]");
                    if (button) {
                        await button.click();
                        const [vev] = await page.$x("//span[contains(., 'Venta en Verde')]");
                        await vev.click();
                    }
                    await page.waitForSelector('#gwt-uid-3',{delay:1000});
                    await page.waitForTimeout(10000);
                    await page.$eval('.v-button-btn-filter-search', el => el.click(),{delay:20000});
                    console.log('wait for load data 40 seconds')
                    await page.waitForTimeout(40000);
                    //await page.waitForSelector('.v-slot-filter-toolbar',{delay:20000});
                    //await page.waitForSelector('.v-slot.v-slot-toolbar-layout.v-align-right.v-align-middle',{delay:20000});
                    await page.$eval('#gwt-uid-6', el => el.click(),{delay:20000});
                    console.log('wait for load data 20 seconds')
                    await page.waitForTimeout(20000)
                    //*[@id="ABCDinBBRecommercemain-1676628978"]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div/div[2]/div/div/div/div/div[1]/div/div/div/div/div[1]/div/span
                    //*[@id="ABCDinBBRecommercemain-1676628978"]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div/div[2]/div/div/div/div/div[1]/div/div/div[3]/div/div[1]/div/span
                    const elements = await page.$x('//*[@id="ABCDinBBRecommercemain-1676628978"]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div/div[2]/div/div/div/div/div[1]/div/div/div[3]/div/div[1]/div/span[@class="v-button-wrap"]')
                    await elements[0].click() 
                    console.log('wait for popup select format 60 seconds')
                    await page.waitForTimeout(60000)
                    await page.waitForSelector('div.v-window.v-widget.v-has-width.v-has-height.titleWindowsStyle.v-window-titleWindowsStyle > div.popupContent',{delay:20000});
                    await page.$eval('#gwt-uid-43', el => el.click(),{delay: 1000});
                    const [seleccionarLink] = await page.$x("//span[contains(., 'Seleccionar')]");
                    seleccionarLink.click();
                    console.log('wait for link download 35 seconds')
                    await page.waitForTimeout(35000)
                    
                    await page.waitForSelector('.v-window.v-widget.v-has-width.v-has-height.titleWindowsStyle.v-window-titleWindowsStyle',{delay:20000});
                    await page.$eval('div.v-horizontallayout.v-layout.v-horizontal.v-widget > div.v-slot > div.v-link.v-widget > a', el => el.click(),{delay: 1000});
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
                    console.log ("Timeout or other error: ", error)
                    messageErrorEmail = 'Segundo intento y tengo este error '+error+'\na revisar'
                    await errorEmail(messageErrorEmail);
                    await page.close();
                    await browser.close();
                }
            }
        }
        folder.readdir(dirEnterprise, (err, files) => {
            files.forEach(file => {
                //console.log(file);
                let fileExtension = path.extname(file);
                //console.log(fileExtension)
                if(fileExtension!='.xls'){
                    messageErrorEmail = 'La extension del archivo no es la correcta'
                    errorEmail(messageErrorEmail);
                }else{
                    folder.renameSync(dirEnterprise+'/'+file, dirEnterprise+'/abcdin.xls')
                }
                
            });
        });
    }
}
module.exports = scraperObject;