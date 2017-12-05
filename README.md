# IITC plugins

Some IITC plugins developed by our community.

## basemap-mapbox.user.js

Add the MapBox map tiles as an optional layer.

### Install

Install [tampermonkey](http://tampermonkey.net/) at first, then [Click here!](https://github.com/ResistanceCN/iitc-plugins/raw/master/basemap-mapbox.user.js)

### Basic usage

Before you can use this plugin, you must register an account at https://www.mapbox.com to get your own access token.

After added [basemap-mapbox.user.js](basemap-mapbox.user.js) to Tampermonkey, edit it and replace `mapBoxUserName` and `mapBoxAccessToken` with your username and access token of Mapbox.

Every Mapbox accounts have a quota of 50000 requests per month for free. Do not share your token to public, unless you don't mind charging for it.

### Custom map styles

Go to https://www.mapbox.com/studio/ and design your custom map styles. After publishing them, set your style id and layer name in `mapStyles` object.

You can only use styles that accessible with your access token, generally, those owned by your mapbox account.

