const express = require("express");
const app = express();
const request = require("request");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.all("/api/payments", (req, res, next) => {
  console.log("########################################");
  console.log(req.body);
  console.log("########################################");
  axios({
    method: "post",
    url: "https://checkout-test.adyen.com/v49/payments",
    auth: {
      username: process.env.USERNAME, //configurable
      password: process.env.PASSWORD //configurable
    },
    data: {
      merchantAccount: "Shernaz", //configurable
      reference: "Sherry iDEAL test",
      amount: req.body.amount,
      paymentMethod: req.body.paymentMethod,
      returnUrl: "https://your-company.com/..."
    }
  })
    .then(({ data }) => {
      return res.json(data);
    })
    .catch(error => {
      console.log(error);
    });
});

app.all("/api/test", (req, res, next) => {
    return res.send("Hello World");
});

app.all("/api/paymentMethods", (req, res, next) => {
  console.log("******************************************");
  console.log("body", req.body);
  console.log("******************************************");
  axios({
    method: "post",
    url: "https://checkout-test.adyen.com/v49/paymentMethods",
    auth: {
      username: process.env.USERNAME, //configurable
      password: process.env.PASSWORD //configurable
    },
    data: {
      merchantAccount: "Shernaz" //configurable
    }
  })
    .then(({ data }) => {
      data.originKey = process.env.ORIGINKEY;
      return res.json(data);
    })
    .catch(error => {
      console.log(error);
    });
});

// proxy requests for front end to client app
app.use("/", function(req, res) {
  request("http://localhost:8081" + req.path)
    .on("error", err =>
      res.send("client not started yet, try refreshing in a few seconds")
    )
    .pipe(res);
});


// start server
const port = 8080;
app.listen(port, () => console.log("Server listening on port " + port));
