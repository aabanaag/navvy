function KeyboardCtrl (options) {
  this._registerEvents();

  this.parentEl = options.el;

  this.mainEl = document.createElement('div');
  this.mainEl.setAttribute('style', 'display: none;');

  this.keyboardCtrl = document.createElement('div');
  this.keyboardCtrl.className = 'KeyboardCtrl KeyboardCtrl_custom';

  this.mainEl.appendChild(this.keyboardCtrl);

  this._createInputControls();
  this._createVars();
  this._createControls();
  this._bindControlEvents();

  this.parentEl.appendChild(this.mainEl);

  this._bindListener();
};

KeyboardCtrl.prototype._registerEvents = function () {
  this.events = {
    focus: this._onFocus.bind(this),
    keypress: this._onKeypress.bind(this)
  }
}

KeyboardCtrl.prototype._bindListener = function () {
  this.parentEl.addEventListener('click', this.events.focus);
};

KeyboardCtrl.prototype._onFocus = function (ev) {
  var target = ev.target;
  if (target.tagName == 'INPUT' || target.hasAttribute('contenteditable')) {
    this.inSpan.innerHTML = target.value;
    this.activeInput = target;
    this.show();
  }
}

KeyboardCtrl.prototype._properties = {
  vars: {
    symbols: [
      ['1','2','3','4','5','6','7','8','9','0','+','='],
      ['/','.',',','\'','-','(',')','?','!','\\','|','&quot;'],
      ['*','@','&amp;','#','_','$','€','{','}','[',']'],
      ['<','>','~','`','%','^','-',':',';']
    ],
    letters: [
      ['q','w','e','r','t','y','u','i','o','p'],
      ['a','s','d','f','g','h','j','k','l'],
      ['z','x','c','v','b','n','m']
    ],
    lettersCaps: [
      ['Q','W','E','R','T','Y','U','I','O','P'],
      ['A','S','D','F','G','H','J','K','L'],
      ['Z','X','C','V','B','N','M']
    ]
  },
  shift: false,
  symbols: false
};

KeyboardCtrl.prototype.show = function () {
  this.mainEl.removeAttribute('style');
};

KeyboardCtrl.prototype.hide = function () {
  this.mainEl.setAttribute('style', 'display: none;');
};

KeyboardCtrl.prototype._createVars = function () {
  this.varContainer = document.createElement('div');
  this.varContainer.className = 'btnWrapper fiveTen';

  var _var = this._properties.vars;

  for (var key in _var) {
    this._createKeys(_var[key], key);
  }

  this.keyboardCtrl.appendChild(this.varContainer);
};

KeyboardCtrl.prototype._createKeys = function (data, type) {
  var layout = document.createElement('div');
  layout.className = 'layout';
  if (type != 'letters') {
    layout.setAttribute('style', 'display: none;');
  }

  for (var i=0; i < data.length; i++) {
    var keys = data[i],
      row = document.createElement('div');
    row.className = 'row';

    for (var iKey=0; iKey < keys.length; iKey++) {
      var key = document.createElement('div');
      key.className = 'btn';
      key.setAttribute('data-enabled', true);
      key.setAttribute('data-value', keys[iKey]);
      key.innerHTML = keys[iKey];
      row.appendChild(key);
    }

    layout.appendChild(row);
  }

  this.varContainer.appendChild(layout);
};

KeyboardCtrl.prototype._createInputControls = function () {
  var inputDiv = document.createElement('div');
  inputDiv.className = 'inputDiv fiveTen';
  inputDiv.id = 'textDiv';
  inputDiv.setAttribute('data-value', 'input');
  inputDiv.setAttribute('data-enabled', true);

  this.inSpan = document.createElement('div');
  this.inSpan.id = 'inSpan';
  this.inSpan.className = 'inputSpan';
  this.inSpan.setAttribute('data-value', 'textSpan');
  this.inSpan.setAttribute('style', 'left: 26px;');

  var coverLeft = document.createElement('div');
  coverLeft.id = 'coverLeft';
  coverLeft.className = 'inputFade';
  coverLeft.setAttribute('data-value', 'fade');

  var fadeLeft = document.createElement('div');
  fadeLeft.id = 'fadeLeft';
  fadeLeft.className = 'inputFade';
  fadeLeft.setAttribute('data-value', 'fade');

  var coverRight = document.createElement('div');
  coverRight.id = 'coverRight';
  coverRight.className = 'inputFade';
  coverRight.setAttribute('data-value', 'fade');

  var fadeRight = document.createElement('div');
  fadeRight.id = 'fadeRight';
  fadeRight.className = 'inputFade';
  fadeRight.setAttribute('data-value', 'fade');

  var inputBoxTouchActiveArea = document.createElement('div');
  inputBoxTouchActiveArea.className = 'inputBoxTouchActiveArea';

  inputDiv.appendChild(this.inSpan);
  inputDiv.appendChild(coverLeft);
  inputDiv.appendChild(fadeLeft);
  inputDiv.appendChild(coverRight);
  inputDiv.appendChild(fadeRight);

  this.keyboardCtrl.appendChild(inputDiv);
  this.keyboardCtrl.appendChild(inputBoxTouchActiveArea);
};

KeyboardCtrl.prototype._createControls = function () {
  var controlsWrapper = document.createElement('div');
  controlsWrapper.className = 'controlsWrapper';

  var btnShift = document.createElement('div');
  btnShift.id = 'btnShift';
  btnShift.className = 'btn';
  btnShift.setAttribute('data-value', 'shift');this.parentEl.removeEventListener('click', this._onFocus);
  this.varContainer.removeEventListener('click', this._onKeypress);
  btnShift.setAttribute('data-enabled', true);

  var btnCancel = document.createElement('div');
  btnCancel.id = 'btnCancel';
  btnCancel.className = 'btn';
  btnCancel.setAttribute('data-value', 'cancel');
  btnCancel.setAttribute('data-enabled', true);

  var btnGlobe = document.createElement('div');
  btnGlobe.id = 'btnGlobe';
  btnGlobe.className = 'btn disabled';
  btnGlobe.setAttribute('data-value', 'globe');
  btnGlobe.setAttribute('data-enabled', true);

  var btnLayoutSwitch = document.createElement('div');
  btnLayoutSwitch.innerText = '123';
  btnLayoutSwitch.id = 'btnLayoutSwitch';
  btnLayoutSwitch.className = 'btn';
  btnLayoutSwitch.setAttribute('data-value', 'layout');
  btnLayoutSwitch.setAttribute('data-enabled', true);

  var btnSpacebar = document.createElement('div');
  btnSpacebar.id = 'btnSpacebar';
  btnSpacebar.className = 'btn';
  btnSpacebar.setAttribute('data-value', 'space');
  btnSpacebar.setAttribute('data-enabled', true);

  var btnOK = document.createElement('div');
  btnOK.id = 'btnOK';
  btnOK.className = 'btn';
  btnOK.setAttribute('data-value', 'accept');
  btnOK.setAttribute('data-enabled', false);

  var ButtonCtrl12 = document.createElement('div');
  ButtonCtrl12.id = 'ButtonCtrl12';
  ButtonCtrl12.className = 'KeyboardCtrlDeleteBtn_En KeyboardCtrlDeleteBtn_Fs';
  var ButtonCtrlIcon = document.createElement('div');
  ButtonCtrlIcon.className = 'ButtonCtrlIcon btn-custom';
  ButtonCtrlIcon.setAttribute('data-value', 'delete');
  ButtonCtrlIcon.id = 'deleteCustom';
  ButtonCtrlIcon.setAttribute('style', 'background-image: url("../images/keyboard/Icn_Delete.png")');
  ButtonCtrl12.appendChild(ButtonCtrlIcon);

  controlsWrapper.appendChild(btnShift);
  controlsWrapper.appendChild(btnCancel);
  controlsWrapper.appendChild(btnGlobe);
  controlsWrapper.appendChild(btnLayoutSwitch);
  controlsWrapper.appendChild(btnSpacebar);
  controlsWrapper.appendChild(btnOK);
  controlsWrapper.appendChild(ButtonCtrl12);

  this.varContainer.appendChild(controlsWrapper);
};

KeyboardCtrl.prototype._removeFocusedButtons = function () {
  if (this.varContainer.querySelector('.focused')) {
    this.varContainer.querySelector('.focused').classList.remove('focused');
  }
};

//keyboard events
KeyboardCtrl.prototype._bindControlEvents = function () {
  this.varContainer.addEventListener('click', this.events.keypress);
};

KeyboardCtrl.prototype._onKeypress = function (ev) {
  var target = ev.target;
  var value = target.getAttribute('data-value');
  if ((target.classList.contains('btn-custom') || target.classList.contains('btn')) && !target.classList.contains('disabled')) {
    this._removeFocusedButtons();
    target.classList.add('focused');
    if (target.id) {
      this['_' + value](ev);
    } else {
      this.inSpan.innerHTML = this.inSpan.innerText + value;
    }
  }
};

KeyboardCtrl.prototype._shift = function (ev) {
  var layers = this.varContainer.querySelectorAll('.layout');
  this._properties.symbols = false;

  if (this.varContainer.classList.contains('sixTwelve')) {
    this.varContainer.classList.add('fiveTen');
    this.varContainer.classList.remove('sixTwelve');
  }

  if (this._properties.shift) {
    layers[0].setAttribute('style', 'display: none;');
    layers[2].setAttribute('style', 'display: none;');
    layers[1].removeAttribute('style');
    ev.target.classList.remove('focused');
  } else {
    layers[0].setAttribute('style', 'display: none;');
    layers[1].setAttribute('style', 'display: none;');
    layers[2].removeAttribute('style');
  }
  this._properties.shift = !this._properties.shift;
};

KeyboardCtrl.prototype._cancel = function (argument) {
  this.inSpan.innerHTML = '';
  this.hide();
};

KeyboardCtrl.prototype._space = function (argument) {
  this.inSpan.innerHTML = this.inSpan.innerText + ' ';
};

KeyboardCtrl.prototype._layout = function (ev) {
  var layers = this.varContainer.querySelectorAll('.layout');
  this._properties.shift = false;

  if (this._properties.symbols) {
    layers[0].setAttribute('style', 'display: none;');
    layers[2].setAttribute('style', 'display: none;');
    layers[1].removeAttribute('style');
    ev.target.innerText = '123';
    ev.target.classList.remove('focused');

    this.varContainer.classList.add('fiveTen');
    this.varContainer.classList.remove('sixTwelve');
  } else {
    layers[1].setAttribute('style', 'display: none;');
    layers[2].setAttribute('style', 'display: none;');
    layers[0].removeAttribute('style');
    ev.target.innerText = 'abc';

    this.varContainer.classList.remove('fiveTen');
    this.varContainer.classList.add('sixTwelve');
  }
  this._properties.symbols = !this._properties.symbols;
};

KeyboardCtrl.prototype._accept = function () {
  if (this.activeInput) {this.parentEl.removeEventListener('click', this._onFocus);
  this.varContainer.removeEventListener('click', this._onKeypress);
    this.activeInput.value = this.inSpan.innerHTML;
    this.hide();
  }
};

KeyboardCtrl.prototype._delete = function () {
  var str = this.inSpan.innerHTML;
  str = str.substring(0, str.length - 1);
  this.inSpan.innerHTML = str;
};

KeyboardCtrl.prototype.cleanup = function () {
  this.parentEl.removeEventListener('click', this.events.focus);
  this.varContainer.removeEventListener('click', this.events.keypress);
};
