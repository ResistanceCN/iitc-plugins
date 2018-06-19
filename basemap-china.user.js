// ==UserScript==
// @id             iitc-plugin-basemap-china@balthild
// @name           IITC plugin: Map tiles from Chinese providers
// @category       Map Tiles
// @version        0.1
// @description    Add map tiles from Chinese providers as optional layers.
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
  // ensure plugin framework is there, even if iitc is not yet loaded
  if (typeof window.plugin !== 'function') window.plugin = function() {};


  // PLUGIN START ////////////////////////////////////////////////////////

  function loadScript(url) {
    return new Promise(function(resolve, reject) {
      var script = document.createElement("script");
      script.onload = resolve;
      script.onerror = reject;
      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script);
    });
  }

  // https://github.com/wandergis/coordtransform/blob/master/index.js
  var PI = Math.PI;
  var x_PI = PI * 3000.0 / 180.0;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;

  function out_of_china(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    // 纬度3.86~53.55,经度73.66~135.05 
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
  };

  function transformlat(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret
  };

  function transformlng(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret
  };
  
  function gcj02towgs84(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    if (out_of_china(lng, lat)) {
      return [lng, lat]
    } else {
      var dlat = transformlat(lng - 105.0, lat - 35.0);
      var dlng = transformlng(lng - 105.0, lat - 35.0);
      var radlat = lat / 180.0 * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;
      return [lng * 2 - mglng, lat * 2 - mglat]
    }
  };

  L.GCJ02TileLayer = L.TileLayer.extend({
    _getTilePos: function(tilePoint) {
      var origin = this._map.getPixelOrigin();
      var tileSize = this._getTileSize();

      var point = this._map._getCenterLayerPoint();
      var latLng = this._map.layerPointToLatLng(point);
      var wgs84 = gcj02towgs84(latLng.lng, latLng.lat);
      var wgs84Point = this._map.latLngToLayerPoint(new L.LatLng(wgs84[1], wgs84[0]));

      return tilePoint.multiplyBy(tileSize).subtract(origin).subtract(point.subtract(wgs84Point));
    },

    _update: function() {
      if (!this._map) {
        return;
      }

      var bounds = this._map.getPixelBounds();
      var zoom = this._map.getZoom();
      var tileSize = this._getTileSize();

      if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
        return;
      }

      var point = this._map._getCenterLayerPoint();
      var latLng = this._map.layerPointToLatLng(point);
      var wgs84 = gcj02towgs84(latLng.lng, latLng.lat);
      var wgs84Point = this._map.latLngToLayerPoint(new L.LatLng(wgs84[1], wgs84[0]));

      var bounds = L.bounds(
        bounds.min.subtract(wgs84Point.subtract(point)),
        bounds.max.subtract(wgs84Point.subtract(point))
      );

      var tileBounds = L.bounds(
        bounds.min.divideBy(tileSize)._floor(),
        bounds.max.divideBy(tileSize)._floor()
      );

      this._addTilesFromCenterOut(tileBounds);

      if (this.options.unloadInvisibleTiles || this.options.reuseTiles) {
        this._removeOtherTiles(tileBounds);
      }
    }
  });

  L.TencentLayer = L.GCJ02TileLayer.extend({
    options: {
      subdomains: '012',
    },

    initialize: function(options) {
      L.Util.setOptions(this, options);
    },

    getTileUrl: function(tilePoint) {
      var url = "http://rt{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0";

      var urlArgs = {
        z: tilePoint.z,
        x: tilePoint.x,
        y: Math.pow(2, tilePoint.z) - 1 - tilePoint.y
      };

      return L.Util.template(url, L.extend(urlArgs, this.options, {
        s: this._getSubdomain(tilePoint)
      }));
    }
  });

  // use own namespace for plugin
  window.plugin.mapTileChina = {};
  window.plugin.mapTileChina.addLayer = function() {
    var ratio = window.devicePixelRatio < 1.5 ? '' : '2';

    var gcn = new L.GCJ02TileLayer('https://{s}.google.cn/maps/vt?lyrs=m@189&gl=cn&scale=2&x={x}&y={y}&z={z}', {
      subdomains: ['www', 'mt0', 'mt1', 'mt2', 'mt3'],
      attribution: 'Map data © Google Maps',
      maxNativeZoom: 18,
      maxZoom: 21,
    });
    layerChooser.addBaseLayer(gcn, 'Google 地图 (中国)');

    var amap = new L.GCJ02TileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scl=2&style=8&x={x}&y={y}&z={z}', {
      subdomains: '1234',
      attribution: 'Map data © 高德地图',
      maxNativeZoom: 18,
      maxZoom: 21,
    });
    layerChooser.addBaseLayer(amap, '高德地图');

    var tencent = new L.TencentLayer({
      attribution: 'Map data © 腾讯地图',
      maxNativeZoom: 18,
      maxZoom: 21,
    });
    layerChooser.addBaseLayer(tencent, '腾讯地图');
  };

  var setup = window.plugin.mapTileChina.addLayer;
  // PLUGIN END //////////////////////////////////////////////////////////


  setup.info = plugin_info; //add the script info data to the function as a property
  if (!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);
  // if IITC has already booted, immediately run the 'setup' function
  if (window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end

// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = {
  version: GM_info.script.version,
  name: GM_info.script.name,
  description: GM_info.script.description
};
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);
