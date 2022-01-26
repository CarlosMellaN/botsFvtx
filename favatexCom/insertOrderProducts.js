const getAnalyticsSite = require('./analyticsFavatexCom')
const sql = require("mssql");
// config for your database
const config = {
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    server: process.env.SERVER_DB, 
    database: process.env.DATABASE,
    options: {
        trustServerCertificate: false,
        encrypt: false,
        enableArithAbort: false
    }
};
/*const config = {
    user: process.env.USER_DB_QA,
    password: process.env.PASS_DB_QA,
    server: process.env.SERVER_DB_QA, 
    database: process.env.DATABASE_QA,
    options: {
        trustServerCertificate: false,
        encrypt: false,
        enableArithAbort: false
    }
};*/
async function saveOrdersFavatex () {
    const listOrderProduct = await getAnalyticsSite()
    console.table(listOrderProduct)
    //console.log('gg')
    for (const order of listOrderProduct) {
        let idOrder = order.idOrder
        let statusOrder = order.statusOrder
        let dateCreatedOrder = order.dateCreatedOrder
        let shippingPriceOrder = order.shippingPriceOrder
        let totalPriceOrder = order.totalPriceOrder
        let nameProduct = order.nameProduct
        let quantityProduct = order.quantityProduct
        let idProduct = order.idProduct
        let skuProduct = order.skuProduct
        //let quantity = parseInt(product.quantity)
        let priceProduct = order.priceProduct
        //dateCreatedOrder = dateCreatedOrder.toString()
        const saveOrder = async () =>{
            // connect to your database
            sql.connect(config, function (err) {
                if (err) console.log(err);
                // create Request object
                var request = new sql.Request();   
                // query to the database and get the records
                request.input('statusOrder', sql.VarChar, statusOrder);
                request.input('dateCreatedOrder', sql.VarChar, dateCreatedOrder);
                request.input('shippingPriceOrder', sql.VarChar, shippingPriceOrder);
                request.input('totalPriceOrder', sql.VarChar, totalPriceOrder);
                request.input('nameProduct', sql.VarChar, nameProduct);
                request.input('skuProduct', sql.VarChar, skuProduct);
                request.query("INSERT INTO dbo.com_analytics_web (ID_ORDEN, ESTADO_ORDEN, FECHA_CREACION_ORDEN, PRECIO_DESPACHO, PRECIO_ORDEN, NOMBRE_PRODUCTOS, CANTIDAD_PRODUCTOS, ID_PRODUCTO, SKU, PRECIO_PRODUCTO) VALUES ("+idOrder+",@statusOrder,@dateCreatedOrder,@shippingPriceOrder,@totalPriceOrder,@nameProduct , "+quantityProduct+", "+idProduct+",@skuProduct, "+priceProduct+")", function (err, recordset) {
                    if (err){
                        console.log(err)
                    }
                    //res.send(recordset);
                });
            });
        }
        saveOrder()
    }
    console.log('insert done!')
}

module.exports = saveOrdersFavatex;