auth0-braintree-payment
============================

A simple demo app that integrates auth0 and braintree, so that you easily  can get a user to login and pay


### Installation and configuration

You need to create an [auth0 account](https://auth0.com) and a [braintree account](https://braintreepayments.com).

Then you need to set these environment variables before
```
BT_MERCHANT_ID="<see braintree website>"
BT_PUBLIC_KEY="<see braintree website>"
BT_PRIVATE_KEY="<see braintree website>"
AUTH0_DOMAIN="<see auth0 website>"
AUTH0_CLIENT_ID="<see auth0 website>"
```

The callback is hardcoded to be setup to be `http://localhost:3000/login/callback`.
So you can verify that it work.

### Design

This app is just a minmalistic demo app, you can use this as your baseline for creating a app with login and payment easily.

### Other providers:

If you want to integrate with facebook, github, google or similar
this is done trough auth0's website. See more on their website.


### TODO:
 * not hardcode the callback url
 * create a user in braintree based on the auth0 user.
 * store the braintree user id in auth0 app_metadata.
 * Display what the user has bough in braintree.
