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
        subject: 'Problemas con el bot de Ripley',
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
    url: 'https://b2b.ripley.cl/b2bWeb/portal/logon.do',
    async scraper(browser){
        console.log('_____________________________________________________________________________________________________________________')
        console.log('----------------------------------------------------RIPLEY-----------------------------------------------------------')
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
        let dirEnterprise = dir+'/ripley'
        if(!folder.existsSync(dirEnterprise)){
            console.log('create folder enterprise')
            folder.mkdirSync(dirEnterprise);
        }
        try {
            console.log(`Navigating to ${this.url}...`);
            await page.goto(this.url);
            // Wait for the required DOM to be rendered
            await page.waitForSelector('form[name=logonForm]');
            await page.type('input[name=txtCodUsuario]', process.env.USER_RIPLEY, {delay: 100})
            await page.type('input[name=txtPassword]', process.env.PASS_RIPLEY, {delay: 100})
            await page.$eval('input[name=btnLogin]', el => el.click(),{delay: 100});
            console.log('login successful')
            
            //next view
            await page.waitForTimeout(10000);
            const elementHandle = await page.waitForSelector('frame');
            const frame = await elementHandle.contentFrame();
            await frame.waitForSelector('#proceso66', {delay: 1000});
            await frame.waitForSelector('.clFoldLinks', {delay: 1000});
            await frame.$eval('a[onclick="foldmenu(3,-1);"]', el => el.click(), {delay: 10});
            
            //next view
            await frame.waitForSelector('.cuerpo');
            await frame.waitForSelector('.derecha');
            const elementHandle2 = await frame.waitForSelector('iframe');
            const frame2 = await elementHandle2.contentFrame();
            await frame2.waitForSelector('.body');
            await frame2.select('select[name=bodega]', '2784');
            await frame2.$eval('input[name=chkSalArchivo]', el => el.click(),{delay: 100});
            await frame2.$eval('#Buscar', el => el.click(),{delay: 100});
            await frame2.waitForTimeout(60000);//60000 is one minute
            console.log('waiting for tab to archive .csv')
            
            //next view, open new tab after 1 minute
            let urlDownload = 'https://b2b.ripley.cl/b2bWeb//ddomicilio/consultas/mostrarArchivoConsultaStockProveedor.jsp?urlOrigen=%2Fddomicilio%2Fconsultas%2FmostrarArchivoConsultaStockProveedor.jsp';
            let pageDownload = await browser.newPage();
            await pageDownload.goto(urlDownload);
            await pageDownload.waitForSelector('form[name=archivoForm]');
            await pageDownload.$eval('a[href="javascript: descargarArchivo();"]', el => el.click(), {delay: 1000});
            await pageDownload._client.send("Page.setDownloadBehavior", {
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
                    await page.waitForSelector('form[name=logonForm]');
                    await page.type('input[name=txtCodUsuario]', process.env.USER_RIPLEY, {delay: 100})
                    await page.type('input[name=txtPassword]', process.env.PASS_RIPLEY, {delay: 100})
                    await page.$eval('input[name=btnLogin]', el => el.click(),{delay: 100});
                    console.log('login successful')*/
                    
                    //next view
                    await page.waitForTimeout(10000);
                    const elementHandle = await page.waitForSelector('frame');
                    const frame = await elementHandle.contentFrame();
                    await frame.waitForSelector('#proceso66', {delay: 1000});
                    await frame.waitForSelector('.clFoldLinks', {delay: 1000});
                    await frame.$eval('a[onclick="foldmenu(3,-1);"]', el => el.click(), {delay: 10});
                    
                    //next view
                    await frame.waitForSelector('.cuerpo');
                    await frame.waitForSelector('.derecha');
                    const elementHandle2 = await frame.waitForSelector('iframe');
                    const frame2 = await elementHandle2.contentFrame();
                    await frame2.waitForSelector('.body');
                    await frame2.select('select[name=bodega]', '2784');
                    await frame2.$eval('input[name=chkSalArchivo]', el => el.click(),{delay: 100});
                    await frame2.$eval('#Buscar', el => el.click(),{delay: 100});
                    await frame2.waitForTimeout(60000);//60000 is one minute
                    console.log('waiting for tab to archive .csv')
                    
                    //next view, open new tab after 1 minute
                    let urlDownload = 'https://b2b.ripley.cl/b2bWeb//ddomicilio/consultas/mostrarArchivoConsultaStockProveedor.jsp?urlOrigen=%2Fddomicilio%2Fconsultas%2FmostrarArchivoConsultaStockProveedor.jsp';
                    let pageDownload = await browser.newPage();
                    await pageDownload.goto(urlDownload);
                    await pageDownload.waitForSelector('form[name=archivoForm]');
                    await pageDownload.$eval('a[href="javascript: descargarArchivo();"]', el => el.click(), {delay: 1000});
                    await pageDownload._client.send("Page.setDownloadBehavior", {
                        behavior: "allow",
                        downloadPath: path.resolve('K:/COMERCIAL/VERDE/RESPALDO STK PORTALES-MANAGER-VTA PEND/STK B2B BAJADA/2022/', dirEnterprise)
                    })
                    await page.waitForTimeout(30000)
                    console.log('download successful \nclose browser')
                    await page.close();
                    await browser.close(); 
                } catch (error) {
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
                //console.log(file);
                folder.renameSync(dirEnterprise+'/'+file, dirEnterprise+'/ripley.csv')
            });
        });
        /*folder.readdir(dirEnterprise, (err, files) => {
            files.forEach(file => {
                //console.log(file);
                let fileExtension = path.extname(file);
                //console.log(fileExtension)
                if(fileExtension!='.csv'){
                    messageErrorEmail = 'La extension del archivo no es la correcta'
                    errorEmail(messageErrorEmail);
                }else{
                    folder.renameSync(dirEnterprise+'/'+file, dirEnterprise+'/ripley.csv')
                }
            });
        });*/
    }
}
module.exports = scraperObject;