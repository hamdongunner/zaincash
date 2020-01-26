const jwt = require("jsonwebtoken");
const request = require("request");

class Zaincash {
  constructor({
    amount,
    orderId,
    serviceType,
    redirectUrl,
    production,
    msisdn,
    merchantId,
    secret,
    lang
  }) {
    this.amount = amount;
    this.serviceType = serviceType;
    this.redirectUrl = redirectUrl;
    this.msisdn = msisdn;
    this.merchantId = merchantId;
    this.secret = secret;
    this.lang = lang;
    this.time = Date.now();
    if (production) {
      this.initUrl = "https://api.zaincash.iq/transaction/init";
      this.requestUrl = "https://api.zaincash.iq/transaction/pay?id=";
    } else {
      this.initUrl = "https://test.zaincash.iq/transaction/init";
      this.requestUrl = "https://test.zaincash.iq/transaction/pay?id=";
    }
  }

  init() {
    const data = {
      amount: this.amount,
      serviceType: this.serviceType,
      msisdn: this.msisdn,
      orderId: this.orderId,
      redirectUrl: this.redirectUrl,
      iat: this.time,
      exp: this.time + 60 * 60 * 4
    };

    const token = jwt.sign(data, this.secret);

    const postData = {
      token: token,
      merchantId: this.merchantId,
      lang: this.lang
    };

    const requestOptions = {
      uri: this.initUrl,
      body: JSON.stringify(postData),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    };
    return new Promise(function(resolve, reject) {
      request(requestOptions, function(error, response) {
        if (error) reject(error);
        if (response && response.body && JSON.parse(response.body).id)
          resolve(JSON.parse(response.body).id);
        reject(response.body);
      });
    });
  }

  pay(transactionId, res) {
    res.writeHead(302, {
      Location: this.requestUrl + transactionId
    });
    res.end();
  }
}

module.exports = Zaincash;
