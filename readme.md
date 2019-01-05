# ZainCash Nodejs Package

A nodejs package that will help you adding ZainCash as a payment method in your website.
This package works with express & jesonwebtoken.

## Installation
Install the zaincash package by running this command:
  ```sh
    $ npm i zaincash
  ```

## Other Packages to install

  - You have to install [express.js](https://expressjs.com/) to have a running server for your website.
  - You also need to install [JWT](https://www.npmjs.com/package/jsonwebtoken).
  - And install [request](https://www.npmjs.com/package/request) library in order to get redirected to ZainCash payment page.

## Quick Start !
- You have to create a route handler that will handle the payment process.
- Require zaincash package inside your app.
- ZainCash package exporting a class so you will have to create a new instance from it
- Call zaincash init function to initialize the payment, this function will return a promise so you will have to handle it.
- init function will return a ZainCash transaction id that you can send as a parameter to pay function in order to get redirected to ZainCash payment page.


plase check the simple code below
```
const express = require('express');
const app = express();
const ZC = require('zaincash');

// preparing payment data
const paymentData = {
  amount: 250,
  orderId: 'some id',
  serviceType: 'some serviceType',
  redirectUrl: 'example.com/redirect',
  production: false,
  msisdn: '964****',
  merchantId: '5a647d843321dcd9cbc771c',
  secret: '$2y$10$9eaqimBisY15ZJZSSvC3Z.Ar1ET1.7Kgm8p7jysY1X.I8.RuwS.',
  lang: 'ar'
}

// payment route handler
app.post('/pay', (req, res) => {
  let zc = new ZC(paymentData);
  x = zc.init().then(transactionId => {
    //  Save the transactionId in your DB
    console.log(transactionId);
    zc.pay(transactionId, res);
  }).catch(err => {
    res.status(400).send(err);
  });
});
//  starting a server
app.listen(3000);
```

## Payment Data
There are some data that you have to get it from ZainCash and there are others that you are free to fill them

| Property | Description |
| ------ | ------ |
| amount | The amount of money that the customer will pay, has to be more than 250 |
| orderId | Any text or number you want to add, usualy this will be your order id from your DB (ZainCash will returned to you once the payment completed)  |
| serviceType | Any text you want to add such as your website name |
| redirectUrl | The url that ZainCash will send the payment information to once the payment completed |
| production | Boolean that will tell the packge to use the test environment or the production one |
| msisdn | The merchant number (your ZainCash wallet number) |
| merchantId | String that ZainCash will provide you with |
| secret | String that ZainCash will provide you with |
| lang | Your website language, ZainCash supports 3 languages 'ar', 'en', 'ku' stands for Arabic, English, and Kurdish |


## What to do more
You will have to create a redirect handler, this will work as an endpoint you will send it to zaincash by setting it to the **redirectUrl** it will be such as 'http://yourhost/redierct'
zaincash will return a token contains the payment status to this endpoint, ie: 'http://yourhost/redierct?token=XXXX'
You will have to decode this JWT token and check the payment status
Check the simple code below:

```
const jwt = require('jsonwebtoken');

//  Handeling the redierct
app.get('redirect', (req, res) => {
  const token = req.body.token;
  if(token){
    try {
      var decoded = jwt.verify(token, process.env.SECRET);
    } catch(err) {
      // err
    }
    if(decoded.status == 'success'){
      // Do whatever you like
    }else {
      //  Do other things
    }
  }
});
```
## Redirect Token Content
The Token will be encoded with the same secret shared by ZainCash, and it will contain:
| Property | Description |
| ------ | ------ |
| status | String that will be equal to 'success' or 'failed' |
| orderId | Any text or number you have added when you initialized the payment  |
| id | ZainCash transaction id, it will be string ie: '58650f0f90c6362288da08cf' |
| iat | TimeStamp of token creation |
| exp | TimeStamp of token expiry |
| msg | In case of failure this will return the reason, ie: 'Invalid credentials for requester' |
