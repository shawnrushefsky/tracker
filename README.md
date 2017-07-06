# tracker

This is an app for tracking container shipments. Currently it only supports pilship, but could be trivially extended to support additional shipping lines. [See it running live.](http://45.33.111.238/)

It uses a basic Node/Express server for the API, and Ember.js for the frontend.

To build:

```shell
git clone https://github.com/shawnrushefsky/tracker.git
cd tracker
npm install
ember build
sudo node server
```
