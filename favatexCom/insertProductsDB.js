const getListTotalProducts = require('./productFavatexWeb')
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
async function saveProductsFavatex () {
    const products = await getListTotalProducts()
    //console.log(products)
    for (const product of products) {
        let productName = product.name.toString();
        let sku = product.sku;
        let quantity = parseInt(product.quantity)
        let regularPrice = parseInt(product.regularPrice)
        let salePrice = parseInt(product.salePrice)
        let hour = product.hour; 
        if(isNaN(salePrice)){
            salePrice=0
        }
        if(isNaN(quantity)){
            quantity=0
        }
        if(isNaN(regularPrice)){
            regularPrice=0
        }
        if(isNaN(salePrice)){
            salePrice=0
        }
        const saveProduct = async () =>{
            // connect to your database
            sql.connect(config, function (err) {
                if (err) console.log(err);
                // create Request object
                var request = new sql.Request();   
                // query to the database and get the records
                request.input('productName', sql.VarChar, productName);
                request.input('hour',sql.VarChar, hour);
                request.query("INSERT INTO dbo.com_stock_web (SKU, DESCRIPCION, STOCK, PRECIO, PRECIO_OF, fecha, HORA) VALUES ("+sku+", @productName , "+quantity+", "+regularPrice+", "+salePrice+", SYSDATETIME(), @hour)", function (err, recordset) {
                    if (err){
                        console.log(err)
                    }
                    //res.send(recordset);
                });
            });
        }
        saveProduct()
    }
    console.log('insert done!')
}

module.exports = saveProductsFavatex;