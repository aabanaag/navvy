function NavvyCtrl (uiaId, parentDiv, ctrlId) {
  this.id = ctrlId;
  this.parentDiv = parentDiv;
  this.uiaId = uiaId;

  this.properties = {
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

  this._PATH = 'apps/emnavi/controls/Compass/resources/';

  this.init();
};

NavvyCtrl.prototype._loadCSS = function () {
  var mainCSS = document.createElement('link');
  mainCSS.type = 'text/css';
  mainCSS.rel = 'stylesheet';
  mainCSS.href = this._PATH + 'system/css/NavvyCtrl.css';
  document.body.appendChild(mainCSS);

  var ltCSS = document.createElement('link');
  ltCSS.type = 'text/css';
  ltCSS.rel = 'stylesheet';
  ltCSS.href = this._PATH + 'system/css/leaflet.css';
  document.body.appendChild(ltCSS);
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

  this._loadCSS();
  this._createContainer();

  this._loadMap(function () {
    this._createMap();

    this._marker = this._createMarker(this.currCoords.lat, this.currCoords.lng);
    this._marker.addTo(this._map);
  }.bind(this));

  this._initialized = true;
};

NavvyCtrl.prototype._loadMap = function (cb) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = this._PATH + 'system/js/leaflet.js';
  script.onload = function () {};

  var mq = document.createElement('script');
  mq.type = 'text/javascript';
  mq.src = this.properties.map.mapUrl + this.properties.map.key;
  mq.onload = function () { cb(); };

  document.body.appendChild(script);
  document.body.appendChild(mq);
};

NavvyCtrl.prototype._createMap = function () {
  this._mapLayer = MQ.mapLayer();
  this.currCoords = { lat: 14.5688370, lng: 121.0236740 };

  this._map = L.map('NavvyCtrlMapContainer', {
    layers: this._mapLayer,
    attributionControl: false,
    zoomControl: false,
    center: [this.currCoords.lat, this.currCoords.lng],
    zoom: this.properties.map.DEFAULT_ZOOM,
    minZoom: this.properties.map.MIN_ZOOM,
    maxZoom: this.properties.map.MAX_ZOOM
  });
};

NavvyCtrl.prototype._createPin = function () {
  var imgSrc = 'system/images/arrow.png';
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

NavvyCtrl.prototype.handleControllerEvent = function () {};
NavvyCtrl.prototype.cleanUp = function () {};
