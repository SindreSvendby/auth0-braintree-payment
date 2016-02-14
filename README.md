auth0-braintree-payment
============================

A simple demo app that integrates auth0 and braintree, so that you easily  can get a user to login and pay
a
### What does this app do
`/` - shows a button with login.
When you click this button a login modal from auth0 is shown. When you login,
it automatically creates a user in braintree, and redirects you to `/user`.

`/user` - is only accessible for logged in user. Here you get a dropin form from




### Installation and configuration

You need to create an [auth0 account](https://auth0.com) and a [braintree account](https://braintreepayments.com).

Then you need to set these environment constiables before
```
BT_MERCHANT_ID="<see braintree website>"
BT_PUBLIC_KEY="<see braintree website>"
BT_PRIVATE_KEY="<see braintree website>"
AUTH0_DOMAIN="<see auth0 website>"
AUTH0_CLIENT_ID="<see auth0 website>"
AUTH0_SECRET_KEY="<see auth0 website>"
AUTH0_META_TOKEN="<see auth0 website>"
```

AUTH0_META_TOKEN is a token for the api with the following premissions (or scope as auth0 calls it):
```
create:users_app_metadata
update:users_app_metadata
read:users_app_metadata
```

for more infomation see [api docs](https://auth0.com/docs/api/v2)

The callback is hardcoded to be setup to be `http://localhost:3000/login/callback`.
So you can verify that it work.

### Design

This app is just a minmalistic demo app, you can use this as your baseline for creating a app with login and payment easily.

### Other providers:

If you want to integrate with facebook, github, google or similar
this is done trough auth0's website. See more on their website.


### TODO:
 * figure out a way to not hardcode the callback url
 * verify that this work for user created by other providers then facebook.
