auth0-braintree-payment
============================

A simple demo app that integrates auth0 and braintree, so that you easily  can get a user to login and pay
a
### What does this app do
`/` - shows a button with login.
When you click this button a login modal from auth0 is shown. When you login,
it automatically creates a user in braintree, and redirects you to `/user`.

`/user` - is only accessible for logged in user. Here you get a dropin form from braintree.
The token passed from the server is "registered" to the user, so you can see which user payed
on the braintree website.  




### Installation and configuration

You need to create an [auth0 account](https://auth0.com) and a [braintree account](https://braintreepayments.com).

Then you need to set these environment variables before you start the app.
```
BT_MERCHANT_ID="<see braintree website>"
BT_PUBLIC_KEY="<see braintree website>"
BT_PRIVATE_KEY="<see braintree website>"
AUTH0_DOMAIN="<see auth0 website>"
AUTH0_CLIENT_ID="<see auth0 website>"
AUTH0_SECRET_KEY="<see auth0 website>"
AUTH0_META_TOKEN="<see auth0 website>"
SECRET="random-string-uniq-and-secret-for-your-app"
```

AUTH0_META_TOKEN is a token for the api with the following premissions (or scope as auth0 calls it):
```
create:users_app_metadata
update:users_app_metadata
read:users_app_metadata
```

for more infomation see [api docs](https://auth0.com/docs/api/v2)

the app can then be started by running `npm start`.


The callback is hardcoded to be setup to be `http://localhost:3000/login/callback`.
So you can verify that it work localy.

### Design

This app is just a minmalistic demo app, you can use this as your baseline for creating a app with login and payment easily.

### Other providers:

If you want to integrate with facebook, github, google or similar
this is done trough auth0's website. See more on their website.


### TODO:
 * if the user signsup with the username-password-authentication from auth0 it do provide good infomation to braintree about the user that bought it.
 You still have a connection userId -> customerId, but it's not human friendly, you need to login to both places to find the link the accounts.
