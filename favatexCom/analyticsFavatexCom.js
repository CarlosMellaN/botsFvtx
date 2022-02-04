const fs = require('fs');
const util = require('util');
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
let consumerKey = process.env.CONSUMER_KEY
let consumerSecret = process.env.SECRET_KEY
let listOrderProduct = []
const WooCommerce = new WooCommerceRestApi({
  url: "https://www.favatex.com/",
  consumerKey: consumerKey,
  consumerSecret: consumerSecret,
  version: "wc/v3"
});

let yesterday = new Date(Date.now() - (24*60*60*1000)); // 864e5 == 86400000 == 24*60*60*1000 (yesterday)
const offset = yesterday.getTimezoneOffset()
yesterday = new Date(yesterday.getTime() - (offset*60*1000))
//console.log(yesterday.toISOString().split('T')[0])
yesterday = yesterday.toISOString().split('T')[0]
let endpoint = 'orders?orderby=date&order=desc&after='+yesterday+'T00%3A00%3A00&before='+yesterday+'T23%3A59%3A59&page=1&per_page=100&interval=day'
const getAnalyticsSite = async () =>{
    let i = 1
    let totalPages
    //get total pages
    //await WooCommerce.get('orders?orderby=date&order=desc&after=2022-01-28T00%3A00%3A00&before=2022-01-29T23%3A59%3A59&page=1&per_page=100&interval=day')
    await WooCommerce.get(endpoint)
    .then((response)=>{
        totalPages = response.headers['x-wp-totalpages']
    })
    .catch((error)=>{
        console.log(error.response.data);
    })
    
    console.log(totalPages)
    while(totalPages>=i){
        //console.log('________________________________pagina: '+i+'_______________________________________')
        //'orders?orderby=date&order=desc&after=2022-01-25T00%3A00%3A00&before=2022-01-25T23%3A59%3A59&page=1&per_page=100&interval=day'
        //only for data of time ago
        let endpointPaginated = 'orders?orderby=date&order=desc&after='+yesterday+'T00%3A00%3A00&before='+yesterday+'T23%3A59%3A59&page='+i+'&per_page=100&interval=day'
        await WooCommerce.get(endpointPaginated)
        //WooCommerce.get("orders")
        .then((response) => {
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
                //console.log(countOrder)
                //console.log('-----------------------------------------')
                /*console.log('Order id: '+idOrder)
                console.log('Order status '+statusOrder)
                console.log('Date created: '+order.date_created)
                console.log('Order shipping total $: ' +order.shipping_total)
                console.log('Order total $: ' +order.total)*/
                order.line_items.forEach(element => {
                    let idOrder = order.id
                    let statusOrder = order.status
                    let dateCreatedOrder = order.date_created
                    let shippingPriceOrder = order.shipping_total
                    let totalPriceOrder = order.total
                    let nameProduct = element.name
                    let quantityProduct = element.quantity
                    let idProduct = element.product_id
                    let skuProduct = element.sku
                    let priceProduct = element.price
                    listOrderProduct.push({
                        idOrder,
                        statusOrder,
                        dateCreatedOrder,
                        shippingPriceOrder,
                        totalPriceOrder,
                        nameProduct,
                        quantityProduct,
                        idProduct,
                        skuProduct,
                        priceProduct
                    })
                    /*console.log('___________')
                    console.log('product name '+element.name)
                    console.log('product quantity: '+element.quantity)
                    console.log('product id: '+element.product_id)
                    console.log('SKU: '+element.sku)
                    console.log('price: '+element.price)*/
                });
                //console.log('-----------------------------------------')
            }
        })
        .catch((error) => {
            console.log(error.response.data);
        });
        i++
    }
    //console.table(listOrderProduct)
    return listOrderProduct
}
module.exports = getAnalyticsSite;