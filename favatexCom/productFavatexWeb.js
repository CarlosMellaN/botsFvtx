const fetch = require('cross-fetch');
const OAuth = require('oauth-1.0a')
const crypto = require('crypto')
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const sql = require("mssql");

let consumerKey = process.env.CONSUMER_KEY
let consumerSecret = process.env.SECRET_KEY
let totalProducts
const getProductsFavatex = async()=>{
    const oauth = OAuth({
        consumer: {
            key: consumerKey,
            secret: consumerSecret,
        },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return crypto
                .createHmac('sha1', key)
                .update(base_string)
                .digest('base64')
        },
    })
    const requestNumberTotalProducts = {
        url: 'https://www.favatex.com/wp-json/wc/v3/reports/products/totals',
        method: 'GET',
    };
    const getNumberTotalProducts = async () => {
        await fetch(requestNumberTotalProducts.url, {
            headers: oauth.toHeader(oauth.authorize(requestNumberTotalProducts))
        })
        .then((response)=>{
            return response.json()
        })
        .then((resp)=>{
            console.log('el nombre es '+resp[2].name + ' en total hay ' + resp[2].total + ' el slug es '+resp[2].slug)
            totalProducts = resp[2].total.toString()
            numberPage = totalProducts.charAt(0)
            console.log()
            
        })
        .catch(error=>{
            console.log(error)
        })
    }
    let url = 'https://www.favatex.com/wp-json/wc/v3/products?per_page=1&page='
    let numberPage = 0;
    let listProducts = []
    let sku
    let nameProduct
    let stockQuantity
    let regularPrice
    let salePrice
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
    var minutes = date.getMinutes();
    if(minutes < 10){
        minutes.toString()
        minutes = '0' + minutes
    }else{
        minutes.toString()    
    }
    var hours = date.getHours();
    if(hours < 10){
        hours.toString()
        hours = '0' + hours
    }else{
        hours.toString()    
    }
    let dir = 'K:/COMERCIAL/VERDE/RESPALDO STK PORTALES-MANAGER-VTA PEND/STK B2B BAJADA/2022/'+day+'.'+month;
    if (!folder.existsSync(dir)){
        console.log('create folder')
        folder.mkdirSync(dir);
    }
    //CHANGE NAME!!!!!
    let dirEnterprise = dir+'/mercadolibre'
    if(!folder.existsSync(dirEnterprise)){
        console.log('create folder enterprise')
        folder.mkdirSync(dirEnterprise);
    }
    const csvWriter = createCsvWriter({
        path: dirEnterprise+'/mercadolibre'+day+month+hours+minutes+'.csv',
        header: [
            {id: 'sku', title: 'SKU'},
            {id: 'quantity', title: 'QUANTITY'},
            {id: 'name', title: 'NAME'},
            {id: 'regularPrice', title: 'REGULAR PRICE'},
            {id: 'date', title: 'DATE'},
            {id: 'hour', title: 'HOUR'}
        ]
    });
    async function getListTotalProducts(){
        await getNumberTotalProducts()//get value of total of product for offset
        console.log('se insertaran '+ totalProducts +' productos')
        numberPage=parseInt(totalProducts)
        console.log(numberPage)
        let i = 0
        
        while(numberPage>i){
        //while(10>i){
            i++
            //console.log(i)
            let page = i
            url = url+page
            console.log(url)
            const request_data = {
                url: url,
                method: 'GET',
            };
            const getProducts = async () => {
                await fetch(request_data.url, {
                    headers: oauth.toHeader(oauth.authorize(request_data))
                })
                .then((response)=>{
                    return response.json()
                })
                .then((resp)=>{
                    //console.log(resp)
                    resp.forEach(element => {
                        sku = element.sku
                        nameProduct = element.name
                        stockQuantity = element.stock_quantity
                        regularPrice = element.regular_price
                        salePrice = element.sale_price
                        /*products = [
                            { 
                                sku: element.sku, 
                                quantity: element.stock_quantity, 
                                name: nameProduct, 
                                regularPrice: element.regular_price, 
                                salePrice: element.sale_price,
                                date: day+'/'+month,
                                hour: hours+':'+minutes
                            }
                        ];
                        csvWriter.writeRecords(products) //create a csv in define path*/
                        //console.log(products)
                              // returns a promise
                        /*.then(() => {
                            console.log( '...Done');
                        });*/
                        listProducts.push({ 
                            sku: element.sku, 
                            quantity: element.stock_quantity, 
                            name: nameProduct, 
                            regularPrice: element.regular_price, 
                            salePrice: element.sale_price,
                            date: day+'/'+month,
                            hour: hours+':'+minutes
                        })
                    });
                })
                .catch(error=>{
                    console.log(error)
                })
            }
            url = 'https://www.favatex.com/wp-json/wc/v3/products?per_page=1&page='
            await getProducts()
        }
    }
    await getListTotalProducts() 
    console.log('products list done!') 
    return listProducts     
}
module.exports = getProductsFavatex;