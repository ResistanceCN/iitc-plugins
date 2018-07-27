// ==UserScript==
// @id             iitc-plugin-basemap-mapbox@balthild
// @name           IITC plugin: MapBox map tiles
// @category       Map Tiles
// @version        0.1
// @description    Add the MapBox map tiles as an optional layer.
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

  // Access token can be applied for free at https://www.mapbox.com/maps/
  var mapBoxUserName = 'xxxx';
  var mapBoxAccessToken = 'pk.XXXXXXXX';

  // see https://www.mapbox.com/api-documentation/?language=cURL#styles
  var mapStyles = {
    // '[style id]': 'Layer Name',
    // 'cjas1sv4s09qt2smz1nyf3wok': 'MapBox Scenic',
    // 'cjas7e263j04l2rquka2eoyar': 'MapBox Bright',
  };

  // see https://www.mapbox.com/api-documentation/?language=cURL#maps
  var mapIDs = {
    // '[map id]': 'Layer Name',
    'mapbox.streets': 'MapBox Streets',
    'mapbox.light': 'MapBox Light',
    'mapbox.dark': 'MapBox Dark',
  };

  // use own namespace for plugin
  window.plugin.mapTileMapBox = {
    addLayer: function() {
      var osmOpt = {
        attribution: 'Map data © MapBox',
        maxNativeZoom: 18,
        maxZoom: 21,
      };

      var layers = {};

      var ratio = window.devicePixelRatio < 2 ? '' : '@2x';

      for (var style in mapStyles) {
        layers['https://api.mapbox.com/styles/v1/' + mapBoxUserName + '/' + style + '/tiles/256/{z}/{x}/{y}' + ratio + '?access_token=' + mapBoxAccessToken] = mapStyles[style];
      }

      for (var id in mapIDs) {
        layers['https://api.mapbox.com/v4/' + id + '/{z}/{x}/{y}' + ratio + '.png?access_token=' + mapBoxAccessToken] = mapIDs[id];
      }

      for (var url in layers) {
        var layer = new L.TileLayer(url, osmOpt);
        layerChooser.addBaseLayer(layer, layers[url]);
      }
    },
  };

  var setup = window.plugin.mapTileMapBox.addLayer;

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
