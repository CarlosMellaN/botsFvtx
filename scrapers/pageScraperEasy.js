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
        subject: 'Problemas con el bot de Easy',
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
    url: 'https://www.cenconlineb2b.com/',
    async scraper(browser){
        console.log('_____________________________________________________________________________________________________________________')
        console.log('-------------------------------------------------------EASY----------------------------------------------------------')
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
        let dirEnterprise = dir+'/easy'
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
            await page.setDefaultNavigationTimeout(0);   
            await page.waitForSelector('.bbr-container',{delay:2000});
            await page.select('#pais', 'chi')
            await page.waitForTimeout(1000)
            await page.select('#unidad_negocio', '/EasyCL/BBRe-commerce/main')
            await page.waitForTimeout(1000)
            await page.$eval('#btnIngresar', el => el.click())

            //new view
            //https://www.cenconlineb2b.com/auth/realms/cencosud/protocol/openid-connect/auth?response_type=code&client_id=easycl-client-prod&redirect_uri=https%3A%2F%2Fwww.cenconlineb2b.com%2FEasyCL%2FBBRe-commerce%2Fmain&state=0af2690c-4165-44c5-894f-7b3099720627&login=true&scope=openid
            await page.goto('https://www.cenconlineb2b.com/auth/realms/cencosud/protocol/openid-connect/auth?response_type=code&client_id=easycl-client-prod&redirect_uri=https%3A%2F%2Fwww.cenconlineb2b.com%2FEasyCL%2FBBRe-commerce%2Fmain&state=0af2690c-4165-44c5-894f-7b3099720627&login=true&scope=openid');
            await page.waitForSelector('#kc-form-login', {delay: 100})
            await page.type('#username', process.env.USER_PARIS, {delay: 100})
            await page.type('#password', process.env.PASS_PARIS, {delay: 200})
            await page.waitForSelector('iframe[src*="recaptcha/"]');
            console.log('wait for solve captcha')
            try {
                await page.solveRecaptchas();
                console.log('first try')
            }catch (error) {
                await page.waitForSelector('#kc-form-login', {delay: 100})
                await page.type('#username', process.env.USER_PARIS, {delay: 100})
                await page.type('#password', process.env.PASS_PARIS, {delay: 200})
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
            await page.goto('https://www.cenconlineb2b.com/EasyCL/BBRe-commerce/main');
            await page.waitForTimeout(1000)
            //await page.waitForSelector('.popupContent')
            //await page.$eval('.v-window-closebox',el => el.click(),{delay:1000})
            await page.waitForSelector('.v-menubar-mainMenuBar', {delay: 100})
            await page.setDefaultNavigationTimeout(40000);  
            const [button] = await page.$x("//span[contains(., 'Logística')]");
            if (button) {
                await button.click();
                const [vev] = await page.$x("//span[contains(., 'Adm. Parámetros VeV')]");
                await vev.click();
                await page.waitForTimeout(2000)
                const [stockDisponible] = await page.$x("//span[contains(., 'Stock Disponible')]");
                await stockDisponible.click();
            }
            await page.waitForSelector('#gwt-uid-3',{delay:1000});
            await page.$eval('.v-button-btn-filter-search', el => el.click(),{delay:20000});
            //await page.waitForSelector('.v-slot-filter-toolbar',{delay:20000});
            //await page.waitForSelector('.v-slot.v-slot-toolbar-layout.v-align-right.v-align-middle',{delay:20000});
            await page.waitForTimeout(10000)
            console.log('wait for icon download')
            //*[@id="EasyCLBBRecommercemain-1528083250"]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div/div/div[2]/div/div[1]/div/div/div[3]/div/div[1]/div/span
            const elements = await page.$x('//*[@id="EasyCLBBRecommercemain-1528083250"]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div/div/div[2]/div/div[1]/div/div/div[3]/div/div[1]/div/span[@class="v-button-wrap"]')
            await elements[0].click() 
            await page.waitForTimeout(5000)
            console.log('wait for popup select format')
            console.log('wait for link download')
            await page.waitForSelector('.popupContent > .v-window-wrap',{delay:20000});
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
                checkError++
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
                    await page.waitForSelector('.bbr-container',{delay:2000});
                    await page.select('#pais', 'chi')
                    await page.waitForTimeout(1000)
                    await page.select('#unidad_negocio', '/EasyCL/BBRe-commerce/main')
                    await page.waitForTimeout(1000)
                    await page.$eval('#btnIngresar', el => el.click())*/

                    //new view
                    //https://www.cenconlineb2b.com/auth/realms/cencosud/protocol/openid-connect/auth?response_type=code&client_id=easycl-client-prod&redirect_uri=https%3A%2F%2Fwww.cenconlineb2b.com%2FEasyCL%2FBBRe-commerce%2Fmain&state=0af2690c-4165-44c5-894f-7b3099720627&login=true&scope=openid
                    /*await page.goto('https://www.cenconlineb2b.com/auth/realms/cencosud/protocol/openid-connect/auth?response_type=code&client_id=easycl-client-prod&redirect_uri=https%3A%2F%2Fwww.cenconlineb2b.com%2FEasyCL%2FBBRe-commerce%2Fmain&state=0af2690c-4165-44c5-894f-7b3099720627&login=true&scope=openid');
                    await page.waitForSelector('#kc-form-login', {delay: 100})
                    await page.type('#username', process.env.USER_EASY, {delay: 100})
                    await page.type('#password', process.env.PASS_EASY, {delay: 200})
                    await page.waitForSelector('iframe[src*="recaptcha/"]');
                    console.log('wait for solve captcha')
                    await page.solveRecaptchas();
                    await page.$eval('#kc-login', el => el.click())
                    console.log('login successful')*/
                    await page.goto('https://www.cenconlineb2b.com/EasyCL/BBRe-commerce/main');
                    await page.waitForTimeout(1000)
                    //await page.waitForSelector('.popupContent')
                    //await page.$eval('.v-window-closebox',el => el.click(),{delay:1000})
                    await page.waitForSelector('.v-menubar-mainMenuBar', {delay: 100})
                    await page.setDefaultNavigationTimeout(40000);  
                    const [button] = await page.$x("//span[contains(., 'Logística')]");
                    if (button) {
                        await button.click();
                        const [vev] = await page.$x("//span[contains(., 'Adm. Parámetros VeV')]");
                        await vev.click();
                        await page.waitForTimeout(2000)
                        const [stockDisponible] = await page.$x("//span[contains(., 'Stock Disponible')]");
                        await stockDisponible.click();
                    }
                    await page.waitForSelector('#gwt-uid-3',{delay:1000});
                    await page.$eval('.v-button-btn-filter-search', el => el.click(),{delay:20000});
                    //await page.waitForSelector('.v-slot-filter-toolbar',{delay:20000});
                    //await page.waitForSelector('.v-slot.v-slot-toolbar-layout.v-align-right.v-align-middle',{delay:20000});
                    await page.waitForTimeout(10000)
                    console.log('wait for icon download')
                    //*[@id="EasyCLBBRecommercemain-1528083250"]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div/div/div[2]/div/div[1]/div/div/div[3]/div/div[1]/div/span
                    const elements = await page.$x('//*[@id="EasyCLBBRecommercemain-1528083250"]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div/div/div[2]/div/div[1]/div/div/div[3]/div/div[1]/div/span[@class="v-button-wrap"]')
                    await elements[0].click() 
                    await page.waitForTimeout(5000)
                    console.log('wait for popup select format')
                    console.log('wait for link download')
                    await page.waitForSelector('.popupContent > .v-window-wrap',{delay:20000});
                    await page.$eval('div.v-horizontallayout.v-layout.v-horizontal.v-widget > div.v-slot > div.v-link.v-widget > a', el => el.click(),{delay: 1000});
                    await page._client.send("Page.setDownloadBehavior", {
                        behavior: "allow",
                        downloadPath: path.resolve('K:/COMERCIAL/VERDE/RESPALDO STK PORTALES-MANAGER-VTA PEND/STK B2B BAJADA/2022/', dirEnterprise)
                    })
                    await page.waitForTimeout(30000)
                    console.log('download successful \nclose browser')
                    await page.close();
                    await browser.close();
                }catch(error){
                    console.log('segunda vez que se ejecuta')
                    messageErrorEmail = 'Segundo intento y tengo este error '+error+'\na revisar'
                    await errorEmail(messageErrorEmail);
                    await page.close();
                    await browser.close();
                }
            }
        }
        folder.readdir(dirEnterprise, (err, files) => {
            files.forEach(file => {
                console.log(file);
                folder.renameSync(dirEnterprise+'/'+file, dirEnterprise+'/easy.xls')
            });
        });
    }
}
module.exports = scraperObject;
