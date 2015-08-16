/**
@author	leeluolee
@version	0.1.0
@homepage	https://github.com/regularjs/regular-dnd
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Regular"));
	else if(typeof define === 'function' && define.amd)
		define(["Regular"], factory);
	else if(typeof exports === 'object')
		exports["ReDnd"] = factory(require("Regular"));
	else
		root["ReDnd"] = factory(root["Regular"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _managerJs = __webpack_require__(1);

	var _managerJs2 = _interopRequireDefault(_managerJs);

	var _DragableJs = __webpack_require__(4);

	var _DragableJs2 = _interopRequireDefault(_DragableJs);

	var _DropableJs = __webpack_require__(5);

	var _DropableJs2 = _interopRequireDefault(_DropableJs);

	var _DropListJs = __webpack_require__(6);

	var _DropListJs2 = _interopRequireDefault(_DropListJs);

	var _utilJs = __webpack_require__(2);

	var _utilJs2 = _interopRequireDefault(_utilJs);

	exports['default'] = {
	  Dragable: _DragableJs2['default'],
	  Dropable: _DropableJs2['default'],
	  DropList: _DropListJs2['default'],
	  manager: _managerJs2['default'],
	  util: _utilJs2['default']
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _util = __webpack_require__(2);

	var _util2 = _interopRequireDefault(_util);

	var _regularjs = __webpack_require__(3);

	var _regularjs2 = _interopRequireDefault(_regularjs);

	var drops = {};
	var dom = _regularjs2['default'].dom;

	function bindDrag(dragable, position) {
	  manager.drag = dragable;
	  manager.startAt = position;
	  _util2['default'].once(document.body, 'mouseup', onmouseup);
	  dom.on(document.body, 'mousemove', onmousemove);
	}

	function addDrop(name, component) {
	  drops[name] = component;
	}

	function delDrop(name) {
	  delete drops[name];
	}

	function testDrop(pageX, pageY) {
	  var drag = manager.drag;
	  var target = drag.data.target || [];
	  for (var i in drops) {
	    var drop = drops[i];
	    if (target.indexOf(drop.data.name) === -1) continue;
	    var offset = drop.offset = _util2['default'].getDimension(drop.node);
	    var test = offset.left < pageX && pageX < offset.width + offset.left && offset.top < pageY && pageY < offset.height + offset.top;

	    if (!drop.data.entered) {

	      if (test) {

	        drop.data.entered = drag;
	        drop.$emit('dragenter', { drag: drag, drop: drop });
	        manager.drop = drop;
	        return;
	      }
	    } else if (!test) {
	      drop.data.entered = null;
	      drop.$emit('dragleave', { drag: drag, drop: drop });
	      manager.drop = null;
	    }
	  }
	}

	function onmousemove(ev) {
	  if (!manager.drag) return;
	  var placeholder = manager.drag.placeholder;
	  var style = placeholder.style;
	  var startAt = manager.startAt;

	  // if (window.getSelection) {
	  //    window.getSelection().removeAllRanges();
	  // } else if (window.document.selection) {
	  //    window.document.selection.empty();
	  // }

	  style.position = 'absolute';
	  style.display = '';
	  style.left = ev.pageX - startAt.left + 'px';
	  style.top = ev.pageY - startAt.top + 'px';
	  manager.testDrop(ev.pageX, ev.pageY);
	  var drop = manager.drop;

	  if (drop) {
	    drop.$emit('dragmove', {
	      left: ev.pageX,
	      top: ev.pageX
	    });
	  }
	}

	function onmouseup(ev) {
	  var node = manager.drag;

	  dom.off(document.body, 'mousemove', onmousemove);
	  if (node) {
	    node.$emit('dragend');
	    var _drops = manager.drops;
	    manager.drag = null;
	    for (var i in _drops) {
	      var drop = _drops[i];
	      var entered = drop.data.entered;
	      drop.$update('entered', null);
	      if (entered) {
	        drop.$emit('dragdrop', entered);
	      }
	    }
	  }
	}

	var manager = {

	  drops: drops,
	  addDrop: addDrop,
	  delDrop: delDrop,
	  testDrop: testDrop,

	  bindDrag: bindDrag,

	  onmousemove: onmousemove,
	  onmouseup: onmouseup
	};

	exports['default'] = manager;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * util for regular-dnd
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _regularjs = __webpack_require__(3);

	var _regularjs2 = _interopRequireDefault(_regularjs);

	var win = window;
	var extend = _regularjs2['default'].util.extend;
	var dom = _regularjs2['default'].dom;

	function getPosition(elem) {
	  var doc = elem && elem.ownerDocument,
	      docElem = doc.documentElement,
	      body = doc.body,
	      box = elem.getBoundingClientRect ? elem.getBoundingClientRect() : { top: 0, left: 0 },
	      clientTop = docElem.clientTop || body.clientTop || 0,
	      clientLeft = docElem.clientLeft || body.clientLeft || 0,
	      scrollTop = win.pageYOffset || docElem.scrollTop,
	      scrollLeft = win.pageXOffset || docElem.scrollLeft;

	  return {
	    top: box.top + scrollTop - clientTop,
	    left: box.left + scrollLeft - clientLeft
	  };
	}

	function getOffset(elem) {

	  var width = elem.offsetWidth;
	  var height = elem.offsetHeight;

	  return { width: width, height: height };
	}

	function getDimension(elem) {

	  return extend(getOffset(elem), getPosition(elem));
	}

	function remove(list, item) {
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var i = _step.value;

	      if (list[i] === item) {
	        list.splice(i);
	        return i;
	      }
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator['return']) {
	        _iterator['return']();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  return -1;
	}

	function once(elem, ev, handle) {
	  function real() {
	    handle.apply(this, arguments);dom.off(elem, ev, real);
	  }
	  dom.on(elem, ev, real);
	}

	exports['default'] = {

	  getPosition: getPosition,
	  getOffset: getOffset,
	  getDimension: getDimension,

	  remove: remove,

	  once: once
	};
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _manager = __webpack_require__(1);

	var _manager2 = _interopRequireDefault(_manager);

	var _regularjs = __webpack_require__(3);

	var _regularjs2 = _interopRequireDefault(_regularjs);

	var _Dropable = __webpack_require__(5);

	var _Dropable2 = _interopRequireDefault(_Dropable);

	var _util = __webpack_require__(2);

	var _util2 = _interopRequireDefault(_util);

	var dom = _regularjs2['default'].dom;

	var Dragable = _regularjs2['default'].extend({

	  name: 'dragable',

	  template: '{#include this.$body}',

	  config: function config() {
	    var _this = this;

	    var $outer = this.$outer;
	    if (!($outer instanceof _Dropable2['default'])) return;

	    var drags = $outer.data.drags;
	    drags.push(this);

	    this.$on('$destroy', function () {
	      return _util2['default'].remove(drags, _this);
	    });
	  },

	  init: function init() {
	    var data = this.data;
	    var handle = this.handle = this.$getNode();

	    var body = undefined;

	    this.$on('dragend', function () {
	      dom.remove(this.placeholder);
	      this.placeholder = null;
	    });

	    dom.on(handle, 'mousedown', (function (ev) {
	      var placeholder = this.placeholder = handle.cloneNode(true);
	      var pos = _util2['default'].getPosition(handle);
	      dom.inject(placeholder, document.body);
	      placeholder.style.display = 'none';
	      _manager2['default'].bindDrag(this, { left: ev.pageX - pos.left, top: ev.pageY - pos.top });
	    }).bind(this));
	  },

	  getOffset: function getOffset() {
	    return _util2['default'].getOffset(this.handle);
	  }
	});

	exports['default'] = Dragable;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _manager = __webpack_require__(1);

	var _manager2 = _interopRequireDefault(_manager);

	var _regularjs = __webpack_require__(3);

	var _regularjs2 = _interopRequireDefault(_regularjs);

	var _util = __webpack_require__(2);

	var _util2 = _interopRequireDefault(_util);

	var Dropable = _regularjs2['default'].extend({
	  name: 'dropable',

	  template: '\n  <div class=\'{klass} dropable\'>{#inc this.$body}</div>\n  ',

	  config: function config(data) {
	    this.data.drags = this.data.drags || [];
	    _manager2['default'].addDrop(data.name, this);
	  },

	  init: function init(data) {
	    this.node = this.$getNode();
	  },

	  destroy: function destroy() {
	    _manager2['default'].delDrop(this.data.name, this);
	    this.supr();
	  }

	});

	exports['default'] = Dropable;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _Dropable = __webpack_require__(5);

	var _Dropable2 = _interopRequireDefault(_Dropable);

	var DropList = _Dropable2['default'].extend({

	  name: 'droplist',

	  init: function init() {
	    this.supr();
	    var data = this.data;
	    var offsets = [];

	    this.$on('dragenter', function () {
	      var drags = data.drags;
	      drags.forEach(function (drag) {
	        offsets.push(drag.getOffset());
	      });
	    });

	    this.$on('dragleave', function () {});

	    this.$on('dragmove', function (arg) {});
	  }
	});

/***/ }
/******/ ])
});
;