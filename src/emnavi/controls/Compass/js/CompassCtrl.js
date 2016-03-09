log.addSrcFile('CompassCtrl.js', 'common');

function CompassCtrl (uiaId, parentDiv, ctrlId, properties) {
  this.ctrlId = ctrlId;
  this.parentDiv = parentDiv;
  this.uiaId = uiaId;
  this.navvyDisplayed = false;
  this.navvyInitialized = false;
  this.navvyCtrl = false;

  this.properties = {
    _navvyDir: 'apps/emnavi/controls/Compass/resources/system/js/NavvyCtrl.js'
  };

  setTimeout(function () {
    this.loadNavvy();
  }.bind(this), 500);
};

CompassCtrl.prototype.loadNavvy = function () {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = this.properties._navvyDir;

  script.onload = function () {
    this.loadSystem();
  }.bind(this);

  document.body.appendChild(script);
};

CompassCtrl.prototype.loadSystem = function () {
  if (typeof(NavvyCtrl) != 'undefined') {
    if (this.navvyDisplayed) this.parentDiv.removeChild(this.ctrlDiv);

    this.navvyCtrl = new NavvyCtrl(this.uiaId, this.parentDiv, this.ctrlId);

    this.navvyInitialized = true;
  }
};

CompassCtrl.prototype.cleanUp = function () {
  if (!this.navvyDisplayed) return;
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
