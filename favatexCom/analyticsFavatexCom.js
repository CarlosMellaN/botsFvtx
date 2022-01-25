const fetch = require('cross-fetch');
const OAuth = require('oauth-1.0a')
const crypto = require('crypto')
const fs = require('fs');
const util = require('util');
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
let consumerKey = process.env.CONSUMER_KEY
let consumerSecret = process.env.SECRET_KEY

const WooCommerce = new WooCommerceRestApi({
  url: "https://www.favatex.com/",
  consumerKey: consumerKey,
  consumerSecret: consumerSecret,
  version: "wc/v3"
});

const getAnalyticsSite = async () =>{
    let yesterday = new Date(Date.now() - (24*60*60*1000)); // 864e5 == 86400000 == 24*60*60*1000 (yesterday)
    const offset = yesterday.getTimezoneOffset()
    yesterday = new Date(yesterday.getTime() - (offset*60*1000))
    //console.log(yesterday.toISOString().split('T')[0])
    yesterday = yesterday.toISOString().split('T')[0]
    //let endpoint = 'orders?orderby=date&order=desc&after='+yesterday+'T00%3A00%3A00&before='+yesterday+'T23%3A59%3A59&page=1&per_page=100&interval=day'
    WooCommerce.get('orders?orderby=date&order=desc&after=2022-01-01T00%3A00%3A00&before=2022-01-24T23%3A59%3A59&page=1&per_page=100&interval=day')
    //WooCommerce.get("orders")
    .then((response) => {
        //console.log(response.data);
        let orders = response.data.toString()
        var count = (orders.match(/  -/g) || []).length;
        count = count * 3
        orders = orders.slice(count)
        orders = orders.slice(2)
        //console.log(orders)
        //const output = fs.createWriteStream('./stdout.txt');
        /*fs.writeFile("./orders", "\n", function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
        // Or
        //fs.writeFileSync('./orders', orders);*/
        orders = JSON.parse(orders)
        //console.log(orders)
        let countOrder = 0
        for(let order of orders){
            countOrder++
            console.log(countOrder)
            let orderId = order.id
            let statusOrder = order.status
            console.log('-----------------------------------------')
            console.log('Order id: '+orderId)
            console.log('Order status '+statusOrder)
            console.log('Date created: '+order.date_created)
            console.log('Order shipping total $: ' +order.shipping_total)
            console.log('Order total $: ' +order.total)
            order.line_items.forEach(element => {
                console.log('___________')
                console.log('product name '+element.name)
                console.log('product quantity: '+element.quantity)
                console.log('product id: '+element.product_id)
                console.log('SKU: '+element.sku)
                console.log('price: '+element.price)
            });
            console.log('-----------------------------------------')
        }
    })
    .catch((error) => {
        console.log(error.response.data);
    });
    /*const oauth = OAuth({
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
    const requestSales = {
        url: 'https://www.favatex.com/wp-json/wc/v3/orders?date_min=2022-01-20&date_max=2022-01-20',
        method: 'GET',
    };
    const getSales = async () => {
        await fetch(requestSales.url, {
            headers: oauth.toHeader(oauth.authorize(requestSales))
        })
        .then((response)=>{
            console.log(response)
            return response.json()
        })
        .then((resp)=>{
            console.table(resp)
            
        })
        .catch(error=>{
            console.log(error)
        })
    }
    getSales()*/
}
module.exports = getAnalyticsSite;