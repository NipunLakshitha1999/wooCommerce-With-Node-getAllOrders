const express = require('express');
var sql = require('mysql');
var bodyParser = require('body-parser')
var app = express()
var http = require('http');
var cros = require('cors');

app.use(bodyParser.json());
app.use(cros());
const wooCommerceAPI = require("@woocommerce/woocommerce-rest-api").default;


const woocommerce = new wooCommerceAPI({
    url: "http://127.0.0.1/wordpress",
    consumerKey: "ck_b94c70093b2d48c2113fc2987c42b5a0cd296b7c",
    consumerSecret: "cs_c4473d345241b8ef0ca95d7c2ae8a217ad11557e",
    version: 'wc/v3'

});

var connection = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'courier_db'
});

connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
    console.log("connected");
})

app.listen(3000, () => console.log("server runing"));


var getOrderID=null;
var vehicleTypeID = 1;
var packageTypeID = "8b2e393a-6d26-11eb-a5ac-d8c497a8aa1e";
var weight = 1.0;
var senderEmail = "examlple@gmail.com";
var senderMobile = "0343322345";
var senderComments = "done";
var status = "PENDING";
var date = new Date();
var newDate = date.getFullYear();
var newTime = date.getMinutes();

var sLocation;


function intervalFunc() {
    var year = new Date().toLocaleDateString();
    var date = year.toString().split("/");
    var newDate = date[2] + "-" + date[1] + "-" + date[0];
    var time = new Date().toLocaleTimeString();
    var getHour = time.toString().split(":");
    var hour = getHour[0];
    var minute = getHour[1];
    var second = getHour[2];
    console.log(second)
    console.log(newDate);
    console.log(hour);
    if (minute == "21" && second == "59") {
        getWoocommerceDetail(newDate, hour);
    }

}

setInterval(intervalFunc, 1000);


function getWoocommerceDetail(date, hour) {
    woocommerce.get("orders?after=" + date + "T" + hour + ":00:00&per_page=100")
        .then((response) => {
            console.log(response.data)
            var len = response.data.length + 1;
            for (i = 0; i < len; i++) {
                var id = response.data[i].id;
                var orderID = id;

                var customerID = response.data[i].customer_id;

                rName1 = response.data[i].billing.first_name;
                rName2 = response.data[i].billing.last_name;
                var recieverName = rName1 + "-" + rName2;

                rAddress1 = response.data[i].billing.address_1;
                rAddress2 = response.data[i].billing.address_2;
                var recieverAddress = rAddress1 + "-" + rAddress2;

                var reciverMobile = response.data[i].billing.phone;

                var reciverEmail = response.data[i].billing.email;

                sAddress1 = response.data[i].shipping.address_1;
                sAddress2 = response.data[i].shipping.address_2;
                var senderAddress = sAddress1 + "-" + sAddress2;

                var cost = response.data[i].total;


                console.log(orderID);
                console.log(customerID);
                console.log(recieverName);
                console.log(recieverAddress);
                console.log(reciverMobile);
                console.log(reciverEmail);
                console.log(senderAddress);
                console.log(cost);


                connection.query("INSERT INTO courier_order(COURIER_ORDER_ID,VEHICLE_TYPE_ID,PACKAGE_TYPE_ID ,COURIER_BUSINESS_CLIENT_ID ,RECEIVER_NAME ,RECEIVER_ADDRESS ,RECEIVER_LONGITUDE ,RECEIVER_LATITUDE ,RECEIVER_MOBILE ,RECEIVER_EMAIL,SENDER_ADDRESS ,SENDER_LONGITUDE ,SENDER_LATITUDE ,SENDER_EMAIL ,SENDER_MOBILE ,SENDER_COMMENTS ,ORDER_WEIGHT,ESTIMATED_COST ,STATUS ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [orderID, vehicleTypeID, packageTypeID, customerID, recieverName, recieverAddress, reciverLongitude, recieverLattitude, reciverMobile, reciverEmail, senderAddress, senderLongitude, senderLattitude, senderEmail, senderMobile, senderComments, weight, cost, status], function (err, res) {
                    if (err) throw err;
                    console.log(res);
                })
            }

        })
        .catch((error) => {
            console.log(error)
        })
}


app.post('/setOrder', function (req, res) {
    var postData = req.body;


    console.log(postData)
    connection.query('INSERT INTO courier_order SET?', postData, function (err, result, fields) {
        if (err) {
          res.send(err)
        } else {
            res.send(result)
        }

    })
});



app.get('/getVehicleType', function (req, res) {
    connection.query('SELECT * FROM vehicle_type', function (err, result, fields) {
        if (err) {
            console.log(err)
        } else {
            res.send(result);
        }
    })
})
app.get('/getPackageType', function (req, res) {
    console.log("method of package");
    connection.query('SELECT * FROM package_type', function (err, result, fields) {
        if (err) {
            console.log(err)
        } else {
            res.send(result);
        }
    })
})
app.get('/getCourierOrdersID', function (req, res) {
    console.log("method");
    connection.query('SELECT COURIER_ORDER_ID FROM courier_order ORDER BY COURIER_ORDER_ID DESC LIMIT 1 ', function (err, result, text) {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.post('/loginUser', function (req, res) {
    var data = req.body
    connection.query("SELECT  USER_ID FROM user WHERE USERNAME=? AND PASSWORD=md5(?)", [data.USERNAME, data.PASSWORD], function (err, result, fields) {
        if (err) {
            console.log(err)
        } else {
            console.log("log")
            res.send(result)
        }
    })
})


app.get('/toLocation',function (req,res){
    connection.query("SELECT * FROM package_type",function (err,result,fields){
        if (err){
            console.log(err)
        }else {
            res.send(result);
        }
    })
})

app.get('/getOrderDetail',function (req,res){
    connection.query('SELECT * FROM courier_order',function (err,result,field){
        if (err){
            console.log(err)
        }else {
            res.send(result);
        }
    })
})

