function NavvyCtrl (uiaId, parentDiv, ctrlId) {
  this.id = ctrlId;
  this.parentDiv = parentDiv;
  this.uiaId = uiaId;

  this.properties = {
    isDebug: true,
    map: {
      MIN_ZOOM: 16,
      MAX_ZOOM: 18,
      DEFAULT_ZOOM: 17,
      mapUrl: 'http://www.mapquestapi.com/sdk/leaflet/v2.s/mq-map.js?key=',
      key: '7sp7uN2HZY7IjMHMlaIwjhIHoGGPao4P'
    }
  }

  this._initialize = false;

  this._VENDOR = ('opera' in window) ? '0' : 'webkit';

  this._PATH = 'apps/emnavi/controls/Compass/resources/system/';

  this.init();
};

NavvyCtrl.prototype._loadCSS = function () {
  var mainCSS = document.createElement('link');
  mainCSS.type = 'text/css';
  mainCSS.rel = 'stylesheet';
  mainCSS.href = this._PATH + 'css/NavvyCtrl.css';
  this.parentDiv.appendChild(mainCSS);

  var ltCSS = document.createElement('link');
  ltCSS.type = 'text/css';
  ltCSS.rel = 'stylesheet';
  ltCSS.href = this._PATH + 'css/leaflet.css';
  this.parentDiv.appendChild(ltCSS);
};

NavvyCtrl.prototype._createContainer = function () {
  this.ctrlDiv = document.createElement('div');
  this.ctrlDiv.id = this.id;
  this.ctrlDiv.className = 'NavvyCtrl';
  this.parentDiv.appendChild(this.ctrlDiv);

  this.ctrlMap = document.createElement('div');
  this.ctrlMap.id = 'NavvyCtrlMapContainer';
  this.ctrlDiv.appendChild(this.ctrlMap);
};

NavvyCtrl.prototype.init = function () {
  if (this._initialize) return;

  this._createContainer();
  this._loadCSS();

  this._loadMap(function () {
    this._createMap(function () {
      this._checkLocation(this.currCoords.lat, this.currCoords.lng);
      this._showMarker(this.currCoords.lat, this.currCoords.lng);
    }.bind(this));

  }.bind(this));

  this._initialized = true;
};

NavvyCtrl.prototype._loadMap = function (cb) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = this._PATH + 'js/leaflet.js';
  script.onload = function () {};

  var mq = document.createElement('script');
  mq.type = 'text/javascript';
  mq.src = this.properties.map.mapUrl + this.properties.map.key;
  mq.onload = function () { cb(); };

  this.parentDiv.appendChild(script);
  this.parentDiv.appendChild(mq);
};

NavvyCtrl.prototype._createMap = function (cb) {
  this._mapLayer = MQ.mapLayer();
  this.currCoords = { lat: 14.5688370, lng: 121.0236740 };

  this._map = L.map('NavvyCtrlMapContainer', {
    layers: this._mapLayer,
    attributionControl: false,
    zoomControl: false,
    center: [14.5833, 121.0000],
    zoom: this.properties.map.DEFAULT_ZOOM,
    minZoom: this.properties.map.MIN_ZOOM,
    maxZoom: this.properties.map.MAX_ZOOM
  });

  this._map.on('load', cb());
};

NavvyCtrl.prototype._createPin = function () {
  var imgSrc = 'images/arrow.png';
  return L.icon({
    iconUrl: this._PATH + imgSrc,
    iconSize: [30, 30]
  });
};

NavvyCtrl.prototype._createMarker = function (lat, lng) {
  var latLng = [L.latLng(lat, lng)];

  return L.marker([lat, lng], {
    icon: this._createPin(),
    clickable: false,
    draggable: false,
    interval: 1200
  });
};

NavvyCtrl.prototype._updateMarker = function (lat, lng) {
  var coords = L.latLng(lat, lng);
  this._marker.setLatLng(coords);
  this._map.panTo(coords, this._map.getZoom());
};

NavvyCtrl.prototype._showMarker = function (lat, lng) {
  var coords = L.latLng(lat, lng);
  this._marker = this._createMarker(lat, lng);
  this._marker.addTo(this._map);
  this._map.panTo(coords, this._map.getZoom());
}

NavvyCtrl.prototype.showLocation = function (location) {
  if (location.latlng != null) {
    //this._checkLocation(location.latlng.lat, location.latlng.lng);

    if (!this._marker) this._showMarker(location.latlng.lat, location.latlng.lng);
    else this._updateMarker(location.latlng.lat, location.latlng.lng);
  }
};

NavvyCtrl.prototype._checkLocation = function (lat, lng) {
  var el = document.getElementById('tempDebug');

  if (el) el.innerHTML = 'lat: '+lat+' lng: '+lng;
  else {
    var tempDebug = document.createElement('span');
    tempDebug.id = 'tempDebug';
    tempDebug.style = 'position:absolute; left: 10px; top:10px; color:red;';
    tempDebug.innerHTML = 'lat: '+lat+' lng: '+lng;

    this.ctrlDiv.appendChild(tempDebug);
  }
};

NavvyCtrl.prototype.handleControllerEvent = function (e) {

};

NavvyCtrl.prototype.cleanUp = function () {};
