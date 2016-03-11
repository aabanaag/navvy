function NavvyCtrl (uiaId, parentDiv, ctrlId, properties) {
  this.id = ctrlId;
  this.parentDiv = parentDiv;
  this.uiaId = uiaId;

  this.properties = {
    isDebug: true,
    map: {
      moveWithGPS: true,
      MIN_ZOOM: 16,
      MAX_ZOOM: 18,
      DEFAULT_ZOOM: 17,
      mapUrl: 'http://www.mapquestapi.com/sdk/leaflet/v2.s/mq-map.js?key=',
      geoUrl: 'http://www.mapquestapi.com/sdk/leaflet/v2.s/mq-geocoding.js?key=',
      routingUrl: 'https://www.mapquestapi.com/sdk/leaflet/v2.s/mq-routing.js?key=',
      osrm_url: 'https://router.project-osrm.org/',
      key: '7sp7uN2HZY7IjMHMlaIwjhIHoGGPao4P'
    },
    networkTest: 'http://mazda-twitter-api.herokuapp.com/ping',
    tiles: 'apps/emnavi/controls/Compass/resources/tiles'
  }

  for (var i in properties) {
    this.properties[i] = properties[i];
  }

  this._initialize = false;

  this._VENDOR = ('opera' in window) ? '0' : 'webkit';

  this._PATH = 'apps/emnavi/controls/Compass/resources/system/';

  this.init();
};

NavvyCtrl.prototype._registerEvents = function () {
  this.events = {
    home: this._home.bind(this),
    search: this._search.bind(this),
    geocode: this._searchLocation.bind(this),
    close: this._closeButtonClicked.bind(this),
    removeRouting: this._removeRouting.bind(this)
  };
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

NavvyCtrl.prototype._loadPlugins = function () {
  //turf library
  var turf = document.createElement('script');
  turf.src = this._PATH + 'js/turf.js';
  document.body.appendChild(turf);

  var animatedMarker = document.createElement('script');
  animatedMarker.src = this._PATH + 'js/AnimatedMarker.js';
  animatedMarker.onload = function (argument) {
    this._marker = this._createMarker(this.currCoords.lat, this.currCoords.lng);
    this._marker.addTo(this._map);
    this._map.panTo(this.currCoords, this._map.getZoom());
  }.bind(this);
  document.body.appendChild(animatedMarker);

  // geocoding
  var geocoding = document.createElement('script');
  geocoding.src = this.properties.map.geoUrl + this.properties.map.key;
  geocoding.onload = function (argument) {
    this.geocode = MQ.geocode();
    this.geocode.on('success', this._geocodeSuccess.bind(this));
  }.bind(this);
  document.body.appendChild(geocoding);

  //routing
  var routing = document.createElement('script');
  routing.src = this.properties.map.routingUrl + this.properties.map.key;
  document.body.appendChild(routing);
};

NavvyCtrl.prototype._createContainer = function () {
  this.ctrlDiv = document.createElement('div');
  this.ctrlDiv.id = this.id;
  this.ctrlDiv.className = 'NavvyCtrl';
  this.parentDiv.appendChild(this.ctrlDiv);

  this.ctrlMap = document.createElement('div');
  this.ctrlMap.id = 'NavvyCtrlMapContainer';
  this.ctrlDiv.appendChild(this.ctrlMap);

  this.routeInstructions = document.createElement('div');
  this.routeInstructions.id = 'navvyCtrlRouteInstructions';
  this.ctrlDiv.appendChild(this.routeInstructions);
};

NavvyCtrl.prototype._createMenus = function () {
  this.homeButton = document.createElement('button');
  this.searchButton = document.createElement('button');
  this.cancelButton = document.createElement('button');

  this.homeButton.type = 'button';
  this.homeButton.id = 'navvyCtrlHomeButton';
  this.homeButton.className = 'mapCtrlButton';
  this.homeButton.addEventListener('click', this.events.home);

  this.searchButton.type = 'button';
  this.searchButton.id = 'navvyCtrlSearchButton';
  this.searchButton.className = 'mapCtrlButton';
  this.searchButton.addEventListener('click', this.events.search);

  this.cancelButton.type = 'button';
  this.cancelButton.id = 'navvyCtrlCancelRouteButton';
  this.cancelButton.className = 'mapCtrlButton';
  this.cancelButton.style.display = 'none';
  this.cancelButton.addEventListener('click', this.events.removeRouting);

  this.ctrlDiv.appendChild(this.homeButton);
  this.ctrlDiv.appendChild(this.searchButton);
  this.ctrlDiv.appendChild(this.cancelButton);
};

NavvyCtrl.prototype._createSearchControl = function () {
  var searchContainer = document.createElement('div');
  searchContainer.id = 'navvyCtrlSearchContainer';
  searchContainer.className = 'navvyCtrlHidden';

  this.closeButton = document.createElement('button');
  this.closeButton.type = 'button';
  this.closeButton.id = 'navvyCtrlSearchClose';
  this.closeButton.addEventListener('click', this.events.close);

  this.searchInput = document.createElement('input');
  this.searchInput.type = 'text';
  this.searchInput.id = 'navvyCtrlSearchInput';
  this.searchInput.value = 'century city mall';
  this.searchInput.placeholder = 'Search';

  this.geocodeAddressButton = document.createElement('button');
  this.geocodeAddressButton.type = 'button';
  this.geocodeAddressButton.id = 'navvyCtrlSearchPlace';
  this.geocodeAddressButton.addEventListener('click', this.events.geocode);

  this.searchList = document.createElement('ul');
  this.searchList.id = 'navvyCtrlSearchList';

  searchContainer.appendChild(this.closeButton);
  searchContainer.appendChild(this.searchInput);
  searchContainer.appendChild(this.geocodeAddressButton);
  searchContainer.appendChild(this.searchList);

  this.ctrlDiv.appendChild(searchContainer);
};

NavvyCtrl.prototype.init = function () {
  if (this._initialized) return;

  this._registerEvents();
  this._loadCSS();
  this._createContainer();
  this._createMenus();
  this._createSearchControl();

  this._loadMap(function () {
    this._createMap(function () {
      this._loadPlugins();
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
  this._mapLayer = this._createLayer();
  this.currCoords = { lat: 14.5688370, lng: 121.0236740 };

  if (this._map) this._map.remove();
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

NavvyCtrl.prototype._createLayer = function () {
  if (this.properties.noConnectivity) {
    return L.tileLayer(this.properties.tiles + '/{z}/{x}/{y}.png');
  } else {
    return MQ.mapLayer();
  }
}

NavvyCtrl.prototype._createPin = function () {
  var imgSrc = 'images/arrow.png';
  return L.icon({
    iconUrl: this._PATH + imgSrc,
    iconSize: [30, 30]
  });
};

NavvyCtrl.prototype._createMarker = function (lat, lng) {
  var latLng = [L.latLng(lat, lng)];

  return L.animatedMarker(latLng, {
    icon: this._createPin(),
    clickable: false,
    draggable: false,
    interval: 1000
  });
};

NavvyCtrl.prototype._updateMarker = function (lat, lng) {
  if (this.polyLineString && this.bearingPoints && this.hasInstructions) {
    if (this._snappedToRoad) {

      var intersect = this._checkPolyIntersect({ lat: lat, lng: lng });

      if (intersect) {
        var distance = this._getDistance(this.currCoords, { lat: lat, lng: lng });
        this.currCoords = {
          lat: lat,
          lng: lng
        }
        this.distanceTraveled += distance;
        var along = turf.along(this.lineString, this.distanceTraveled, 'kilometers');
        var result = {
          "type": "FeatureCollection",
          "features": [this.lineString, along]
        };

        if (this.bearingPoints[this.bearingIndex + 1]) {
          var pointIntersect = this._checkPointIntersect(this.currCoords, this.bearingPoints[this.bearingIndex + 1].point);
          if (pointIntersect) {
            this.bearingIndex += 1;
          }
        }

        var point = result.features[1].geometry.coordinates;
        this._marker.setLatLng({ lat: point[1], lng: point[0] });
        this._marker._icon.style.transform = this._marker._icon.style.transform + 'rotate(' + this.bearingPoints[this.bearingIndex].ang + 'deg)';
        if (this.properties.map.moveWithGPS) this._centerMap(this.currCoords.lat, this.currCoords.lng);
      } else {
        this.currCoords = {
          lat: lat,
          lng: lng
        }

        if (this.recalculateBuffer >= 2) {
          this._removeRouting();
          this._recalculateRoute();
        } else {
          this.recalculateBuffer += 1;
        }

        this._marker.setLatLng(this.currCoords);
        if (this.properties.map.moveWithGPS) this._centerMap(this.currCoords.lat, this.currCoords.lng);
      }
    } else {
      this._getPathBetweenPoints({ lat: lat, lng: lng }, function (e) {
        var coords = L.latLng(this.currCoords.lat, this.currCoords.lng);
        this._marker.setLatLng(coords);
        if (this.properties.map.moveWithGPS) this._centerMap(this.currCoords.lat, this.currCoords.lng);
        this._snappedToRoad = true;
      }.bind(this));
    }
  } else {
    var coords = L.latLng(lat, lng);
    this._marker.setLatLng(coords);
    if (this.properties.map.moveWithGPS) this._centerMap(this.currCoords.lat, this.currCoords.lng);
  }
};
NavvyCtrl.prototype._centerMap = function (lat, lng) {
  var coords = L.latLng(lat, lng);
  this._map.panTo(coords, this._map.getZoom());
};

NavvyCtrl.prototype._showMarker = function (lat, lng) {
  var coords = L.latLng(lat, lng);
  this._marker = this._createMarker(lat, lng);
  this._marker.addTo(this._map);
  if (this.properties.map.moveWithGPS) this._centerMap(lat, lng);
}

NavvyCtrl.prototype.showLocation = function (location) {
  if (location.latlng != null) {
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

NavvyCtrl.prototype._moveMap = function (ev) {
  var offsetX = 1, offsetY = 1;
  switch (ev) {
    case 'up':
      offsetY = 100;
    break;
    case 'down':
      offsetY = -100;
    break;
    case 'left':
      offsetX = 100;
    break;
    case 'right':
      offsetX = -100;
    break;
  }

  this.properties.map.moveWithGPS = false;
  this._offsetCenter(this._map.getCenter(), offsetX, offsetY);
};

NavvyCtrl.prototype._offsetCenter = function (latlng, offsetx, offsety) {
  var latLng = new L.latLng(latlng.lat, latlng.lng);

  if (offsetx && offsety) {
    var targetPoint = this._map.project(latLng, this._map.getZoom()).subtract([offsetx, offsety]),
    targetLatLng = this._map.unproject(targetPoint, this._map.getZoom());

    this._map.panTo(targetLatLng);
  } else {
    this._map.panTo(latLng);
  }
};

NavvyCtrl.prototype._zoomIn = function () {
  var zoom = this._map.getZoom();
  if (zoom <= this.properties.map.MAX_ZOOM) this._map.setZoom(zoom + 1);
};

NavvyCtrl.prototype._zoomOut = function () {
  var zoom = this._map.getZoom();
  if (zoom >= this.properties.map.MIN_ZOOM) this._map.setZoom(zoom - 1);
};

NavvyCtrl.prototype._searchLocation = function () {
  var address = this.searchInput.value + ' philippines';
  this.geocode.search(address);
};

NavvyCtrl.prototype._createSearchResults = function (matches) {
  this.searchList.innerHTML = '';
  for (var i=0; i < matches.length; i++) {
    var area = matches[i];
    var li = document.createElement('li');
    li.innerText = area.adminArea6 + ' ' + area.adminArea5;
    li.data = area;
    li.addEventListener('click', function (e) {
      var target = e.currentTarget;
      var data = target.data;

      this.searchList.innerHTML = '';
      this.searchInput.value = '';

      this._toggleSearchContainer(false);
      this._routeToDestination(data);
    }.bind(this));

    var goToButton = document.createElement('button');
    goToButton.className = 'navvyCtrlGoToDestination';
    goToButton.data = area;
    goToButton.addEventListener('click', function (e) {
      var target = e.currentTarget;
      var data = target.data;

      this.searchList.innerHTML = '';
      this.searchInput.value = '';

      this._toggleSearchContainer(false);
      this._routeToDestination(data);
    }.bind(this));

    li.appendChild(goToButton);
    this.searchList.appendChild(li);
  }
  //this._routeToDestination(matches[0]);
};

NavvyCtrl.prototype._routeToDestination = function (data) {
  this.routeData = data;
  if (this.routingLayer && this.hasInstructions) {
    this._removeRouting();
  }

  var dir = MQ.routing.directions();

  dir.on('success', this._addRouteInstructions.bind(this));

  dir.route({
    locations: [
      { latLng: { lat: this.currCoords.lat, lng: this.currCoords.lng } },
      { latLng: { lat: data.latlng.lat, lng: data.latlng.lng } }
    ]
  });

  this.routingLayer = MQ.routing.routeLayer({
    directions: dir,
    ribbonOptions: {
      draggable: false,
      ribbonDisplay: { color: '#5A9BC3', opacity: 0.9 }
    }
  });

  this._map.addLayer(this.routingLayer);
  this.hasInstructions = true;
};

NavvyCtrl.prototype._addRouteInstructions = function (data) {
  this.recalculateBuffer = 0; //if 2 must recalculate route

  data.route.shape.shapePoints.unshift(this.currCoords);
  var shapePoints = data.route.shape.shapePoints.map(function (obj) {
    return [obj.lng, obj.lat]
  });
  this.routeStart = this.currCoords;
  this.distanceTraveled = 0;
  this.lineString = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "LineString",
      "coordinates": shapePoints
    }
  };

  var container = document.createElement('div');
  container.className = 'navvyCtrlInstructions';

  var legs = data.route.legs,
    html = '',
    maneuvers,
    i;

  if (legs && legs.length) {
    maneuvers = legs[0].maneuvers;
    this.bearingPoints = [];
    this.bearingIndex = 0;

    var bearing = this._getBearing(this.currCoords, maneuvers[0].startPoint);
    this.bearingPoints.push({ ang: bearing });

    for (i=0; i < maneuvers.length; i++) {
      html += '<div><img src="' + maneuvers[i].iconUrl + '" />' + maneuvers[i].narrative + '</div>';
      if (maneuvers[i]) {
        var bearing = undefined;
        if (maneuvers[i+1]) bearing = this._getBearing(maneuvers[i].startPoint, maneuvers[i+1].startPoint);

        this.bearingPoints.push({
          point: maneuvers[i].startPoint,
          ang: bearing
        });
      }
    }

    this._setMapBearing(this.bearingPoints[0].ang);

    container.innerHTML = html;
    this.routeInstructions.appendChild(container);
    //this._offsetCenter(this.currCoords, -100, 0);
    this._toggleSearchOptions();

    var lineString = data.route.shape.shapePoints;
    this.polyLineString = lineString.map(function (obj) {
      return [obj.lat, obj.lng];
    }.bind(this));

  }
};

NavvyCtrl.prototype._recalculateRoute = function () {
  this._routeToDestination(this.routeData);
};

NavvyCtrl.prototype._setMapBearing = function (bearing) {
  this._marker._icon.style.transform = this._marker._icon.style.transform + 'rotate(' + bearing + 'deg)';
};

NavvyCtrl.prototype._getDistance = function (coor1, coor2, unit) {
  unit = unit || 'kilometers';
  var point1 = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": [coor1.lng, coor1.lat]
    }
  };
  var point2 = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": [coor2.lng, coor2.lat]
    }
  };
  var points = {
    "type": "FeatureCollection",
    "features": [point1, point2]
  };
  return turf.distance(point1, point2);
};

NavvyCtrl.prototype._checkPolyIntersect = function (location) {
  var pt = turf.point([location.lng, location.lat]);
  var buff = turf.buffer(this.lineString, 2.5, 'meters');
  var intersection = turf.intersect(buff.features[0].geometry, pt);

  return intersection;
};

NavvyCtrl.prototype._checkPointIntersect = function (pt1, pt2) {
  pt1 = turf.point([pt1.lng, pt1.lat]);
  var buff = turf.buffer(pt1, 2.5, 'meters');
  pt2 = turf.point([pt2.lng, pt2.lat]);
  var intersection = turf.intersect(buff.features[0].geometry, pt2);

  return intersection;
};

NavvyCtrl.prototype._getBearing = function (latLng1, latLng2) {
  var d2r  = L.LatLng.DEG_TO_RAD;
  var r2d  = L.LatLng.RAD_TO_DEG;
  var lat1 = latLng1.lat * d2r;
  var lat2 = latLng2.lat * d2r;
  var dLon = (latLng2.lng-latLng1.lng) * d2r;
  var y    = Math.sin(dLon) * Math.cos(lat2);
  var x    = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
  var brng = Math.atan2(y, x);
  brng = parseInt( brng * r2d );
  brng = (brng + 360) % 360;
  return brng;
};

NavvyCtrl.prototype._getPathBetweenPoints = function (data, callback) {
  var xhr = new XMLHttpRequest();
  var url = this.properties.map.osrm_url + 'nearest?loc=' + data.lat + ',' + data.lng;
  xhr.open('GET',  url, false);
  xhr.onload = function() {
    var status = xhr.status;
    if (status == 200) {
      var response = JSON.parse(xhr.response);
      this.currCoords = {
        lat: response.mapped_coordinate[0],
        lng: response.mapped_coordinate[1]
      }
      callback(response);
    } else {
      console.log(status);
    }
  }.bind(this);
  xhr.onerror = function() {
    var status = xhr.status;
  }
  xhr.send();
};

NavvyCtrl.prototype._toggleSearchOptions = function (argument) {
  if (this.searchButton.style.display == 'none') {
    this.searchButton.style.display = 'block';
    this.cancelButton.style.display = 'none';
  } else {
    this.searchButton.style.display = 'none';
    this.cancelButton.style.display = 'block';
  }
};

NavvyCtrl.prototype._removeRouting = function () {
  this._map.removeLayer(this.routingLayer);
  this.routeInstructions.innerHTML = '';
  this.polyLineString = this.bearingPoints = this.hasInstructions = this.routingLayer = undefined;
  this._toggleSearchOptions();
};

//event functions
NavvyCtrl.prototype._geocodeSuccess = function (res) {
  this._createSearchResults(res.result.matches);
};

NavvyCtrl.prototype._home = function () {
  framework.sendEventToMmui('Common', 'Global.IntentHome');
  // var self = this;
  //
  // var xhr = new XMLHttpRequest();
  // xhr.open('GET', 'file://localhost/home/abetmiclat/Documents/Projects/navvy-online/controls/Map/js/test-data.json', false);
  // xhr.timeout = 30000;
  // xhr.onload = function() {
  //   var status = xhr.status;
  //   if (status == 0) {
  //     var response = JSON.parse(xhr.response);
  //
  //     function geolocate () {
  //       var coordinate = response.shift();
  //       if (!coordinate) return;
  //
  //       var data = {
  //         latlng: {
  //           lat: coordinate.lat,
  //           lng: coordinate.lon
  //         }
  //       }
  //
  //       self.showLocation(data);
  //
  //       setTimeout(function () {
  //         geolocate();
  //       }, 1000);
  //     }
  //
  //     geolocate();
  //
  //   } else {
  //     console.log(status);
  //   }
  // }.bind(this);
  // xhr.onerror = function() {
  //   var status = xhr.status;
  // }
  // xhr.send();
};

NavvyCtrl.prototype._search = function () {
  this._toggleSearchContainer(true);
  this.closeButton.focus();
};

NavvyCtrl.prototype._closeButtonClicked = function () {
  this.searchList.innerHTML = '';
  this.searchInput.value = '';
  this._toggleSearchContainer(false);
};

NavvyCtrl.prototype._toggleSearchContainer = function (isShown) {
  var el = document.getElementById('navvyCtrlSearchContainer');
  var isHidden = (el.className == 'navvyCtrlHidden') ? true : false;

  if (isHidden && isShown) {
    el.className = '';
    this.searchControlHidden = false;
  } else if (!isHidden && !isShown) {
    el.className = 'navvyCtrlHidden';
    this.searchControlHidden = true;
  }
};
//end

NavvyCtrl.prototype.handleControllerEvent = function (e) {
  switch (e) {
    case 'select':

      break;
    case 'up':
    case 'left':
    case 'right':
    case 'down':
      this._moveMap(e);
      break;
    case 'cw':
      this._zoomIn();
      break;
    case 'ccw':
      this._zoomOut();
      break;
  }
};

NavvyCtrl.prototype.cleanUp = function () {
  this.homeButton.removeEventListener('click', this.events.home);
  this.searchButton.removeEventListener('click', this.events.search);
  this._map = null;
  this._marker = null;
};
