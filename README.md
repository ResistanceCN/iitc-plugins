# IITC plugins

Some IITC plugins developed by our community.

---

**All plugins need to be pre-installed with tampermonkey and iitc.**

- Tampermonkey: [Download](https://tampermonkey.net/)

    You can also install the extension from your browser store.

- IITC: [Download](https://iitc.me)

    Google Play: [IITC Mobile (Community Edition)](https://play.google.com/store/apps/details?id=org.exarhteam.iitc_mobile) | [IITC Mobile](https://play.google.com/store/apps/details?id=com.cradle.iitc_mobile)

    Itunes: [iitc-mobile](https://itunes.apple.com/us/app/iitc-mobile/id1032695947)

---

## Map Tiles

### 1. basemap-china

    Add the normally map service in China as an optional layer, such as Amap, QQ Map, Google Map(China).

- Install

    [**Download Here**](https://github.com/ResistanceCN/iitc-plugins/raw/master/basemap-china.user.js)

- Basic usage

    Install the plugin then choose the layer from iitc. For the mobile user, you need to download the plugins at first. And then click the plus button on the iitc plugins page to load the unofficial plugins as files.

### 2. basemap-mapbox

    Add the MapBox map tiles as an optional layer.

- Install

    [**Download Here**](https://github.com/ResistanceCN/iitc-plugins/raw/master/basemap-mapbox.user.js)

- Basic usage

    Before you can use this plugin, you must register an account at [MapBox](https://www.mapbox.com) to get your own access token.

    After added [basemap-mapbox.user.js](basemap-mapbox.user.js) to Tampermonkey, edit it and replace `mapBoxUserName` and `mapBoxAccessToken` with your username and access token of Mapbox.

    Every Mapbox accounts have a quota of 50000 requests per month for free. Do not share your token to public, unless you don't mind charging for it.

- Custom map styles

    Go to [MapBox](https://www.mapbox.com/studio/) and design your custom map styles. After publishing them, set your style id and layer name in `mapStyles` object.

    You can only use styles that accessible with your access token, generally, those owned by your mapbox account.

---

## Info

### 1. polygon-portals2json

    Modified from iitc-portalsinpolygons and the portals list can be formatted as json to export.

> [iitc-portalsinpolygons](https://github.com/hayeswise/iitc-portalsinpolygons):
> IITC plugin for displaying a list of portals in polygons and circles, and their perimeter, and on lines. 

- Install

    Install and enable the [portal-list](https://static.iitc.me/build/release/plugins/portals-list.user.js), official plugins.

    [**Download Here**](https://raw.githubusercontent.com/ResistanceCN/iitc-plugins/master/polygon-portals2json.js).

- Basic usage

    Draw a polygon on the map and then use `Output as Json` to obtain a json style string.

## Tweaks

### 1. force-refresh

    Reload portal and link information.

- Install
  
    [**Download Here**](https://github.com/ResistanceCN/iitc-plugins/raw/master/force-refresh.user.js)

- Basic usage

    Click the refresh button.
