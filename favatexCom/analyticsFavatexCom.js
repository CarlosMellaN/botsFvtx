const fetch = require('cross-fetch');
const OAuth = require('oauth-1.0a')
const crypto = require('crypto')
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
let consumerKey = process.env.CONSUMER_KEY
let consumerSecret = process.env.SECRET_KEY

const WooCommerce = new WooCommerceRestApi({
  url: "https://www.favatex.com/",
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.SECRET_KEY,
  version: "wc/v3"
});



const getAnalyticsSite = async () =>{
    let trash = ' -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - '
    console.log(trash.length)
    WooCommerce.get("orders?&date_min=2022-01-20&date_max=2022-01-20&per_page=100")
    //WooCommerce.get("orders?orderby=date&per_page=100")
    .then((response) => {
        
        //console.log(response.data);
        let orders = response.data.toString()
        orders = orders.slice(654)
        orders = JSON.parse(orders)
        //console.log(orders)
        for(let order of orders){
            let orderId = order.id
            let statusOrder = order.status
            console.log('-----------------------------------------')
            console.log('Order id '+orderId)
            console.log('Order status '+statusOrder)
            order.line_items.forEach(element => {
                console.log('product name '+element.name)
                console.log('product id '+element.product_id)
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