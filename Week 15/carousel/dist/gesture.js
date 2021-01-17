/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/*!********************!*\
  !*** ./gesture.js ***!
  \********************/
eval("var element = document.documentElement;\nelement.addEventListener(\"mousedown\", function (event) {\n  var mousemove = function mousemove(event) {\n    console.log(event.clientX, event.clientY);\n  };\n\n  var mouseup = function mouseup(event) {\n    document.removeEventListener(\"mousemove\", mousemove);\n    document.removeEventListener(\"mouseup\", mouseup);\n  };\n\n  document.addEventListener(\"mousemove\", mousemove);\n  document.addEventListener(\"mouseup\", mouseup);\n});\n\n//# sourceURL=webpack://carousel/./gesture.js?");
/******/ })()
;