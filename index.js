const express = require('express');
const app = express();
const braintree = require("braintree");
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const strategy = require('./setup-passport');


app.engine('ejs', require('ejs').renderFile);
app.use(cookieParser());
app.use(session({ secret: 'gwpionwoiegnwoin', resave: false,  saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY
});


function requireLogin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login/failed');
  }
  next();
}

app.get('/login/failed', function(req, res){
  res.end('You must login to view this page')
});

app.get('/user', requireLogin, function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    if(err) {
      return res.send(':(, something wrong has happedn. Try again later<br/><br/>Details:<br/>' + JSON.stringify(err));
    }
    res.render('user.ejs', {
      user: req.user.displayName,
      'clientToken': response.clientToken,
      'auth0domain': process.env.AUTH0_DOMAIN
    });
  });
});

app.get('/login/callback',
  passport.authenticate('auth0', { failureRedirect: '/login/failed' }),
    function(req, res)  {
    if (!req.user) {
      return res.end('Unexpected error, try login in again');
    }
    res.redirect("/user");
    }
  );

app.get('/', function(req, res){
    if(req.user) {
      return res.redirect("/user");
    }
    res.render('login.ejs', {
      'auth0domain': process.env.AUTH0_DOMAIN,
      'auth0clientId': process.env.AUTH0_CLIENT_ID,
    });
});

app.get("/client_token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });
});

app.post("/checkout", function (req, res) {
  console.log('body:',req.body);
  const nonce = 'fake-valid-nonce	'; //req.body.payment_method_nonce;

  gateway.transaction.sale({
    amount: '10.00',
    paymentMethodNonce: nonce,
  }, function (err, result) {
    if(err) {
      return res.end('Transaction did not go trough, your card was not charged.' + JSON.stringify(err));
    }
    res.end('Transaction sucessed')
    }
  });
});

app.listen(process.env.PORT || 3000);
console.log('Applicationen har startet på localhost:' + (process.env.PORT || 3000))
