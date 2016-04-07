/**
 * Project: CompassCtrl
 * Description: Customized CompassCtrl for NavvyCtrl support
 * Date Created: 2016-03-11
 * Created by: WunderkindTech Solutions
 * Version: 0.03
**/

log.addSrcFile('CompassCtrl.js', 'common');

function CompassCtrl (uiaId, parentDiv, ctrlId, properties) {
  this.ctrlId = ctrlId;
  this.parentDiv = parentDiv;
  this.uiaId = uiaId;
  this.navvyDisplayed = false;
  this.navvyInitialized = false;
  this.navvyCtrl = false;

  this.retryCount = 0;
  this.maxRetry = 10;
  this.retryTimeout = 30 * 1000;

  this.properties = {
    _navvyDir: 'apps/emnavi/controls/Compass/resources/system/js/NavvyCtrl.js',
    _networkTest: 'http://mazda-twitter-api.herokuapp.com/ping'
  };

  this.loadNavvy();
  //this.renderNoNavvy();
};

CompassCtrl.prototype.loadNavvy = function () {
  var _reloadNavvy = function () {
    this.renderNoNavvy();
    this.retryCount++;

    if (this.retryCount > this.maxRetry) {
      this.ctrlLabel.innerHTML = 'Invalid SD Card';
    } else {
      setTimeout(function () {
        this.loadNavvy();
      }.bind(this), this.retryTimeout);
    }
  }.bind(this);

  try {
    var startTimeout = setTimeout(function () {
      _reloadNavvy();
    }, 800);

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = this.properties._navvyDir;

    script.onload = function () {
      clearTimeout(startTimeout);
      //this.loadSystem(true);
      this.checkConnectivity();
    }.bind(this);

    this.parentDiv.appendChild(script);
  } catch (e) {
    _reloadNavvy();
  }

};

CompassCtrl.prototype.loadSystem = function (hasNoConnectivity) {
  if (typeof(NavvyCtrl) != 'undefined') {
    if (this.navvyDisplayed) this.parentDiv.removeChild(this.ctrlDiv);

    this.navvyCtrl = new NavvyCtrl(this.uiaId, this.parentDiv, this.ctrlId, {
      noConnectivity: hasNoConnectivity
    });

    this.navvyInitialized = true;
  }
};

CompassCtrl.prototype.renderNoNavvy = function () {
  if(this.navvyInitialized) return;

   // Container element
  this.ctrlDiv = document.createElement('div');
  this.ctrlDiv.className = 'CompassCtrl CompassCtrlNoNavvy';
  this.parentDiv.appendChild(this.ctrlDiv);

  // create map
  this.ctrlLabel = document.createElement('label');
  this.ctrlDiv.appendChild(this.ctrlLabel);
  this.ctrlLabel.innerHTML = "Insert SD Card";
};

CompassCtrl.prototype.renderNoConnectivity = function () {
  if (this.navvyInitialized) return;

  this.ctrlDiv = document.createElement('div');
  this.ctrlDiv.className = 'CompassCtrl CompassCtrlNoConnectivity';
  this.parentDiv.appendChild(this.ctrlDiv);

  this.ctrlLabel = document.createElement('div');
  this.ctrlDiv.appendChild(this.ctrlLabel);
  this.ctrlLabel.innerHTML = 'No Internet Connection';
};

CompassCtrl.prototype.checkConnectivity = function () {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.properties._networkTest, true);
  try {
    xhr.send();
    xhr.onload = function (res) {
      if (res.currentTarget.readyState == 4 && res.currentTarget.status >= 200 && res.currentTarget.status < 304) {
        //this.parentDiv.removeChild(this.ctrlDiv);
        this.loadSystem(false);
      } else this.loadSystem(true);
    }.bind(this);
    xhr.onerror = function () {
      this.loadSystem(true);
    }.bind(this);
  } catch (e) {
    this.loadSystem(true);
  }
};

CompassCtrl.prototype.setLocationData = function (location) {
  if (!this.navvyInitialized) return;

  this.navvyCtrl.showLocation(location);
};

CompassCtrl.prototype.cleanUp = function () {
  if (!this.navvyInitialized) return;
  this.navvyCtrl.cleanUp();
};

CompassCtrl.prototype.setLatitude = function (latValue) {};
CompassCtrl.prototype.setLatitudeId = function (latValue, latSubMap) {};
CompassCtrl.prototype.setLongitude = function (lonValue) {};
CompassCtrl.prototype.setLongitudeId = function (lonValue, lonSubMap) {};
CompassCtrl.prototype.setElevation = function (eleValue) {};
CompassCtrl.prototype.setElevationId = function (eleValue, eleSubMap) {};
CompassCtrl.prototype.setAditionalText = function (additionalText) {};
CompassCtrl.prototype.setAditionalTextId = function (additionalTextId) {};


CompassCtrl.prototype.handleControllerEvent = function (e) {
  if (!this.navvyInitialized) return 'ignored';

  this.navvyCtrl.handleControllerEvent(e);
};

framework.registerCtrlLoaded('CompassCtrl');
