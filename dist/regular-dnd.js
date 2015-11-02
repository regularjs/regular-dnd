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

	var _utilJs = __webpack_require__(2);

	var _utilJs2 = _interopRequireDefault(_utilJs);

	exports['default'] = {
	  Dragable: _DragableJs2['default'],
	  Dropable: _DropableJs2['default'],
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
	  _util2['default'].once(document, 'mouseup', onmouseup);
	  dom.on(document, 'mousemove', onmousemove);
	  manager.moved = false;
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

	    if (manager.drop !== drop) {

	      if (test) {

	        drop.$emit('dragenter', { drag: drag, drop: drop });

	        if (manager.drop) {
	          manager.drop.$emit('dragleave', { drag: drag, drop: drop });
	        }
	        manager.drop = drop;
	        return;
	      }
	    } else if (!test) {

	      drop.$emit('dragleave', { drag: drag, drop: drop });
	      manager.drop = null;
	    }
	  }
	}

	function onmousemove(ev) {
	  if (!manager.drag) return;
	  ev.preventDefault();
	  var placeholder = manager.drag.placeholder;

	  var startAt = manager.startAt;

	  var drag = manager.drag;
	  var data = drag.data;

	  if (!manager.moved) {

	    if (data.placeholder !== false) {
	      placeholder = drag.placeholder = drag.getPlaceholder(drag.node, drag.data);

	      if (placeholder) {

	        placeholder.style.display = 'none';
	        placeholder.style.zIndex = 1000;
	        dom.inject(placeholder, document.body);
	      }
	    }
	    manager.drag.$emit('dragstart', startAt);
	    manager.moved = true;
	  }

	  if (window.getSelection) {
	    window.getSelection().removeAllRanges();
	  } else if (window.document.selection) {
	    window.document.selection.empty();
	  }

	  if (placeholder) {
	    var style = placeholder.style;
	    style.position = 'absolute';
	    style.display = '';
	    style.left = ev.pageX - startAt.left + 'px';
	    style.top = ev.pageY - startAt.top + 'px';
	  }
	  manager.testDrop(ev.pageX, ev.pageY);
	  var drop = manager.drop;

	  manager.drag.$emit('dragmove', {
	    drag: drag,
	    drop: drop,
	    position: {
	      left: ev.pageX,
	      top: ev.pageY
	    }
	  });

	  if (drop) {
	    drop.$emit('dragmove', {
	      drop: drop,
	      drag: drag,
	      position: {
	        left: ev.pageX - drop.offset.left,
	        top: ev.pageY - drop.offset.top
	      }
	    });
	  }
	}

	function onmouseup(ev) {
	  var drag = manager.drag;

	  dom.off(document, 'mousemove', onmousemove);

	  if (!manager.moved) return;
	  if (drag) {
	    var drop = manager.drop;
	    drag.$emit('dragend', {
	      drop: drop,
	      drag: drag,
	      position: {
	        left: ev.pageX,
	        top: ev.pageY
	      }
	    });
	    if (drop) {
	      drop.$emit('dragdrop', {
	        drag: drag,
	        drop: drop,
	        position: {
	          left: ev.pageX - drop.offset.left,
	          top: ev.pageY - drop.offset.top
	        }
	      });
	    }
	    manager.drop = null;
	    manager.drag = null;
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
	  if (!list) return -1;
	  for (var i = 0, len = list.length; i < len; i++) {
	    if (list[i] === item) {
	      list.splice(i, 1);
	      return i;
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

	function isInRect(position, dim) {
	  if (!position || !dim) return false;

	  return position.left > dim.left && position.left < dim.left + dim.width && position.top > dim.top && position.top < dim.top + dim.height;
	}

	function getInRanges(offset, ranges) {

	  for (var len = ranges.length; len--;) {
	    var rg = ranges[len];

	    if (isInRect(offset, rg)) {

	      return {
	        index: len,
	        dimension: {
	          width: rg.width,
	          height: rg.height,
	          left: offset.left - rg.left,
	          top: offset.top - rg.top
	        }
	      };
	    }
	  }
	}

	function getDirection() {}

	exports['default'] = {

	  getPosition: getPosition,
	  getOffset: getOffset,
	  getDimension: getDimension,

	  isInRect: isInRect,
	  getInRanges: getInRanges,
	  getDirection: getDirection,

	  remove: remove,

	  extend: extend,

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

	  config: function config(data) {

	    var $outer = this.$outer;
	    if (!($outer instanceof _Dropable2['default'])) return;

	    this.drop = $outer;

	    $outer.$emit('add_drag', this);
	  },

	  init: function init() {
	    var data = this.data;
	    var node = this.node = dom.element(this);

	    dom.addClass(node, 'dragable');

	    var body = undefined;

	    this.$on('dragend', function () {
	      if (!this.placeholder) return;
	      dom.remove(this.placeholder);
	      this.placeholder = null;
	    });

	    var handle = this.handle = data.handle && node.querySelector(data.handle) || node;

	    dom.on(handle, 'mousedown', (function (ev) {

	      // disabled right-click
	      if (ev.which !== 1) return;

	      var pos = _util2['default'].getPosition(node);

	      _manager2['default'].bindDrag(this, { left: ev.pageX - pos.left, top: ev.pageY - pos.top });
	    }).bind(this));
	  },
	  getPlaceholder: function getPlaceholder(node, key) {
	    return node.cloneNode(true);
	  }

	});

	_Dropable2['default'].Handler = _regularjs2['default'].extend({
	  template: '{#inc this.$body}',
	  config: function config() {
	    if (this.$outer instanceof _Dropable2['default']) {
	      this.$outer.data.header = this;
	    }
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
	    _manager2['default'].addDrop(data.name, this);
	  },

	  init: function init(data) {
	    this.node = _regularjs2['default'].dom.element(this);
	  },

	  destroy: function destroy() {
	    _manager2['default'].delDrop(this.data.name, this);
	    this.supr();
	  }

	});

	exports['default'] = Dropable;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;