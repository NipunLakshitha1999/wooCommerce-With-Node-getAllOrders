const express = require('express')
const  wooCommerceAPI = require("@woocommerce/woocommerce-rest-api").default;

const app = express()
const port = 3002

var Data=require('./module/data')
var db=require('./db/db_connection')

const woocommerce = new wooCommerceAPI({
    url: "http://127.0.0.1/wordpress",
    consumerKey: "ck_b94c70093b2d48c2113fc2987c42b5a0cd296b7c",
    consumerSecret: "cs_c4473d345241b8ef0ca95d7c2ae8a217ad11557e",
    version: "wc/v3"
});

var orderID;
var total;
var customerID;
var billCompany;
var billFirstName;
var billLastName;
var billCity;
var shipingFirstName;
var shipingLastName;
var shipingAddress;
var paymentMethodTitle;
var i;
woocommerce.get("orders", {
})
    .then((response) => {
        var len=response.data.length+1;
        for (i=0;i<len;i++){
            oID=response.data[i].id;
            ttl=response.data[i].total;
            cID=response.data[i].customer_id;
            bCompany=response.data[i].billing.company;
            bFirstName=response.data[i].billing.first_name;
            bLastName=response.data[i].billing.last_name;
            bCity=response.data[i].billing.city;
            sFirstName=response.data[i].shipping.first_name;
            sLastName=response.data[i].shipping.last_name;
            sAddress=response.data[i].shipping.address_1;
            pMethodTitle=response.data[i].payment_method_title;


            console.log(oID);
            console.log(ttl);
            console.log(cID);
            console.log(bCompany);
            console.log(bFirstName);
            console.log(bLastName);
            console.log(bCity);
            console.log(sFirstName);
            console.log(sLastName);


           db.query('INSERT INTO wOrder(orderID,total,customerID,billCompany,billFirstName,billLastName,billCity,shipingFirstName,shipingLastName) VALUES (?,?,?,?,?,?,?,?,?)',[oID,ttl,cID,bCompany,bFirstName,bLastName,bCity,sFirstName,sLastName],function (err,res) {
                if (err) throw err;
                console.log(res);
           })
        }

    })
    .catch((error) => {
        console.log(error)
    })

app.set('port', port);
module.exports=app;

