/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./gesture-demo.js":
/*!*************************!*\
  !*** ./gesture-demo.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _gesture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gesture */ \"./gesture.js\");\n\n(0,_gesture__WEBPACK_IMPORTED_MODULE_0__.enableGesture)(document.documentElement);\ndocument.documentElement.addEventListener(\"tap\", function () {\n  console.log(\"tap event trigger!\");\n});\n\n//# sourceURL=webpack://carousel/./gesture-demo.js?");

/***/ }),

/***/ "./gesture.js":
/*!********************!*\
  !*** ./gesture.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"dispatch\": () => /* binding */ dispatch,\n/* harmony export */   \"Listener\": () => /* binding */ Listener,\n/* harmony export */   \"Recognizer\": () => /* binding */ Recognizer,\n/* harmony export */   \"enableGesture\": () => /* binding */ enableGesture\n/* harmony export */ });\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it[\"return\"] != null) it[\"return\"](); } finally { if (didErr) throw err; } } }; }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction dispatch(type, properties) {\n  var event = new Event(type);\n\n  for (var name in properties) {\n    event[name] = properties[name];\n  }\n\n  element.dispatchEvent(event);\n}\nvar Listener = function Listener(element, recognizer) {\n  _classCallCheck(this, Listener);\n\n  var isListeningMouse = false;\n  var contexts = new Map();\n  element.addEventListener(\"mousedown\", function (event) {\n    var context = Object.create(null);\n    contexts.set(\"mouse \".concat(1 << event.button), context);\n    recognizer.start(event, context);\n\n    var mousemove = function mousemove(event) {\n      var button = 1;\n\n      while (button <= event.buttons) {\n        if (button & event.buttons) {\n          var key = void 0;\n\n          if (button === 2) {\n            key = 4;\n          } else if (button === 4) {\n            key = 2;\n          } else {\n            key = button;\n          }\n\n          var _context = contexts.get(\"mouse \".concat(key));\n\n          recognizer.move(event, _context);\n        }\n\n        button <<= 1;\n      }\n    };\n\n    var mouseup = function mouseup(event) {\n      var mouseKey = \"mouse \".concat(1 << event.button);\n      var context = contexts.get(mouseKey);\n      recognizer.end(event, context);\n      contexts[\"delete\"](mouseKey);\n\n      if (event.buttons === 0) {\n        document.removeEventListener(\"mousemove\", mousemove);\n        document.removeEventListener(\"mouseup\", mouseup);\n        isListeningMouse = false;\n      }\n    };\n\n    if (!isListeningMouse) {\n      document.addEventListener(\"mousemove\", mousemove);\n      document.addEventListener(\"mouseup\", mouseup);\n      isListeningMouse = true;\n    }\n  });\n  element.addEventListener(\"touchstart\", function (event) {\n    var _iterator = _createForOfIteratorHelper(event.changedTouches),\n        _step;\n\n    try {\n      for (_iterator.s(); !(_step = _iterator.n()).done;) {\n        var touch = _step.value;\n        var context = Object.create(null);\n        contexts.set(touch.identifier, context);\n        recognizer.start(touch, context);\n      }\n    } catch (err) {\n      _iterator.e(err);\n    } finally {\n      _iterator.f();\n    }\n  });\n  element.addEventListener(\"touchmove\", function (event) {\n    var _iterator2 = _createForOfIteratorHelper(event.changedTouches),\n        _step2;\n\n    try {\n      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {\n        var touch = _step2.value;\n        var context = contexts.get(touch.identifier);\n        recognizer.move(touch, context);\n      }\n    } catch (err) {\n      _iterator2.e(err);\n    } finally {\n      _iterator2.f();\n    }\n  });\n  element.addEventListener(\"touchend\", function (event) {\n    var _iterator3 = _createForOfIteratorHelper(event.changedTouches),\n        _step3;\n\n    try {\n      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {\n        var touch = _step3.value;\n        var context = contexts.get(touch.identifier);\n        recognizer.end(touch, context);\n        contexts[\"delete\"](touch.identifier);\n      }\n    } catch (err) {\n      _iterator3.e(err);\n    } finally {\n      _iterator3.f();\n    }\n  });\n  element.addEventListener(\"touchcancel\", function (event) {\n    var _iterator4 = _createForOfIteratorHelper(event.changedTouches),\n        _step4;\n\n    try {\n      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {\n        var touch = _step4.value;\n        var context = contexts.get(touch.identifier);\n        recognizer.cancel(touch, context);\n        contexts[\"delete\"](touch.identifier);\n      }\n    } catch (err) {\n      _iterator4.e(err);\n    } finally {\n      _iterator4.f();\n    }\n  });\n};\nvar Recognizer = /*#__PURE__*/function () {\n  function Recognizer(dispatch) {\n    _classCallCheck(this, Recognizer);\n\n    this.dispatch = dispatch;\n  }\n\n  _createClass(Recognizer, [{\n    key: \"start\",\n    value: function start(point, context) {\n      var _this = this;\n\n      context.startX = point.clientX, context.startY = point.clientY;\n      context.points = [{\n        t: Date.now(),\n        x: point.clientX,\n        y: point.clientY\n      }];\n      context.isTap = true, context.isPan = false, context.isPress = false;\n      context.handler = setTimeout(function () {\n        context.isTap = false, context.isPan = false, context.isPress = true;\n        context.handler = null;\n\n        _this.dispatch(\"press\", {});\n      }, 500);\n    }\n  }, {\n    key: \"move\",\n    value: function move(point, context) {\n      var dx = point.clientX - context.startX,\n          dy = point.clientY - context.startY;\n\n      if (!context.isPan && dx * dx + dy * dy > 100) {\n        context.isTap = false, context.isPan = true, context.isPress = false;\n        context.isVertical = Math.abs(dx) < Math.abs(dy);\n        this.dispatch(\"panstart\", {\n          startX: context.startX,\n          startY: context.startY,\n          clientX: point.clientX,\n          clientY: point.clientY,\n          isVertical: context.isVertical\n        });\n        clearTimeout(context.handler);\n      }\n\n      if (context.isPan) {\n        this.dispatch(\"pan\", {\n          startX: context.startX,\n          startY: context.startY,\n          clientX: point.clientX,\n          clientY: point.clientY,\n          isVertical: context.isVertical\n        });\n      }\n\n      context.points = context.points.filter(function (p) {\n        return Date.now() - p.t < 500;\n      });\n      context.points.push({\n        t: Date.now(),\n        x: point.clientX,\n        y: point.clientY\n      });\n    }\n  }, {\n    key: \"end\",\n    value: function end(point, context) {\n      if (context.isTap) {\n        this.dispatch(\"tap\", {});\n        clearTimeout(context.handler);\n      }\n\n      if (context.isPress) {\n        this.dispatch(\"pressend\", {});\n      }\n\n      context.points = context.points.filter(function (p) {\n        return Date.now() - p.t < 500;\n      });\n      var isFlick = false,\n          v = 0;\n\n      if (context.points.length > 0) {\n        var dx = point.clientX - context.points[0].x;\n        var dy = point.clientY - context.points[0].y;\n        var dis = Math.sqrt(dx * dx + dy * dy);\n        v = dis / (Date.now() - context.points[0].t);\n\n        if (v > 1.5) {\n          isFlick = true;\n        }\n      }\n\n      if (context.isPan) {\n        this.dispatch(\"panend\", {\n          startX: context.startX,\n          startY: context.startY,\n          clientX: point.clientX,\n          clientY: point.clientY,\n          isVertical: context.isVertical,\n          isFlick: isFlick,\n          velocity: v\n        });\n      }\n    }\n  }, {\n    key: \"cancel\",\n    value: function cancel(point, context) {\n      clearTimeout(context.handler);\n      this.dispatch(\"cancel\", {});\n    }\n  }]);\n\n  return Recognizer;\n}();\nfunction enableGesture(element) {\n  new Listener(element, new Recognizer(dispatch));\n}\n\n//# sourceURL=webpack://carousel/./gesture.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./gesture-demo.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;