/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(10)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
module.exports = __webpack_require__(132);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_js__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__routesIndex_js__ = __webpack_require__(25);
__webpack_require__(5);
//window.VueRouter = require('vue-router').default;
//import VueRouter from 'vue-router';



Vue.use(VueRouter);
Vue.mixin(__WEBPACK_IMPORTED_MODULE_0__util_js__["a" /* default */]);

var router = new VueRouter({
	mode: 'history',
	linkActiveClass: 'active',
	routes: __WEBPACK_IMPORTED_MODULE_1__routesIndex_js__["a" /* default */]
});

var app = new Vue({
	router: router
}).$mount('#app');

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// window.$ = window.jQuery = require('jquery'); //Library for dom Manipulation


//require('bootstrap-sass'); //Bootstrap for design


// Axios - Ajax Library
//window.axios = require('axios'); 
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// window.Vue = require('vue'); // JS Framework


// require('bootstrap-notify'); //Notify


// require('jquery-form'); //Alternative to Axios


__webpack_require__(6); // My components

//Pie Chart for Vote Result
// require('jquery-flot');
// require('../../../node_modules/jquery-flot/jquery.flot.pie.js');


//Date and Time Management
// window.moment = require('moment');

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

//Global Components
Vue.component('modal', __webpack_require__(7));
Vue.component('modal-header', __webpack_require__(13));
Vue.component('modal-body', __webpack_require__(15));
Vue.component('modal-footer', __webpack_require__(17));

Vue.component('uploader', __webpack_require__(19));

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(8)
}
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(11)
/* template */
var __vue_template__ = __webpack_require__(12)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/mycomponents/modal/modal.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6c48dfd6", Component.options)
  } else {
    hotAPI.reload("data-v-6c48dfd6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("b9f9d436", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6c48dfd6\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./modal.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6c48dfd6\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./modal.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.primary{\r\n\tbackground-color: #337ab7;\r\n\tcolor: #fff;\n}\n.primary .modal-body{\r\n\tbackground-color: #fff;\r\n\tborder-left: solid 1px #337ab7;\r\n\tborder-right: solid 1px #337ab7;\r\n\tcolor: #000;\n}\n.primary .modal-footer{\r\n\tbackground-color: #fff;\r\n\tborder-radius: 5px;\r\n\tborder-left: solid 1px #337ab7;\r\n\tborder-right: solid 1px #337ab7;\r\n\tborder-bottom: solid 1px #337ab7;\r\n\tcolor: #000;\n}\r\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['id', 'aClass']
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "modal fade", attrs: { id: _vm.id, role: "dialog" } },
    [
      _c("div", { staticClass: "modal-dialog" }, [
        _c(
          "div",
          { staticClass: "modal-content", class: _vm.aClass },
          [_vm._t("default")],
          2
        )
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6c48dfd6", module.exports)
  }
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(14)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/mycomponents/modal/header.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4035af55", Component.options)
  } else {
    hotAPI.reload("data-v-4035af55", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "modal-header" }, [
    _c(
      "button",
      {
        staticClass: "close",
        attrs: { type: "button", "data-dismiss": "modal" }
      },
      [_vm._v("×")]
    ),
    _vm._v(" "),
    _c("h4", [_vm._t("default")], 2)
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4035af55", module.exports)
  }
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(16)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/mycomponents/modal/body.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-17b4402c", Component.options)
  } else {
    hotAPI.reload("data-v-17b4402c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "modal-body" }, [_vm._t("default")], 2)
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-17b4402c", module.exports)
  }
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
/* template */
var __vue_template__ = __webpack_require__(18)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/mycomponents/modal/footer.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1f034b63", Component.options)
  } else {
    hotAPI.reload("data-v-1f034b63", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "modal-footer" }, [_vm._t("default")], 2)
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-1f034b63", module.exports)
  }
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(20)
}
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(22)
/* template */
var __vue_template__ = __webpack_require__(23)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/mycomponents/uploader.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c6311dd8", Component.options)
  } else {
    hotAPI.reload("data-v-c6311dd8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("d90a5508", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c6311dd8\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./uploader.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c6311dd8\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./uploader.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.imgContainer {\r\n\tposition: relative; \r\n\theight: 200px; \r\n\twidth: 200px;\n}\n.file {\r\n\tposition: absolute; \r\n\theight: 100%; \r\n\twidth: 100%; \r\n\topacity: 0;\n}\n.imgUpload {\r\n\tbackground-color: #ffffff;\r\n\tborder:2px black solid;\n}\n.imgText {\r\n\tposition: absolute; \r\n\tleft: 0; \r\n\ttop: 45%; \r\n\twidth: 100%; \r\n\ttext-align: center;\n}\r\n", ""]);

// exports


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	props: {
		fileId: { default: 'fileId' },
		fileName: { default: 'file_name' },
		imageId: { default: 'imageId' },
		imageSrc: { default: '#' }
	},
	methods: {
		/** 
   * Print the selected file into image
   * @param String fileID, String imageId
   * 
   */
		readFile: function readFile(fileId, imageId) {
			var inputFile = $('#' + fileId)[0];
			var inputImage = $('#' + imageId);
			if (inputFile.files && inputFile.files[0]) {
				var reader = new FileReader();
				reader.onload = function (e) {
					inputImage.attr('src', e.target.result);
				};
				reader.readAsDataURL(inputFile.files[0]);
			}
		}
	}
});

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("center", [
    _c("div", { staticClass: "imgContainer" }, [
      _c("input", {
        staticClass: "file",
        attrs: { type: "file", id: _vm.fileId, name: _vm.fileName },
        on: {
          change: function($event) {
            return _vm.readFile(_vm.fileId, _vm.imageId)
          }
        }
      }),
      _vm._v(" "),
      _c("img", {
        staticClass: "imgUpload img-rounded",
        attrs: {
          src: _vm.imageSrc,
          height: "100%",
          width: "100%",
          id: _vm.imageId
        }
      }),
      _vm._v(" "),
      _c("span", { staticClass: "imgText" }, [_vm._v("Select Image")])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-c6311dd8", module.exports)
  }
}

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var methods = {
	/**
  * Hide Modal
  * @param 	{String} 	Modal ID
  *
  */
	hideModal: function hideModal(id) {
		$(id).modal('hide');
	},

	/**
  * Check if Login
  *
  * @return 	{Boolean}	isLogin
  */
	isLogin: function isLogin() {
		return localStorage['Access Token'] ? true : false;
	},

	/**
  * Log a messages
  * @param 	{String}	Message
  *
  */
	log: function log(message) {
		if (config.debug) console.log(message);
	},

	/**
  * Show an alert message
  * @param {String}		message to be Shown
  * @param {String}		type of message (info|error|loading|success)
  * @param {Boolean}		if message will be closed imediately (true|false)
  * @return {Notify}		
  */
	notify: function notify(message) {
		var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
		var progress = arguments[2];


		var delay = 5000;
		var type = 'info';
		var icon = 'fa fa-info';

		switch (label) {
			case 'error':
				type = 'danger';
				icon = 'fa fa-warning';
				break;
			case 'loading':
				delay = 0;
				icon = 'fa fa-refresh fa-spin';
				break;
			case 'success':
				type = 'success';
				icon = 'fa fa-check';
				break;
			case 'progress':
				$.notifyClose();
				delay = 0;
				message = '<label>' + message + '</label>\n\t\t\t\t\t\t\t<div class="progress">\n\t\t\t\t\t\t\t\t<div class="progress-bar progress-bar-green" role="progressbar" aria-valuenow="' + progress + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + progress + '%">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>';
				icon = 'fa fa-refresh fa-spin';
				break;
		}

		return $.notify({
			message: message,
			icon: icon
		}, {
			type: type,
			delay: delay,
			placement: { from: 'top', align: 'center' }
		});
	},

	/** 
  * Set Authorization for all outgoing request
  * 
  */
	setAuthorization: function setAuthorization() {
		axios.defaults.headers.common['Authorization'] = localStorage['Access Token'];
		$.ajaxSetup({ headers: { 'Authorization': localStorage['Access Token'] } });
	},

	/**
  * Set the title of the webpage
  * @param 	{String}	Title
  *
  */
	setTitle: function setTitle(title) {
		$('title').text(title);
	},

	/**
  * Get the error Message
  * @param 	{String}	Data
  * @param 	{Int}		Response Status
  * @return 	{String}	Error Message
  */
	getErrorMessage: function getErrorMessage(data, status) {
		var message = '';
		switch (status) {
			case 200:
				message = data.message;
				break;
			case 422:
				data = typeof data == 'string' ? JSON.parse(data) : data;
				for (var i in data) {
					data[i].map(function (y) {
						message += y + '<br/>';
					});
				}break;
			case 401:
				message = 'You need to login first.';
				break;
			default:
				message = 'An error occured.';
				break;
		}
		return message;
	},

	/**
  * Show the modal
  * @param 	{String}	Modal ID
  * 
  */
	showModal: function showModal(id) {
		$(id).modal('show');
	},

	/**
  * Show result from an http request
  * @param 	{Response}	response
  * @param 	{Type}		responseType (error|success)
  * @param 	{library}	Library used (ajax|axios) 		Default : axios
  */
	showResult: function showResult(response, type) {
		var library = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'axios';

		this.log(response);
		var isSuccess = function isSuccess(data) {
			return data.status == 'success';
		};
		if (library == 'axios') {
			if (type == 'success') {
				if (isSuccess(response.data)) {
					this.notify(response.data.message, 'success');
					return true;
				} else {
					this.notify(response.data.message, 'error');
				}
			} else {
				var status = response.response ? response.response.status : 500;
				var message = this.getErrorMessage(response.response.data, status);
				this.notify(message, 'error');
				return status;
			}
		} else if (library == 'ajax') {
			if (type == 'success') {
				if (isSuccess(response)) {
					this.notify(response.message, 'success');
					return true;
				} else {
					this.notify(response.message, 'error');
				}
			} else if (type == 'error') {
				var status = response.status;
				var message = this.getErrorMessage(response.responseText, status);
				this.notify(message, 'error');
				return status;
			}
		}
	}
};

var _data = {
	baseURL: config.baseURL,
	API: config.API,
	storageURL: config.storageURL,
	elections: [],
	election: {},
	user: {},
	positions: [],
	position: {},
	partylists: [],
	partylist: {},
	voters: {},
	voter: {},
	nominees: [],
	nominee: {},
	admins: [],
	information: {},
	result: [],
	results: [],
	last_update: new Date()
};

/* harmony default export */ __webpack_exports__["a"] = ({
	data: function data() {
		return {
			util: methods,
			data: _data
		};
	}
});

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_demo_voter_login_vue__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_demo_voter_login_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_demo_voter_login_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_demo_voter_index_vue__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_demo_voter_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_demo_voter_index_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_demo_voter_home_index_vue__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_demo_voter_home_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__components_demo_voter_home_index_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_demo_voter_home_vote_vue__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_demo_voter_home_vote_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_demo_voter_home_vote_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_demo_voter_home_result_vue__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_demo_voter_home_result_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_demo_voter_home_result_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_demo_admin_login_vue__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_demo_admin_login_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__components_demo_admin_login_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_demo_admin_index_vue__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_demo_admin_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__components_demo_admin_index_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_demo_admin_home_final_vue__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_demo_admin_home_final_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__components_demo_admin_home_final_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_demo_admin_home_home_vue__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_demo_admin_home_home_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__components_demo_admin_home_home_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_demo_admin_home_index_vue__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_demo_admin_home_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__components_demo_admin_home_index_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_demo_admin_home_result_vue__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_demo_admin_home_result_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__components_demo_admin_home_result_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_demo_admin_position_position_vue__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_demo_admin_position_position_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__components_demo_admin_position_position_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_demo_admin_position_index_vue__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_demo_admin_position_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__components_demo_admin_position_index_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_demo_admin_position_add_vue__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_demo_admin_position_add_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__components_demo_admin_position_add_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_demo_admin_position_edit_vue__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_demo_admin_position_edit_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14__components_demo_admin_position_edit_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_demo_admin_partylist_partylist_vue__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_demo_admin_partylist_partylist_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15__components_demo_admin_partylist_partylist_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_demo_admin_partylist_index_vue__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_demo_admin_partylist_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16__components_demo_admin_partylist_index_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_demo_admin_partylist_add_vue__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_demo_admin_partylist_add_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17__components_demo_admin_partylist_add_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__components_demo_admin_partylist_edit_vue__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__components_demo_admin_partylist_edit_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18__components_demo_admin_partylist_edit_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__components_demo_admin_voter_voter_vue__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__components_demo_admin_voter_voter_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_19__components_demo_admin_voter_voter_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__components_demo_admin_voter_index_vue__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__components_demo_admin_voter_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20__components_demo_admin_voter_index_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__components_demo_admin_voter_add_vue__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__components_demo_admin_voter_add_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_21__components_demo_admin_voter_add_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__components_demo_admin_voter_edit_vue__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__components_demo_admin_voter_edit_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_22__components_demo_admin_voter_edit_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__components_demo_admin_nominee_nominee_vue__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__components_demo_admin_nominee_nominee_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_23__components_demo_admin_nominee_nominee_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__components_demo_admin_nominee_index_vue__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__components_demo_admin_nominee_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_24__components_demo_admin_nominee_index_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__components_demo_admin_nominee_add_vue__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__components_demo_admin_nominee_add_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_25__components_demo_admin_nominee_add_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__components_demo_admin_nominee_edit_vue__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__components_demo_admin_nominee_edit_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_26__components_demo_admin_nominee_edit_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__components_demo_admin_admin_admin_vue__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__components_demo_admin_admin_admin_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_27__components_demo_admin_admin_admin_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__components_demo_admin_admin_index_vue__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__components_demo_admin_admin_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_28__components_demo_admin_admin_index_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__components_demo_admin_admin_edit_vue__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__components_demo_admin_admin_edit_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_29__components_demo_admin_admin_edit_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__components_demo_admin_admin_password_vue__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__components_demo_admin_admin_password_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_30__components_demo_admin_admin_password_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__components_demo_admin_admin_add_vue__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__components_demo_admin_admin_add_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_31__components_demo_admin_admin_add_vue__);










































var default_component = {
	template: '<div>Not found: {{ $route.path }}</div>'
};

/* harmony default export */ __webpack_exports__["a"] = ([{
	path: '/',
	component: __WEBPACK_IMPORTED_MODULE_1__components_demo_voter_index_vue___default.a,
	children: [{
		path: '',
		component: __WEBPACK_IMPORTED_MODULE_2__components_demo_voter_home_index_vue___default.a,
		name: 'Voter Home'
	}, {
		path: 'vote',
		component: __WEBPACK_IMPORTED_MODULE_3__components_demo_voter_home_vote_vue___default.a,
		name: 'Vote'
	}, {
		path: 'result',
		component: __WEBPACK_IMPORTED_MODULE_4__components_demo_voter_home_result_vue___default.a,
		name: 'Result'
	}]
}, {
	path: '/login',
	component: __WEBPACK_IMPORTED_MODULE_0__components_demo_voter_login_vue___default.a,
	name: 'Voter Login'
}, {
	path: '/admin/login',
	component: __WEBPACK_IMPORTED_MODULE_5__components_demo_admin_login_vue___default.a,
	name: 'Admin Login'
}, {
	path: '/admin',
	component: __WEBPACK_IMPORTED_MODULE_6__components_demo_admin_index_vue___default.a,
	children: [{
		path: 'result/:election_id',
		component: __WEBPACK_IMPORTED_MODULE_7__components_demo_admin_home_final_vue___default.a,
		name: 'Election Result'
	}, {
		path: '',
		component: __WEBPACK_IMPORTED_MODULE_8__components_demo_admin_home_home_vue___default.a,
		children: [{
			path: '',
			component: __WEBPACK_IMPORTED_MODULE_9__components_demo_admin_home_index_vue___default.a,
			name: 'Admin Home'
		}, {
			path: 'result',
			component: __WEBPACK_IMPORTED_MODULE_10__components_demo_admin_home_result_vue___default.a,
			name: 'Current Result'
		}]
	}, {
		path: 'position',
		component: __WEBPACK_IMPORTED_MODULE_11__components_demo_admin_position_position_vue___default.a,
		children: [{
			path: '',
			component: __WEBPACK_IMPORTED_MODULE_12__components_demo_admin_position_index_vue___default.a,
			name: 'Manage Position'
		}, {
			path: 'add',
			component: __WEBPACK_IMPORTED_MODULE_13__components_demo_admin_position_add_vue___default.a,
			name: 'Add Position'
		}, {
			path: 'edit/:id',
			component: __WEBPACK_IMPORTED_MODULE_14__components_demo_admin_position_edit_vue___default.a,
			name: 'Edit Position'
		}]
	}, {
		path: 'partylist',
		component: __WEBPACK_IMPORTED_MODULE_15__components_demo_admin_partylist_partylist_vue___default.a,
		children: [{
			path: '',
			component: __WEBPACK_IMPORTED_MODULE_16__components_demo_admin_partylist_index_vue___default.a,
			name: 'Manage Partylist'
		}, {
			path: 'add',
			component: __WEBPACK_IMPORTED_MODULE_17__components_demo_admin_partylist_add_vue___default.a,
			name: 'Add Partylist'
		}, {
			path: 'edit/:id',
			component: __WEBPACK_IMPORTED_MODULE_18__components_demo_admin_partylist_edit_vue___default.a,
			name: 'Edit Partylist'
		}]
	}, {
		path: 'voter',
		component: __WEBPACK_IMPORTED_MODULE_19__components_demo_admin_voter_voter_vue___default.a,
		children: [{
			path: '',
			component: __WEBPACK_IMPORTED_MODULE_20__components_demo_admin_voter_index_vue___default.a,
			name: 'Manage Voter'
		}, {
			path: 'add',
			component: __WEBPACK_IMPORTED_MODULE_21__components_demo_admin_voter_add_vue___default.a,
			name: 'Add Voter'
		}, {
			path: 'edit/:id',
			component: __WEBPACK_IMPORTED_MODULE_22__components_demo_admin_voter_edit_vue___default.a,
			name: 'Edit Voter'
		}]
	}, {
		path: 'nominee',
		component: __WEBPACK_IMPORTED_MODULE_23__components_demo_admin_nominee_nominee_vue___default.a,
		children: [{
			path: '',
			component: __WEBPACK_IMPORTED_MODULE_24__components_demo_admin_nominee_index_vue___default.a,
			name: 'Manage Nominee'
		}, {
			path: 'add',
			component: __WEBPACK_IMPORTED_MODULE_25__components_demo_admin_nominee_add_vue___default.a,
			name: 'Add Nominee'
		}, {
			path: 'edit/:id',
			component: __WEBPACK_IMPORTED_MODULE_26__components_demo_admin_nominee_edit_vue___default.a,
			name: 'Edit Nominee'
		}]
	}, {
		path: '/account',
		component: __WEBPACK_IMPORTED_MODULE_27__components_demo_admin_admin_admin_vue___default.a,
		children: [{
			path: '',
			component: __WEBPACK_IMPORTED_MODULE_28__components_demo_admin_admin_index_vue___default.a,
			name: 'Manage Account'
		}, {
			path: 'update',
			component: __WEBPACK_IMPORTED_MODULE_29__components_demo_admin_admin_edit_vue___default.a,
			name: 'Update Account'
		}, {
			path: 'password',
			component: __WEBPACK_IMPORTED_MODULE_30__components_demo_admin_admin_password_vue___default.a,
			name: 'Update Password'
		}, {
			path: 'add',
			component: __WEBPACK_IMPORTED_MODULE_31__components_demo_admin_admin_add_vue___default.a,
			name: 'Add Account'
		}]
	}]
}]);

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(27)
}
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(29)
/* template */
var __vue_template__ = __webpack_require__(30)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/voter/login.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-69b2d24d", Component.options)
  } else {
    hotAPI.reload("data-v-69b2d24d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(28);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("6298394d", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-69b2d24d\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./login.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-69b2d24d\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./login.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\nbody {\r\n\tpadding: 50px 5px;\n}\r\n", ""]);

// exports


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({

	data: function data() {
		return {
			loading: false
		};
	},

	created: function created() {
		if (this.util.isLogin())
			//return this.$router.push({name:'Admin Home'})
			this.util.setTitle('Voter Login');
	},

	methods: {
		login: function login() {
			var _this = this;

			if (this.loading) return;

			var vm = this;

			this.startLoading();

			axios.post(config.API + 'voter/login', $('#login_form').serialize()).then(function (response) {
				vm.stopLoading();
				if (_this.util.showResult(response, 'success')) {
					localStorage['Access Token'] = 'Bearer ' + response.data.token;
					_this.util.setAuthorization();
					vm.$router.push({ name: 'Vote' });
				}
			}).catch(function (error) {
				vm.stopLoading();
				_this.util.showResult(error, 'error');
			});
		},

		startLoading: function startLoading() {
			this.util.notify('Logging in', 'loading');
			this.loading = true;
		},

		stopLoading: function stopLoading() {
			$.notifyClose();
			this.loading = false;
		}
	}

});

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "col-md-5 col-md-offset-3" }, [
    _c("div", { staticClass: "panel panel-default" }, [
      _vm._m(0),
      _vm._v(" "),
      _c("div", { staticClass: "panel-body" }, [
        _c(
          "form",
          {
            attrs: { id: "login_form" },
            on: {
              submit: function($event) {
                $event.preventDefault()
                return _vm.login($event)
              }
            }
          },
          [_vm._m(1), _vm._v(" "), _vm._m(2)]
        )
      ])
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "panel-heading" }, [
      _c("h4", [_vm._v("Voter Login")])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "otp" } }, [_vm._v("OTP")]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "text", name: "otp", required: "" }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("input", {
        staticClass: "btn btn-primary form-control",
        attrs: { type: "submit", value: "Login" }
      })
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-69b2d24d", module.exports)
  }
}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(32)
}
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(34)
/* template */
var __vue_template__ = __webpack_require__(35)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/voter/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-bfe9a194", Component.options)
  } else {
    hotAPI.reload("data-v-bfe9a194", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(33);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("8fc63526", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-bfe9a194\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-bfe9a194\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\nbody{\r\n\tpadding: 70px 5px;\n}\t\r\n", ""]);

// exports


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			loading: true
		};
	},

	created: function created() {
		this.refreshInfo();
	},

	methods: {
		logout: function logout() {
			localStorage.clear();
			this.$router.push({ name: 'Voter Login' });
		},

		hasVoted: function hasVoted() {
			return this.data.result.length > 0;
		},

		refreshInfo: function refreshInfo() {
			var vm = this;
			this.util.setAuthorization();
			axios.get(config.API + 'election/information').then(function (response) {
				console.log(response);
				vm.loading = false;
				vm.data.election = response.data.election;
				vm.data.nominees = response.data.nominee;
				vm.data.partylists = response.data.partylist;
				vm.data.positions = response.data.position;
				vm.data.user = response.data.voter;
				vm.data.result = response.data.result;
			}).catch(function (error) {
				vm.loading = false;
				if (vm.util.showResult(error, 'error') == 401) {
					vm.$router.push({ name: 'Voter Login' });
				}
			});
		}
	}
});

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    !_vm.loading
      ? _c(
          "div",
          [
            _c(
              "nav",
              {
                staticClass: "navbar navbar-default navbar-fixed-top",
                attrs: { id: "nav" }
              },
              [
                _c("div", { staticClass: "container-fluid" }, [
                  _vm._m(0),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass: "collapse navbar-collapse",
                      attrs: { id: "myNavbar" }
                    },
                    [
                      _c("ul", { staticClass: "nav navbar-nav" }, [
                        _c(
                          "a",
                          {
                            staticClass: "navbar-brand",
                            attrs: { href: _vm.data.baseURL }
                          },
                          [_vm._v("Voting System")]
                        )
                      ]),
                      _vm._v(" "),
                      _c(
                        "ul",
                        { staticClass: "nav navbar-nav" },
                        [
                          _vm.data.election.status == 2 && !_vm.hasVoted()
                            ? _c(
                                "router-link",
                                {
                                  attrs: {
                                    to: { name: "Vote" },
                                    tag: "li",
                                    exact: ""
                                  }
                                },
                                [
                                  _c("a", { attrs: { href: "#" } }, [
                                    _vm._v("Vote")
                                  ])
                                ]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.data.election.status == 2 && _vm.hasVoted()
                            ? _c(
                                "router-link",
                                {
                                  attrs: { to: { name: "Result" }, tag: "li" }
                                },
                                [
                                  _c("a", { attrs: { href: "#" } }, [
                                    _vm._v("Results")
                                  ])
                                ]
                              )
                            : _vm._e()
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c("ul", { staticClass: "nav navbar-right navbar-nav" }, [
                        _c("li", { staticClass: "dropdown" }, [
                          _c(
                            "a",
                            {
                              staticClass: "dropdown-toggle",
                              attrs: {
                                href: "#",
                                "data-toggle": "dropdown",
                                role: "button",
                                "aria-haspopup": "true",
                                "aria-expanded": "false"
                              }
                            },
                            [
                              _c("span", { staticClass: "fa fa-user" }),
                              _vm._v(" " + _vm._s(_vm.data.user.name) + " "),
                              _c("span", { staticClass: "caret" })
                            ]
                          ),
                          _vm._v(" "),
                          _c("ul", { staticClass: "dropdown-menu" }, [
                            _c(
                              "li",
                              {
                                on: {
                                  click: function($event) {
                                    return _vm.logout()
                                  }
                                }
                              },
                              [_c("a", [_vm._v("Logout")])]
                            )
                          ])
                        ])
                      ])
                    ]
                  )
                ])
              ]
            ),
            _vm._v(" "),
            _c("router-view")
          ],
          1
        )
      : _c("div", { staticClass: "container" }, [_vm._m(1)])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "navbar-header" }, [
      _c(
        "button",
        {
          staticClass: "navbar-toggle",
          attrs: {
            type: "button",
            "data-toggle": "collapse",
            "data-target": "#myNavbar"
          }
        },
        [
          _c("span", { staticClass: "icon-bar" }),
          _vm._v(" "),
          _c("span", { staticClass: "icon-bar" }),
          _vm._v(" "),
          _c("span", { staticClass: "icon-bar" })
        ]
      ),
      _vm._v(" "),
      _c("img", {
        attrs: { src: "/logo.png", contain: "", height: "40px", width: "40px" }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "jumbotron" }, [
      _c("h1", [
        _vm._v("Loading "),
        _c("i", { staticClass: "fa fa-refresh fa-spin" })
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-bfe9a194", module.exports)
  }
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(37)
/* template */
var __vue_template__ = __webpack_require__(38)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/voter/home/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-57d6a3ee", Component.options)
  } else {
    hotAPI.reload("data-v-57d6a3ee", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	created: function created() {
		//console.log(this)
	},

	data: function data() {
		return {
			x: {}
		};
	},

	methods: {
		hasVoted: function hasVoted() {
			return this.data.result.length > 0;
		},

		getPartylist: function getPartylist(id) {
			var partylists = this.data.partylists;
			for (var i in partylists) {
				if (partylists[i]['id'] == id) return partylists[i]['name'];
			}return 'No Partylist';
		},

		getPosition: function getPosition(id) {
			var positions = this.data.positions;
			for (var i in positions) {
				if (positions[i].id == id) return positions[i].name;
			}return '';
		},

		getNominee: function getNominee(id) {
			var nominees = this.data.nominees;
			for (var i in nominees) {
				if (nominees[i]['id'] == id) return nominees[i].name;
			}return '';
		},

		view: function view(index) {
			this.x = this.data.nominees[index];
			this.util.showModal('#nominee-information-modal');
		}
	},

	computed: {
		header: function header() {
			return this.x.name + ' for ' + this.getPosition(this.x.position_id);
		}
	}
});

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "row col-md-10 col-md-offset-1" }, [
    _c("div", { staticClass: "col-md-4" }, [
      _c("h4", [_vm._v("Voter's Information")]),
      _c("hr"),
      _vm._v(" "),
      _c("ul", { staticClass: "list-group" }, [
        _c("li", { staticClass: "list-group-item" }, [
          _c("b", [_vm._v("Civ HR Control nr : ")]),
          _vm._v(_vm._s(_vm.data.user.student_id))
        ]),
        _vm._v(" "),
        _c("li", { staticClass: "list-group-item" }, [
          _c("b", [_vm._v("Name : ")]),
          _vm._v(_vm._s(_vm.data.user.name))
        ]),
        _vm._v(" "),
        _c("li", { staticClass: "list-group-item" }, [
          _c("b", [_vm._v("Unit : ")]),
          _vm._v(_vm._s(_vm.data.user.course))
        ]),
        _vm._v(" "),
        _vm.data.election.status == 1
          ? _c(
              "li",
              { staticClass: "list-group-item" },
              [_c("center", [_vm._v("Election hasn't started yet")])],
              1
            )
          : _vm._e(),
        _vm._v(" "),
        _vm.data.election.status == 2
          ? _c(
              "li",
              { staticClass: "list-group-item" },
              [
                _c(
                  "center",
                  [
                    !_vm.hasVoted()
                      ? _c(
                          "router-link",
                          {
                            staticClass: "btn btn-info",
                            attrs: { to: { name: "Vote" } }
                          },
                          [_vm._v("\r\n\t\t\t\t\t\tVote Now\r\n\t\t\t\t\t")]
                        )
                      : _c(
                          "router-link",
                          {
                            staticClass: "btn btn-info",
                            attrs: { to: { name: "Result" } }
                          },
                          [_vm._v("\r\n\t\t\t\t\t\tView Result\r\n\t\t\t\t\t")]
                        )
                  ],
                  1
                )
              ],
              1
            )
          : _vm._e()
      ]),
      _vm._v(" "),
      _vm.hasVoted()
        ? _c("div", [
            _c("hr"),
            _vm._v(" "),
            _c("h4", [_vm._v("Your votes information")]),
            _c("hr"),
            _vm._v(" "),
            _c(
              "ul",
              { staticClass: "list-group" },
              _vm._l(_vm.data.result, function(result) {
                return _c("li", { staticClass: "list-group-item" }, [
                  _c("b", [
                    _vm._v(_vm._s(_vm.getPosition(result.position_id)) + " : ")
                  ]),
                  _vm._v(
                    _vm._s(_vm.getNominee(result.nominee_id)) + "\r\n\t\t\t\t"
                  )
                ])
              }),
              0
            )
          ])
        : _vm._e()
    ]),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "col-md-8" },
      [
        _c("h4", [_vm._v("Candidates Information")]),
        _c("hr"),
        _vm._v(" "),
        _c("small", [_vm._v("Click Picture to see details")]),
        _vm._v(" "),
        _vm._l(_vm.data.positions, function(position) {
          return _c("div", { staticClass: "panel panel-primary" }, [
            _c("div", { staticClass: "panel-heading" }, [
              _vm._v(_vm._s(position.name))
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "panel-body table-responsive" }, [
              _c("table", { staticClass: "table table-hover" }, [
                _vm._m(0, true),
                _vm._v(" "),
                _c(
                  "tbody",
                  _vm._l(_vm.data.nominees, function(nominee, i) {
                    return nominee.position_id == position.id
                      ? _c("tr", [
                          _c("td", [
                            _c("img", {
                              staticClass: "thumbnail",
                              staticStyle: { height: "60px", width: "60px" },
                              attrs: {
                                src: _vm.data.storageURL + nominee.image
                              },
                              on: {
                                click: function($event) {
                                  return _vm.view(i)
                                }
                              }
                            })
                          ]),
                          _vm._v(" "),
                          _c("td", [_vm._v(_vm._s(nominee.name))]),
                          _vm._v(" "),
                          _c("td", [
                            _vm._v(
                              _vm._s(_vm.getPartylist(nominee.partylist_id))
                            )
                          ]),
                          _vm._v(" "),
                          _c("td", [_vm._v(_vm._s(nominee.course))])
                        ])
                      : _vm._e()
                  }),
                  0
                )
              ])
            ])
          ])
        }),
        _vm._v(" "),
        _c(
          "modal",
          { attrs: { id: "nominee-information-modal", aClass: "primary" } },
          [
            _c("modal-header", [_vm._v(_vm._s(_vm.header))]),
            _vm._v(" "),
            _c("modal-body", [
              _c("div", { staticClass: "row" }, [
                _c("div", { staticClass: "col-md-3" }, [
                  _c("img", {
                    staticClass: "thumbnail",
                    staticStyle: { height: "150px", width: "150px" },
                    attrs: { src: _vm.data.storageURL + _vm.x.image }
                  })
                ]),
                _vm._v(" "),
                _c(
                  "div",
                  {
                    staticClass: "col-md-9",
                    staticStyle: { "margin-left": "5px" }
                  },
                  [
                    _c("h3", [
                      _c("strong", [
                        _c("em", [_vm._v('"' + _vm._s(_vm.x.motto) + '"')])
                      ])
                    ]),
                    _vm._v(" "),
                    _c("b", [_vm._v(" Name : ")]),
                    _vm._v(_vm._s(_vm.x.name)),
                    _c("br"),
                    _vm._v(" "),
                    _c("b", [_vm._v(" Unit : ")]),
                    _vm._v(_vm._s(_vm.x.course)),
                    _c("br"),
                    _vm._v(" "),
                    _c("b", [_vm._v(" Partylist : ")]),
                    _vm._v(_vm._s(_vm.getPartylist(_vm.x.partylist_id))),
                    _c("br"),
                    _c("hr"),
                    _vm._v(
                      "\r\n\t\t\t\t\t\t" +
                        _vm._s(_vm.x.description) +
                        "\r\n\t\t\t\t\t"
                    )
                  ]
                )
              ])
            ]),
            _vm._v(" "),
            _c("modal-footer", [
              _c(
                "button",
                {
                  staticClass: "btn btn-default",
                  attrs: { "data-dismiss": "modal" }
                },
                [_vm._v("Close")]
              )
            ])
          ],
          1
        )
      ],
      2
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", [
        _c("th"),
        _vm._v(" "),
        _c("th", [_vm._v("Name")]),
        _vm._v(" "),
        _c("th", [_vm._v("Partylist")]),
        _vm._v(" "),
        _c("th", [_vm._v("Unit")])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-57d6a3ee", module.exports)
  }
}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(40)
/* template */
var __vue_template__ = __webpack_require__(41)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/voter/home/vote.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0cf4be7e", Component.options)
  } else {
    hotAPI.reload("data-v-0cf4be7e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	created: function created() {
		if (this.data.result.length > 0 || this.data.election.status != 2) this.$router.push({ name: 'Voter Home' });
		for (var i in this.data.positions) {
			this.selected.push({
				position_id: this.data.positions[i]['id'],
				nominee_id: null
			});
		}
	},

	data: function data() {
		return {
			selected: [],
			name: {}
		};
	},

	methods: {

		submit: function submit() {
			this.util.hideModal('#vote-modal');
			if (this.hasNullVote()) return;
			var vm = this;
			this.util.notify('Submitting your vote, please wait...', 'loading');
			var data = {};
			data['vote'] = this.selected;
			axios.post(config.API + 'election/vote', data).then(function (response) {
				$.notifyClose();
				if (vm.util.showResult(response, 'success')) {
					vm.data.result = response.data.result;
					vm.$router.push({ name: 'Result' });
				}
			}).catch(function (error) {
				$.notifyClose();
				vm.util.showResult(error, 'error');
			});
		},

		hasNullVote: function hasNullVote() {
			var selected = this.selected;
			for (var i in selected) {
				if (selected[i]['nominee_id'] == null) {
					this.util.notify('You must vote for all positions', 'error');
					return true;
				}
			}return false;
		},

		reset: function reset() {
			var selected = this.selected;
			for (var i in selected) {
				$('#' + selected[i]['nominee_id']).selected(false);
				selected[i]['nominee_id'] = null;
			}
		},

		vote: function vote(position_id, nominee_id) {
			$('#' + nominee_id).selected();
			for (var i in this.selected) {
				if (this.selected[i]['position_id'] == position_id) {
					this.selected[i]['nominee_id'] = nominee_id;
				}
			}
		},

		getName: function getName(id) {
			var positions = this.data.positions;
			var selected = this.selected;
			for (var i in selected) {
				if (selected[i]['position_id'] == id) return this.getNominee(selected[i]['nominee_id']);
			}return '';
		},

		getNominee: function getNominee(id) {
			var nominees = this.data.nominees;
			for (var i in nominees) {
				if (nominees[i]['id'] == id) return nominees[i]['name'];
			}
		},

		getPartylist: function getPartylist(id) {
			var partylists = this.data.partylists;
			for (var i in partylists) {
				if (partylists[i]['id'] == id) return partylists[i]['name'];
			}return 'No Team';
		}
	}
});

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "row col-md-10 col-md-offset-1" },
    [
      _c("div", { staticClass: "col-md-4" }, [
        _c("h4", [_vm._v("Vote Information")]),
        _c("hr"),
        _vm._v(" "),
        _c(
          "ul",
          { staticClass: "list-group" },
          [
            _vm._l(_vm.data.positions, function(position) {
              return _c("li", { staticClass: "list-group-item" }, [
                _c("b", [_vm._v(_vm._s(position.name) + " : ")]),
                _vm._v(_vm._s(_vm.getName(position.id)) + "\n\t\t\t")
              ])
            }),
            _vm._v(" "),
            _c(
              "li",
              { staticClass: "list-group-item" },
              [
                _c("center", [
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-success",
                      on: {
                        click: function($event) {
                          return _vm.util.showModal("#vote-modal")
                        }
                      }
                    },
                    [_vm._v("Submit Vote")]
                  ),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-default",
                      on: {
                        click: function($event) {
                          return _vm.reset()
                        }
                      }
                    },
                    [_vm._v("Reset")]
                  )
                ])
              ],
              1
            )
          ],
          2
        )
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "col-md-8" },
        [
          _c("h4", [_vm._v("Select Candidates")]),
          _c("hr"),
          _vm._v(" "),
          _vm._l(_vm.data.positions, function(position) {
            return _c("div", { staticClass: "panel panel-info" }, [
              _c("div", { staticClass: "panel-heading" }, [
                _vm._v(_vm._s(position.name))
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "panel-body table-responsive" }, [
                _c("table", { staticClass: "table table-hover" }, [
                  _vm._m(0, true),
                  _vm._v(" "),
                  _c(
                    "tbody",
                    _vm._l(_vm.data.nominees, function(nominee) {
                      return nominee.position_id == position.id
                        ? _c(
                            "tr",
                            {
                              on: {
                                click: function($event) {
                                  return _vm.vote(position.id, nominee.id)
                                }
                              }
                            },
                            [
                              _c("td", [
                                _c("input", {
                                  staticStyle: {
                                    width: "2em",
                                    height: "2em",
                                    "margin-top": "2em"
                                  },
                                  attrs: {
                                    type: "radio",
                                    name: position.id,
                                    id: nominee.id
                                  }
                                })
                              ]),
                              _vm._v(" "),
                              _c("td", [
                                _c("img", {
                                  staticClass: "thumbnail",
                                  staticStyle: {
                                    height: "80px",
                                    width: "80px"
                                  },
                                  attrs: {
                                    src: _vm.data.storageURL + nominee.image
                                  }
                                })
                              ]),
                              _vm._v(" "),
                              _c("td", [
                                _c(
                                  "p",
                                  { staticStyle: { "margin-top": "2em" } },
                                  [_vm._v(_vm._s(nominee.name))]
                                )
                              ]),
                              _vm._v(" "),
                              _c("td", [
                                _c(
                                  "p",
                                  { staticStyle: { "margin-top": "2em" } },
                                  [
                                    _vm._v(
                                      _vm._s(
                                        _vm.getPartylist(nominee.partylist_id)
                                      )
                                    )
                                  ]
                                )
                              ]),
                              _vm._v(" "),
                              _c("td", [
                                _c(
                                  "p",
                                  { staticStyle: { "margin-top": "2em" } },
                                  [_vm._v(_vm._s(nominee.course))]
                                )
                              ])
                            ]
                          )
                        : _vm._e()
                    }),
                    0
                  )
                ])
              ])
            ])
          })
        ],
        2
      ),
      _vm._v(" "),
      _c(
        "modal",
        { attrs: { id: "vote-modal" } },
        [
          _c("modal-header", [_vm._v("Vote")]),
          _vm._v(" "),
          _c("modal-body", [
            _c("h3", [_vm._v("Note: You can only vote once, so vote wisely.")])
          ]),
          _vm._v(" "),
          _c("modal-footer", [
            _c(
              "button",
              {
                staticClass: "btn btn-success",
                on: {
                  click: function($event) {
                    return _vm.submit()
                  }
                }
              },
              [_vm._v("Submit Vote")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticClass: "btn btn-default",
                attrs: { "data-dismiss": "modal" }
              },
              [_vm._v("Cancel")]
            )
          ])
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", [
        _c("th"),
        _vm._v(" "),
        _c("th", { attrs: { width: "7%" } }),
        _vm._v(" "),
        _c("th", [_vm._v("Name")]),
        _vm._v(" "),
        _c("th", [_vm._v("Team Name")]),
        _vm._v(" "),
        _c("th", [_vm._v("Unit")])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0cf4be7e", module.exports)
  }
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(43)
/* template */
var __vue_template__ = __webpack_require__(44)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/voter/home/result.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-56ffd331", Component.options)
  } else {
    hotAPI.reload("data-v-56ffd331", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			results: [{
				"position_id": 6,
				"nominee_id": 1,
				"votes": 2
			}, {
				"position_id": 8,
				"nominee_id": 6,
				"votes": 2
			}, {
				"position_id": 7,
				"nominee_id": 5,
				"votes": 2
			}, {
				"position_id": 7,
				"nominee_id": 4,
				"votes": 1
			}, {
				"position_id": 6,
				"nominee_id": 2,
				"votes": 1
			}, {
				"position_id": 8,
				"nominee_id": 7,
				"votes": 1
			}]
		};
	},
	created: function created() {
		this.refreshResults();
		this.$nextTick(function () {
			this.initChart();
		});
	},

	watch: {
		position_id: function position_id() {
			this.initChart();
		}
	},

	methods: {
		refreshResults: function refreshResults() {
			var vm = this;
			this.util.notify('Refreshing results', 'loading');
			axios.get(config.API + 'election/result').then(function (response) {
				$.notifyClose();
				console.log(response);
				vm.data.results = response.data;
				vm.data.last_update = new Date();
				vm.initChart();
			}).catch(function (error) {
				$.notifyClose();
				vm.util.showResult(error);
			});
		},

		initChart: function initChart() {
			var ticks = [];
			var tick = 0;
			var data = [];
			var nominees = this.data.nominees;
			for (var i in nominees) {
				if (nominees[i]['position_id'] == this.position_id) {
					ticks.push([tick++, nominees[i]['name']]);
				}
			}
			$.plot($('#barchart'), this.datas, {
				series: {
					bars: {
						show: true,
						barWidth: 0.6,
						align: "center",
						fill: 0.75,
						numbers: { show: true,
							Formatter: function Formatter(label, series) {
								var percent = Math.round(series.percent);
								var number = series.data[0][1];
								return '</b>:&nbsp;' + number;
							}
						}
					}
				},
				xaxis: {
					ticks: ticks,
					mode: "categories",
					showTicks: false,
					gridLines: false,
					panRange: [0, null]
				},
				yaxis: {
					minTickSize: 1,
					tickDecimals: 0
				},
				legend: {
					show: true,
					labelFormatter: function labelFormatter(label, series) {
						var percent = Math.round(series.percent);
						var number = series.data[0][1];
						return '&nbsp;<b>' + label + '</b>:&nbsp;' + number;
					}
				},
				valueLabels: {
					show: true
				}

			});
		},

		getPosition: function getPosition(id) {
			var positions = this.data.positions;
			for (var i in positions) {
				if (id == positions[i]['id']) return positions[i]['name'];
			}return '';
		},

		getNominee: function getNominee(id) {
			var nominees = this.data.nominees;
			for (var i in nominees) {
				if (id == nominees[i]['id']) return nominees[i]['name'];
			}return '';
		},

		getVotes: function getVotes(id) {
			var results = this.data.results;
			for (var i in results) {
				if (results[i]['nominee_id'] == id) return results[i]['votes'];
			}
			return 0;
		}
	},

	computed: {
		last_update: function last_update() {
			var x = this.data.last_update;
			return x.toDateString() + ' ' + x.toLocaleTimeString();
		},

		position_id: function position_id() {
			return this.$route.query.position_id ? this.$route.query.position_id : this.data.positions[0]['id'];
		},

		datas: function datas() {
			//var results =
			var data = [];
			var inc = 0;
			var tick = 0;
			var nominees = this.data.nominees;
			for (var i in nominees) {
				if (nominees[i]['position_id'] == this.position_id) {
					var row = [];
					row['label'] = nominees[i]['name'];
					row['data'] = [[inc++, this.getVotes(nominees[i]['id'])]];
					row['ticks'] = [[tick++, nominees[i]['name']]];
					data.push(row);
				}
			}
			return data;
		}
	}
});

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "row col-md-10 col-md-offset-1" }, [
    _c("div", { staticClass: "col-md-4" }, [
      _c("h4", [_vm._v("Positions")]),
      _c("hr"),
      _vm._v(" "),
      _c(
        "ul",
        { staticClass: "list-group" },
        [
          _vm._l(_vm.data.positions, function(position) {
            return _c(
              "router-link",
              {
                key: position.id,
                staticClass: "list-group-item",
                class: { active: position.id == _vm.position_id },
                attrs: {
                  tag: "li",
                  to: { query: { position_id: position.id } },
                  exact: "",
                  replace: ""
                }
              },
              [_vm._v("\r\n\t\t\t\t" + _vm._s(position.name) + "\r\n\t\t\t")]
            )
          }),
          _vm._v(" "),
          _c(
            "li",
            { staticClass: "list-group-item" },
            [
              _c("center", [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-info",
                    on: {
                      click: function($event) {
                        return _vm.refreshResults()
                      }
                    }
                  },
                  [
                    _vm._v("\r\n\t\t\t\t\t\tRefresh results "),
                    _c("i", { staticClass: "fa fa-refresh" })
                  ]
                )
              ])
            ],
            1
          )
        ],
        2
      )
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "col-md-8" }, [
      _c("h4", [_vm._v("Results")]),
      _c("hr"),
      _vm._v(" "),
      _c("div", { staticClass: "panel panel-default" }, [
        _c("div", { staticClass: "panel-heading" }, [
          _vm._v(
            _vm._s(_vm.getPosition(_vm.position_id)) +
              " - Results as of : " +
              _vm._s(_vm.last_update)
          )
        ]),
        _vm._v(" "),
        _vm._m(0)
      ])
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "panel-body" }, [
      _c("div", {
        staticStyle: { height: "500px", width: "600px" },
        attrs: { id: "barchart" }
      })
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-56ffd331", module.exports)
  }
}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(46)
}
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(48)
/* template */
var __vue_template__ = __webpack_require__(49)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/login.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c86be3d8", Component.options)
  } else {
    hotAPI.reload("data-v-c86be3d8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(47);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("33be24c2", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c86be3d8\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./login.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c86be3d8\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./login.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\nbody {\r\n\tpadding: 50px 5px;\n}\r\n", ""]);

// exports


/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({

	data: function data() {
		return {
			loading: {
				value: 'Login',
				isLoading: false
			}
		};
	},

	created: function created() {
		if (this.util.isLogin()) return this.$router.push({ name: 'Admin Home' });
		this.util.setTitle('Admin Login');
	},

	methods: {
		login: function login() {
			var _this = this;

			if (this.loading.isLoading) return;

			var vm = this;

			this.startLoading();

			axios.post(config.API + 'admin/login', $('#login_form').serialize()).then(function (response) {
				vm.stopLoading();
				if (_this.util.showResult(response, 'success')) {
					localStorage['Access Token'] = 'Bearer ' + response.data.token;
					_this.util.setAuthorization();
					vm.$router.push({ name: 'Admin Home' });
				}
			}).catch(function (error) {
				vm.stopLoading();
				_this.util.showResult(error, 'error');
			});
		},

		startLoading: function startLoading() {
			this.util.notify('Logging in', 'loading');
			this.loading = {
				value: 'Loading...',
				isLoading: true
			};
		},

		stopLoading: function stopLoading() {
			$.notifyClose();
			this.loading = {
				value: 'Login',
				isLoading: false
			};
		}
	}

});

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "col-md-5 col-md-offset-3" }, [
    _c("div", { staticClass: "panel panel-default" }, [
      _vm._m(0),
      _vm._v(" "),
      _c("div", { staticClass: "panel-body" }, [
        _c(
          "form",
          {
            attrs: { id: "login_form" },
            on: {
              submit: function($event) {
                $event.preventDefault()
                return _vm.login($event)
              }
            }
          },
          [
            _vm._m(1),
            _vm._v(" "),
            _vm._m(2),
            _vm._v(" "),
            _vm._m(3),
            _vm._v(" "),
            _c("div", { staticClass: "form-group" }, [
              _c("input", {
                staticClass: "btn btn-primary form-control",
                class: { disabled: _vm.loading.isLoading },
                attrs: { type: "submit" },
                domProps: { value: _vm.loading.value }
              })
            ])
          ]
        )
      ])
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "panel-heading" }, [
      _c("h4", [_vm._v("Admin Login")])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "email" } }, [_vm._v("E-mail")]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "email", name: "email", required: "" }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "password" } }, [_vm._v("Password")]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: {
          type: "password",
          name: "password",
          id: "password",
          required: ""
        }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("label", [
      _c("input", {
        attrs: {
          type: "checkbox",
          id: "visibility",
          onclick:
            " $(this)[0].checked ? \r\n\t\t\t\t\t\t\t\t\t$('#password').attr('type','text'):\r\n\t\t\t\t\t\t\t\t\t$('#password').attr('type','password')"
        }
      }),
      _vm._v(" Show Password\r\n\t\t\t\t")
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-c86be3d8", module.exports)
  }
}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(51)
}
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(53)
/* template */
var __vue_template__ = __webpack_require__(54)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5bbb2a06", Component.options)
  } else {
    hotAPI.reload("data-v-5bbb2a06", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(52);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("0eaa9c56", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5bbb2a06\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5bbb2a06\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\nbody{\r\n\tpadding: 70px 5px;\n}\t\r\n", ""]);

// exports


/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({

	data: function data() {
		return {
			loading: true
		};
	},

	created: function created() {
		var _this = this;

		this.util.setTitle('Voting System - Administrator');
		var vm = this;
		if (this.util.isLogin()) {
			this.util.setAuthorization();
			axios.get(config.API + 'admin/information').then(function (response) {
				console.log(response);
				vm.data.user = response.data.user;
				vm.data.election = response.data.election;
				vm.data.partylists = response.data.partylist;
				vm.data.positions = response.data.position;
				vm.loading = false;
			}).catch(function (error) {
				$.notifyClose();
				if (_this.util.showResult(error) == 401) {
					vm.logout();
				}
			});
		} else {
			this.$router.push({ name: 'Admin Login' });
		}
	},

	methods: {
		logout: function logout() {
			localStorage.clear();
			this.$router.push({ name: 'Admin Login' });
		}
	}
});

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    !_vm.loading
      ? _c(
          "div",
          [
            _c(
              "nav",
              {
                staticClass: "navbar navbar-default navbar-fixed-top",
                attrs: { id: "nav" }
              },
              [
                _c("div", { staticClass: "container-fluid" }, [
                  _vm._m(0),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass: "collapse navbar-collapse",
                      attrs: { id: "myNavbar" }
                    },
                    [
                      _c("ul", { staticClass: "nav navbar-nav" }, [
                        _c(
                          "a",
                          {
                            staticClass: "navbar-brand",
                            attrs: { href: _vm.data.baseURL }
                          },
                          [_vm._v("Voting System")]
                        )
                      ]),
                      _vm._v(" "),
                      _c(
                        "ul",
                        { staticClass: "nav navbar-nav" },
                        [
                          _c(
                            "router-link",
                            {
                              attrs: {
                                to: { name: "Admin Home" },
                                tag: "li",
                                exact: ""
                              }
                            },
                            [
                              _c("a", { attrs: { href: "#" } }, [
                                _vm._v("Home")
                              ])
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "router-link",
                            {
                              attrs: {
                                to: { name: "Manage Position" },
                                tag: "li"
                              }
                            },
                            [
                              _c("a", { attrs: { href: "#" } }, [
                                _vm._v("Manage Position")
                              ])
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "router-link",
                            {
                              attrs: {
                                to: { name: "Manage Partylist" },
                                tag: "li"
                              }
                            },
                            [
                              _c("a", { attrs: { href: "#" } }, [
                                _vm._v("Manage Team Name")
                              ])
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "router-link",
                            {
                              attrs: { to: { name: "Manage Voter" }, tag: "li" }
                            },
                            [
                              _c("a", { attrs: { href: "#" } }, [
                                _vm._v("Manage Voter")
                              ])
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "router-link",
                            {
                              attrs: {
                                to: { name: "Manage Nominee" },
                                tag: "li"
                              }
                            },
                            [
                              _c("a", { attrs: { href: "#" } }, [
                                _vm._v("Manage Candidate")
                              ])
                            ]
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c("ul", { staticClass: "nav navbar-right navbar-nav" }, [
                        _c("li", { staticClass: "dropdown" }, [
                          _c(
                            "a",
                            {
                              staticClass: "dropdown-toggle",
                              attrs: {
                                href: "#",
                                "data-toggle": "dropdown",
                                role: "button",
                                "aria-haspopup": "true",
                                "aria-expanded": "false"
                              }
                            },
                            [
                              _c("span", { staticClass: "fa fa-user" }),
                              _vm._v(" " + _vm._s(_vm.data.user.name) + " "),
                              _c("span", { staticClass: "caret" })
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "ul",
                            { staticClass: "dropdown-menu" },
                            [
                              _c(
                                "router-link",
                                {
                                  attrs: {
                                    to: { name: "Update Account" },
                                    tag: "li",
                                    exact: ""
                                  }
                                },
                                [
                                  _c("a", { attrs: { href: "#" } }, [
                                    _vm._v("Update Account")
                                  ])
                                ]
                              ),
                              _vm._v(" "),
                              _vm.data.user.id == 1
                                ? _c(
                                    "router-link",
                                    {
                                      attrs: {
                                        to: { name: "Manage Account" },
                                        tag: "li"
                                      }
                                    },
                                    [
                                      _c("a", { attrs: { href: "#" } }, [
                                        _vm._v("Manage Account")
                                      ])
                                    ]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              _c(
                                "li",
                                {
                                  on: {
                                    click: function($event) {
                                      return _vm.logout()
                                    }
                                  }
                                },
                                [_c("a", [_vm._v("Logout")])]
                              )
                            ],
                            1
                          )
                        ])
                      ])
                    ]
                  )
                ])
              ]
            ),
            _vm._v(" "),
            _c("router-view")
          ],
          1
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.loading
      ? _c("div", { staticClass: "container" }, [_vm._m(1)])
      : _vm._e()
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "navbar-header" }, [
      _c(
        "button",
        {
          staticClass: "navbar-toggle",
          attrs: {
            type: "button",
            "data-toggle": "collapse",
            "data-target": "#myNavbar"
          }
        },
        [
          _c("span", { staticClass: "icon-bar" }),
          _vm._v(" "),
          _c("span", { staticClass: "icon-bar" }),
          _vm._v(" "),
          _c("span", { staticClass: "icon-bar" })
        ]
      ),
      _vm._v(" "),
      _c("img", {
        attrs: { src: "/logo.png", contain: "", height: "40px", width: "40px" }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "jumbotron" }, [
      _c("h1", [
        _vm._v("Loading "),
        _c("i", { staticClass: "fa fa-refresh fa-spin" })
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5bbb2a06", module.exports)
  }
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(56)
/* template */
var __vue_template__ = __webpack_require__(57)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/home/final.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-22ef532b", Component.options)
  } else {
    hotAPI.reload("data-v-22ef532b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			nominees: [],
			results: [],
			partylists: [],
			positions: []
		};
	},

	methods: {
		getNominee: function getNominee(id) {
			var nominees = this.nominees;
			for (var i in nominees) {
				if (id == nominees[i]['id']) return nominees[i];
			}return {};
		},

		getPartylist: function getPartylist(id) {
			var partylists = this.partylists;
			for (var i in partylists) {
				if (id == partylists[i]['id']) return partylists[i]['name'];
			}return 'No Partylist';
		}
	},

	created: function created() {
		this.util.notify('Loading please wait...', 'loading');
		var vm = this;
		axios.get(config.API + 'election/result/' + this.election_id).then(function (response) {
			$.notifyClose();
			vm.nominees = response.data.nominee;
			vm.results = response.data.result;
			vm.partylists = response.data.partylist;
			vm.positions = response.data.position;
		}).catch(function (error) {
			$.notifyClose();
			vm.util.showResult(error, 'error');
		});
	},

	computed: {
		election_id: function election_id() {
			return this.$route.params.election_id;
		},

		no_votes: function no_votes() {
			var nominees = this.nominees;
			var results = this.results;
			var no_votes = [];
			for (var i in nominees) {
				var hasvote = false;
				for (var y in results) {
					if (results[y]['nominee_id'] == nominees[i]['id']) hasvote = true;
				}
				if (!hasvote) no_votes.push(nominees[i]);
			}
			return no_votes;
		}

	}
});

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "container" }, [
    _c("div", { staticClass: "row" }, [
      _c(
        "div",
        { staticClass: "panel panel-default col-md-12" },
        _vm._l(_vm.positions, function(position) {
          return _c("div", [
            _c("h5", [_vm._v(_vm._s(position.name))]),
            _vm._v(" "),
            _c("div", { staticClass: "table-responsive" }, [
              _c(
                "table",
                { staticClass: "table table-striped table-condensed" },
                [
                  _vm._m(0, true),
                  _vm._v(" "),
                  _c(
                    "tbody",
                    [
                      _vm._l(_vm.results, function(result) {
                        return result.position_id == position.id
                          ? _c("tr", [
                              _c("td", [
                                _vm._v(
                                  _vm._s(
                                    _vm.getNominee(result.nominee_id)[
                                      "student_id"
                                    ]
                                  )
                                )
                              ]),
                              _vm._v(" "),
                              _c("td", [
                                _vm._v(
                                  _vm._s(
                                    _vm.getNominee(result.nominee_id)["name"]
                                  )
                                )
                              ]),
                              _vm._v(" "),
                              _c("td", [
                                _vm._v(
                                  _vm._s(
                                    _vm.getPartylist(
                                      _vm.getNominee(result.nominee_id)[
                                        "partylist_id"
                                      ]
                                    )
                                  )
                                )
                              ]),
                              _vm._v(" "),
                              _c("td", [
                                _vm._v(
                                  _vm._s(
                                    _vm.getNominee(result.nominee_id)["course"]
                                  )
                                )
                              ]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(result.votes))])
                            ])
                          : _vm._e()
                      }),
                      _vm._v(" "),
                      _vm._l(_vm.no_votes, function(no_vote) {
                        return no_vote.position_id == position.id
                          ? _c("tr", [
                              _c("td", [_vm._v(_vm._s(no_vote.student_id))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(no_vote.name))]),
                              _vm._v(" "),
                              _c("td", [
                                _vm._v(
                                  _vm._s(_vm.getPartylist(no_vote.partylist_id))
                                )
                              ]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(no_vote.course))]),
                              _vm._v(" "),
                              _c("td", [_vm._v("0")])
                            ])
                          : _vm._e()
                      })
                    ],
                    2
                  )
                ]
              )
            ]),
            _vm._v(" "),
            _c("hr")
          ])
        }),
        0
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", [
        _c("th", { attrs: { width: "12%" } }, [_vm._v("Civ HR Control nr")]),
        _vm._v(" "),
        _c("th", { attrs: { width: "30%" } }, [_vm._v("Name")]),
        _vm._v(" "),
        _c("th", { attrs: { width: "20%" } }, [_vm._v("Partylist")]),
        _vm._v(" "),
        _c("th", { attrs: { width: "20%" } }, [_vm._v("Unit")]),
        _vm._v(" "),
        _c("th", { attrs: { width: "20%" } }, [_vm._v("Votes")])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-22ef532b", module.exports)
  }
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(59)
/* template */
var __vue_template__ = __webpack_require__(60)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/home/home.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-28af438c", Component.options)
  } else {
    hotAPI.reload("data-v-28af438c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	created: function created() {
		this.util.setTitle('Voting System - Manage Election');
	}
});

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "container col-md-8 col-md-offset-2" },
    [_c("h4", [_vm._v("Manage Election")]), _vm._v(" "), _c("router-view")],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-28af438c", module.exports)
  }
}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(62)
/* template */
var __vue_template__ = __webpack_require__(63)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/home/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-44bea6f2", Component.options)
  } else {
    hotAPI.reload("data-v-44bea6f2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			start_date: null
		};
	},
	created: function created() {
		this.refreshElection();
		var vm = this;
		setInterval(function () {
			vm.start_date = moment(vm.data.election.start).fromNow();
		}, 1000);
	},

	methods: {

		stop: function stop() {
			var vm = this;
			this.util.hideModal('#stop-election-modal');
			this.util.notify('Stopping Election', 'loading');
			axios.post(config.API + 'election/stop', $('#stop_form').serialize()).then(function (response) {
				$.notifyClose();
				if (vm.util.showResult(response, 'success')) {
					vm.refreshElection();
					vm.data.election = response.data.election;
					vm.data.positions = [];
					vm.data.partylists = [];
					vm.data.voters = [];
					vm.data.nominees = [];
					vm.data.results = [];
				}
			}).catch(function (error) {
				$.notifyClose();
				vm.util.showResult(error, 'error');
			});
		},

		start: function start() {
			var vm = this;
			this.util.hideModal('#start-election-modal');
			this.util.notify('Loading please wait', 'loading');
			axios.post(config.API + 'election/start', $('#start_form').serialize()).then(function (response) {
				$.notifyClose();
				if (vm.util.showResult(response, 'success')) {
					vm.refreshElection();
					vm.data.election = response.data.election;
				}
			}).catch(function (error) {
				$.notifyClose();
				vm.util.showResult(error, 'error');
			});
		},

		refreshElection: function refreshElection() {
			this.util.notify('Refreshing Election', 'loading');
			var vm = this;
			axios.get(config.API + 'election').then(function (response) {
				$.notifyClose();
				vm.data.elections = response.data;
			}).catch(function (error) {
				$.notifyClose();
				vm.util.showResult(error, 'error');
			});
		}
	}
});

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "panel panel-default" }, [
    _c("div", { staticClass: "panel-body" }, [
      _c("h4", [_vm._v(" Recent Elections")]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "form-group" },
        [
          _vm.data.election.status == 1
            ? _c(
                "button",
                {
                  staticClass: "btn btn-success",
                  on: {
                    click: function($event) {
                      return _vm.util.showModal("#start-election-modal")
                    }
                  }
                },
                [_vm._v("Start Election")]
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.data.election.status == 2
            ? _c(
                "router-link",
                {
                  staticClass: "btn btn-info",
                  attrs: { to: { name: "Current Result" } }
                },
                [_vm._v("\r\n\t\t\t\tView Results\r\n\t\t\t")]
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.data.election.status == 2
            ? _c(
                "button",
                {
                  staticClass: "btn btn-danger",
                  on: {
                    click: function($event) {
                      return _vm.util.showModal("#stop-election-modal")
                    }
                  }
                },
                [_vm._v("End Election")]
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.data.election.status == 2
            ? _c("label", [
                _vm._v("Election has Started " + _vm._s(_vm.start_date))
              ])
            : _vm._e()
        ],
        1
      ),
      _vm._v(" "),
      _c("div", { staticClass: "table-responsive" }, [
        _c("table", { staticClass: "table table-hover" }, [
          _vm._m(0),
          _vm._v(" "),
          _c(
            "tbody",
            [
              _vm._l(_vm.data.elections, function(election) {
                return _c("tr", [
                  _c("td", [_vm._v(_vm._s(election.id))]),
                  _vm._v(" "),
                  _c("td", [_vm._v(_vm._s(election.name))]),
                  _vm._v(" "),
                  _c("td", [_vm._v(_vm._s(election.start))]),
                  _vm._v(" "),
                  _c("td", [_vm._v(_vm._s(election.end))]),
                  _vm._v(" "),
                  _c(
                    "td",
                    [
                      _c(
                        "router-link",
                        {
                          staticClass: "btn btn-info",
                          attrs: {
                            to: {
                              name: "Election Result",
                              params: { election_id: election.id }
                            }
                          }
                        },
                        [_vm._v("View Result")]
                      )
                    ],
                    1
                  )
                ])
              }),
              _vm._v(" "),
              _vm.data.elections.length < 1
                ? _c("tr", [
                    _c("td", { attrs: { colspan: "5" } }, [
                      _vm._v("No elections yet")
                    ])
                  ])
                : _vm._e()
            ],
            2
          )
        ])
      ]),
      _vm._v(" "),
      _c(
        "form",
        {
          attrs: { id: "start_form" },
          on: {
            submit: function($event) {
              $event.preventDefault()
              return _vm.start($event)
            }
          }
        },
        [
          _c(
            "modal",
            { attrs: { id: "start-election-modal" } },
            [
              _c("modal-header", [_vm._v("Start Election")]),
              _vm._v(" "),
              _c("modal-body", [
                _c("div", { staticClass: "form-group" }, [
                  _c("label", { attrs: { for: "name" } }, [
                    _vm._v("Election Name")
                  ]),
                  _vm._v(" "),
                  _c("input", {
                    staticClass: "form-control",
                    attrs: {
                      type: "text",
                      name: "name",
                      placeholder: "(Optional)"
                    }
                  })
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "form-group" }, [
                  _c("label", { attrs: { for: "password" } }, [
                    _vm._v("Confirm Password")
                  ]),
                  _vm._v(" "),
                  _c("input", {
                    staticClass: "form-control",
                    attrs: { type: "password", name: "password", required: "" }
                  })
                ])
              ]),
              _vm._v(" "),
              _c("modal-footer", [
                _c("input", {
                  staticClass: "btn btn-info",
                  attrs: { type: "submit", value: "Start" }
                }),
                _vm._v(" "),
                _c("input", {
                  staticClass: "btn btn-default",
                  attrs: {
                    type: "button",
                    "data-dismiss": "modal",
                    value: "Cancel"
                  }
                })
              ])
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "form",
        {
          attrs: { id: "stop_form" },
          on: {
            submit: function($event) {
              $event.preventDefault()
              return _vm.stop($event)
            }
          }
        },
        [
          _c(
            "modal",
            { attrs: { id: "stop-election-modal" } },
            [
              _c("modal-header", [_vm._v("Stop Election")]),
              _vm._v(" "),
              _c("modal-body", [
                _c("div", { staticClass: "form-group" }, [
                  _c("label", { attrs: { for: "name" } }, [
                    _vm._v("Election Name")
                  ]),
                  _vm._v(" "),
                  _c("input", {
                    staticClass: "form-control",
                    attrs: {
                      type: "text",
                      name: "name",
                      placeholder: "(Optional)"
                    },
                    domProps: { value: _vm.data.election.name }
                  })
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "form-group" }, [
                  _c("label", { attrs: { for: "password" } }, [
                    _vm._v("Confirm Password")
                  ]),
                  _vm._v(" "),
                  _c("input", {
                    staticClass: "form-control",
                    attrs: { type: "password", name: "password", required: "" }
                  })
                ])
              ]),
              _vm._v(" "),
              _c("modal-footer", [
                _c("input", {
                  staticClass: "btn btn-danger",
                  attrs: { type: "submit", value: "Stop Election" }
                }),
                _vm._v(" "),
                _c("input", {
                  staticClass: "btn btn-default",
                  attrs: {
                    type: "button",
                    "data-dismiss": "modal",
                    value: "Cancel"
                  }
                })
              ])
            ],
            1
          )
        ],
        1
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", [
        _c("th", [_vm._v("ID")]),
        _vm._v(" "),
        _c("th", [_vm._v("Election Name")]),
        _vm._v(" "),
        _c("th", [_vm._v("Election Start")]),
        _vm._v(" "),
        _c("th", [_vm._v("Election End")]),
        _vm._v(" "),
        _c("th", [_vm._v("View")])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-44bea6f2", module.exports)
  }
}

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(65)
}
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(67)
/* template */
var __vue_template__ = __webpack_require__(68)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/home/result.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-eb124490", Component.options)
  } else {
    hotAPI.reload("data-v-eb124490", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(66);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("2f70817c", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../../node_modules/css-loader/index.js!../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-eb124490\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./result.vue", function() {
     var newContent = require("!!../../../../../../../node_modules/css-loader/index.js!../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-eb124490\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./result.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.inline {\r\n    display: inline-block;\r\n    vertical-align: middle;\n}\r\n", ""]);

// exports


/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({

	created: function created() {
		console.log(this);
		this.refreshNominees();
		this.$nextTick(function () {
			this.initChart();
		});
	},

	watch: {
		position_id: function position_id() {
			this.initChart();
		}
	},

	methods: {
		refreshNominees: function refreshNominees() {
			var vm = this;
			this.util.notify('Refreshing results', 'loading');
			axios.get(config.API + 'nominee').then(function (response) {
				$.notifyClose();
				vm.data.nominees = response.data;
				vm.refreshResults();
			}).catch(function (error) {
				$.notifyClose();
				vm.util.showResult(error);
			});
		},

		refreshResults: function refreshResults() {
			var vm = this;
			this.util.notify('Refreshing results', 'loading');
			axios.get(config.API + 'election/results').then(function (response) {
				$.notifyClose();
				vm.data.results = response.data;
				vm.data.last_update = new Date();
				vm.initChart();
			}).catch(function (error) {
				$.notifyClose();
				vm.util.showResult(error);
			});
		},

		initChart: function initChart() {
			var ticks = [];
			var tick = 0;
			var data = [];
			var nominees = this.data.nominees;
			for (var i in nominees) {
				if (nominees[i]['position_id'] == this.position_id) {
					ticks.push([tick++, nominees[i]['name']]);
				}
			}
			$.plot($('#barchart'), this.bars, {
				series: {
					bars: {
						show: true,
						barWidth: 0.6,
						align: "center",
						fill: 0.75,
						numbers: { show: true,
							Formatter: function Formatter(label, series) {
								var percent = Math.round(series.percent);
								var number = series.data[0][1];
								return '</b>:&nbsp;' + number;
							}
						}
					}
				},
				xaxis: {
					ticks: ticks,
					mode: "categories",
					showTicks: false,
					gridLines: false,
					panRange: [0, null]
				},
				yaxis: {
					minTickSize: 1,
					tickDecimals: 0
				},
				legend: {
					show: true,
					labelFormatter: function labelFormatter(label, series) {
						var percent = Math.round(series.percent);
						var number = series.data[0][1];
						return '&nbsp;<b>' + label + '</b>:&nbsp;' + number;
					}
				},
				valueLabels: {
					show: true
				}

			});
		},

		getPosition: function getPosition(id) {
			var positions = this.data.positions;
			for (var i in positions) {
				if (id == positions[i]['id']) return positions[i]['name'];
			}return '';
		},

		getNominee: function getNominee(id) {
			var nominees = this.data.nominees;
			for (var i in nominees) {
				if (id == nominees[i]['id']) return nominees[i]['name'];
			}return '';
		},

		getVotes: function getVotes(id) {
			var results = this.data.results;
			for (var i in results) {
				if (results[i]['nominee_id'] == id) return results[i]['votes'];
			}
			return 0;
		}
	},

	computed: {
		last_update: function last_update() {
			var x = this.data.last_update;
			return x.toDateString() + ' ' + x.toLocaleTimeString();
		},

		position_id: function position_id() {
			return this.$route.query.position_id ? this.$route.query.position_id : this.data.positions[0]['id'];
		},

		datas: function datas() {
			//var results =
			var data = [];
			var nominees = this.data.nominees;
			for (var i in nominees) {
				if (nominees[i]['position_id'] == this.position_id) {
					var row = [];
					row['label'] = nominees[i]['name'];
					row['data'] = [[1, this.getVotes(nominees[i]['id'])]];
					data.push(row);
				}
			}
			return data;
		},

		bars: function bars() {
			//var results =
			var data = [];
			var inc = 0;
			var tick = 0;
			var nominees = this.data.nominees;
			for (var i in nominees) {
				if (nominees[i]['position_id'] == this.position_id) {
					var row = [];
					row['label'] = nominees[i]['name'];
					row['data'] = [[inc++, this.getVotes(nominees[i]['id'])]];
					row['ticks'] = [[tick++, nominees[i]['name']]];
					data.push(row);
				}
			}
			return data;
		},
		tickss: function tickss() {
			//var results =
			var data = [];
			var tick = 0;
			var nominees = this.data.nominees;
			for (var i in nominees) {
				if (nominees[i]['position_id'] == this.position_id) {
					var row = [];
					row['ticks'] = [[tick++, nominees[i]['name']]];
					data.push(row);
				}
			}
			return data;
		}
	}
});

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "row" }, [
    _c("div", { staticClass: "col-md-4" }, [
      _c("h4", [_vm._v("Positions")]),
      _c("hr"),
      _vm._v(" "),
      _c(
        "ul",
        { staticClass: "list-group" },
        [
          _vm._l(_vm.data.positions, function(position) {
            return _c(
              "router-link",
              {
                key: position.id,
                staticClass: "list-group-item",
                class: { active: position.id == _vm.position_id },
                attrs: {
                  tag: "li",
                  to: { query: { position_id: position.id } },
                  exact: "",
                  replace: ""
                }
              },
              [_vm._v("\r\n\t\t\t\t" + _vm._s(position.name) + "\r\n\t\t\t")]
            )
          }),
          _vm._v(" "),
          _c(
            "li",
            { staticClass: "list-group-item" },
            [
              _c("center", [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-info",
                    on: {
                      click: function($event) {
                        return _vm.refreshNominees()
                      }
                    }
                  },
                  [
                    _vm._v("\r\n\t\t\t\t\t\tRefresh results "),
                    _c("i", { staticClass: "fa fa-refresh" })
                  ]
                )
              ])
            ],
            1
          )
        ],
        2
      )
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "col-md-8" }, [
      _c("h4", [_vm._v("Results")]),
      _c("hr"),
      _vm._v(" "),
      _c("div", { staticClass: "panel panel-default" }, [
        _c("div", { staticClass: "panel-heading" }, [
          _vm._v(
            _vm._s(_vm.getPosition(_vm.position_id)) +
              " - Results as of : " +
              _vm._s(_vm.last_update)
          )
        ]),
        _vm._v(" "),
        _vm._m(0)
      ])
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "panel-body" }, [
      _c("div", {
        staticStyle: { height: "500px", width: "600px" },
        attrs: { id: "barchart" }
      })
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-eb124490", module.exports)
  }
}

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(70)
/* template */
var __vue_template__ = __webpack_require__(71)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/position/position.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5ec3d30c", Component.options)
  } else {
    hotAPI.reload("data-v-5ec3d30c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	created: function created() {
		this.util.setTitle('Voting System - Manage Position');
	}
});

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "container col-md-8 col-md-offset-2" },
    [_c("h4", [_vm._v("Manage Position")]), _vm._v(" "), _c("router-view")],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5ec3d30c", module.exports)
  }
}

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(73)
/* template */
var __vue_template__ = __webpack_require__(74)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/position/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0a188dd1", Component.options)
  } else {
    hotAPI.reload("data-v-0a188dd1", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			id: 0
		};
	},

	created: function created() {
		if (this.$route.query.refresh) {
			this.refreshPosition();
			this.$router.replace({ name: 'Manage Position' });
		}
	},

	methods: {
		refreshPosition: function refreshPosition() {
			var vm = this;
			this.util.notify('Refreshing Position', 'loading');
			axios.get(config.API + 'position').then(function (response) {
				console.log(response);
				$.notifyClose();
				vm.data.positions = response.data;
			}).catch(function (error) {
				$.notifyClose();
				vm.util.showResult(error);
			});
		},

		initDatatable: function initDatatable() {
			var vm = this;
			$('#position_table').DataTable({
				destroy: true,
				searching: false,
				info: false,
				autoWidth: false,
				dom: 'Bfrtip'
			});
		},

		edit: function edit(i) {
			var vm = this;
			this.data.position = this.data.positions[i];
			this.$router.push({ name: 'Edit Position', params: { id: vm.data.position.id } });
		},

		deletePosition: function deletePosition() {
			var vm = this;
			this.util.notify('Deleting position', 'loading');
			this.util.hideModal('#delete-position-modal');
			axios.delete(config.API + 'position/' + this.id).then(function (response) {
				$.notifyClose();
				if (vm.util.showResult(response, 'success')) vm.refreshPosition();
			}).catch(function (error) {
				$.notifyClose();
				vm.util.showResult(error);
			});
		}
	}
});

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("div", { staticClass: "panel panel-default" }, [
        _c("div", { staticClass: "panel-body" }, [
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c(
                "router-link",
                {
                  staticClass: "btn btn-success",
                  attrs: { to: { name: "Add Position" } }
                },
                [
                  _c("i", { staticClass: "fa fa-plus" }),
                  _vm._v(" Add Position\r\n\t\t\t")
                ]
              ),
              _vm._v(" "),
              _c(
                "button",
                {
                  staticClass: "btn btn-default",
                  on: {
                    click: function($event) {
                      return _vm.refreshPosition()
                    }
                  }
                },
                [
                  _c("i", { staticClass: "fa fa-refresh" }),
                  _vm._v(" Refresh Position\r\n\t\t\t")
                ]
              )
            ],
            1
          ),
          _vm._v(" "),
          _c("div", { staticClass: "table-responsive" }, [
            _c(
              "table",
              {
                staticClass: "table table-hover",
                attrs: { id: "position_table" }
              },
              [
                _vm._m(0),
                _vm._v(" "),
                _c(
                  "tbody",
                  [
                    _vm._l(_vm.data.positions, function(position, i) {
                      return _c("tr", [
                        _c("td", [_vm._v(_vm._s(position.id))]),
                        _vm._v(" "),
                        _c("td", [_vm._v(_vm._s(position.name))]),
                        _vm._v(" "),
                        _c("td", [
                          _c(
                            "button",
                            {
                              staticClass: "btn btn-info",
                              on: {
                                click: function($event) {
                                  return _vm.edit(i)
                                }
                              }
                            },
                            [
                              _c("i", { staticClass: "fa fa-edit" }),
                              _vm._v(" Edit\r\n\t\t\t\t\t\t\t")
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "button",
                            {
                              staticClass: "btn btn-danger",
                              on: {
                                click: function($event) {
                                  _vm.util.showModal("#delete-position-modal")
                                  _vm.id = position.id
                                }
                              }
                            },
                            [
                              _c("i", { staticClass: "fa fa-trash" }),
                              _vm._v(" Delete\r\n\t\t\t\t\t\t\t")
                            ]
                          )
                        ])
                      ])
                    }),
                    _vm._v(" "),
                    _vm.data.positions.length < 1
                      ? _c("tr", [
                          _c("td", { attrs: { colspan: "3" } }, [
                            _vm._v("No Positions")
                          ])
                        ])
                      : _vm._e()
                  ],
                  2
                )
              ]
            )
          ])
        ])
      ]),
      _vm._v(" "),
      _c(
        "modal",
        { attrs: { id: "delete-position-modal" } },
        [
          _c("modal-header", [_vm._v("Delete Position")]),
          _vm._v(" "),
          _c("modal-body", [
            _c("h2", [_vm._v("Are you sure to delete Position?")])
          ]),
          _vm._v(" "),
          _c("modal-footer", [
            _c(
              "button",
              {
                staticClass: "btn btn-danger",
                on: {
                  click: function($event) {
                    return _vm.deletePosition()
                  }
                }
              },
              [_vm._v("Delete")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticClass: "btn btn-default",
                on: {
                  click: function($event) {
                    return _vm.util.hideModal("#delete-position-modal")
                  }
                }
              },
              [_vm._v("Cancel")]
            )
          ])
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", [
        _c("th", [_vm._v("ID")]),
        _vm._v(" "),
        _c("th", [_vm._v("Name")]),
        _vm._v(" "),
        _c("th", [_vm._v("Action")])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0a188dd1", module.exports)
  }
}

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(76)
/* template */
var __vue_template__ = __webpack_require__(77)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/position/add.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e6b3e840", Component.options)
  } else {
    hotAPI.reload("data-v-e6b3e840", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			loading: false
		};
	},
	methods: {
		add: function add() {
			if (this.loading) return;
			this.loading = true;
			var vm = this;
			this.util.notify('Adding Position', 'loading');
			axios.post(config.API + 'position', $('#add-form').serialize()).then(function (response) {
				$.notifyClose();
				vm.loading = false;
				if (vm.util.showResult(response, 'success')) {
					vm.$router.push({ name: 'Manage Position', query: { refresh: true } });
				}
			}).catch(function (error) {
				$.notifyClose();
				vm.loading = false;
				vm.util.showResult(error);
			});
		}
	}
});

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "panel panel-default" }, [
    _c("div", { staticClass: "panel-body" }, [
      _c("h4", [_vm._v("Add Position")]),
      _vm._v(" "),
      _c(
        "form",
        {
          attrs: { id: "add-form" },
          on: {
            submit: function($event) {
              $event.preventDefault()
              return _vm.add()
            }
          }
        },
        [
          _vm._m(0),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c(
                "button",
                { staticClass: "btn btn-success", attrs: { type: "submit" } },
                [_vm._v("Submit")]
              ),
              _vm._v(" "),
              _c(
                "router-link",
                {
                  staticClass: "btn btn-default",
                  attrs: { to: { name: "Manage Position" } }
                },
                [_vm._v("Back")]
              )
            ],
            1
          )
        ]
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "name" } }, [_vm._v("Name")]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "text", name: "name", required: "" }
      })
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-e6b3e840", module.exports)
  }
}

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(79)
/* template */
var __vue_template__ = __webpack_require__(80)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/position/edit.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-983bd14a", Component.options)
  } else {
    hotAPI.reload("data-v-983bd14a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			loading: false
		};
	},

	created: function created() {
		if (!this.data.position.id) {
			this.$router.push({ name: 'Manage Position' });
		}
	},

	methods: {
		edit: function edit() {
			if (this.loading) return;
			this.loading = true;
			var vm = this;
			this.util.notify('Updating position', 'loading');
			axios.put(config.API + 'position/' + this.data.position.id, $('#edit-form').serialize()).then(function (response) {
				vm.loading = false;
				$.notifyClose();
				if (vm.util.showResult(response, 'success')) {
					vm.$router.push({ name: 'Manage Position', query: { refresh: true } });
				}
			}).catch(function (error) {
				$.notifyClose();
				vm.loading = false;
				vm.util.showResult(error);
			});
		}
	}
});

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "panel panel-default" }, [
    _c("div", { staticClass: "panel-body" }, [
      _c("h4", [_vm._v("Edit Position")]),
      _vm._v(" "),
      _c(
        "form",
        {
          attrs: { id: "edit-form" },
          on: {
            submit: function($event) {
              $event.preventDefault()
              return _vm.edit()
            }
          }
        },
        [
          _c("div", { staticClass: "form-group" }, [
            _c("label", { attrs: { for: "name" } }, [_vm._v("Name")]),
            _vm._v(" "),
            _c("input", {
              staticClass: "form-control",
              attrs: { type: "text", name: "name", required: "" },
              domProps: { value: _vm.data.position.name }
            })
          ]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("input", {
                staticClass: "btn btn-success",
                attrs: { type: "submit", value: "Submit" }
              }),
              _vm._v(" "),
              _c(
                "router-link",
                {
                  staticClass: "btn btn-default",
                  attrs: { to: { name: "Manage Position" } }
                },
                [_vm._v("Back")]
              )
            ],
            1
          )
        ]
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-983bd14a", module.exports)
  }
}

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(82)
/* template */
var __vue_template__ = __webpack_require__(83)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/partylist/partylist.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7beeba24", Component.options)
  } else {
    hotAPI.reload("data-v-7beeba24", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	created: function created() {
		this.util.setTitle('Voting System - Manage Partylist');
	}
});

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "container col-md-8 col-md-offset-2" },
    [_c("h4", [_vm._v("Manage Team Name")]), _vm._v(" "), _c("router-view")],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7beeba24", module.exports)
  }
}

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(85)
/* template */
var __vue_template__ = __webpack_require__(86)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/partylist/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-70f7e772", Component.options)
  } else {
    hotAPI.reload("data-v-70f7e772", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			id: 0
		};
	},

	created: function created() {
		if (this.$route.query.refresh) {
			this.refreshPartylist();
			this.$router.replace({ name: 'Manage Partylist' });
		}
	},

	methods: {
		refreshPartylist: function refreshPartylist() {
			var vm = this;
			this.util.notify('Refreshing Team Name', 'loading');
			axios.get(config.API + 'partylist').then(function (response) {
				console.log(response);
				$.notifyClose();
				vm.data.partylists = response.data;
			}).catch(function (error) {
				$.notifyClose();
				vm.util.showResult(error);
			});
		},

		edit: function edit(i) {
			var vm = this;
			this.data.partylist = this.data.partylists[i];
			this.$router.push({ name: 'Edit Partylist', params: { id: vm.data.partylist.id } });
		},

		deletePartylist: function deletePartylist() {
			var vm = this;
			this.util.notify('Deleting Team Name', 'loading');
			this.util.hideModal('#delete-partylist-modal');
			axios.delete(config.API + 'partylist/' + this.id).then(function (response) {
				$.notifyClose();
				if (vm.util.showResult(response, 'success')) vm.refreshPartylist();
			}).catch(function (error) {
				$.notifyClose();
				vm.util.showResult(error);
			});
		}
	}
});

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("div", { staticClass: "panel panel-default" }, [
        _c("div", { staticClass: "panel-body" }, [
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c(
                "router-link",
                {
                  staticClass: "btn btn-success",
                  attrs: { to: { name: "Add Partylist" } }
                },
                [
                  _c("i", { staticClass: "fa fa-plus" }),
                  _vm._v(" Add Team Name\r\n\t\t\t")
                ]
              ),
              _vm._v(" "),
              _c(
                "button",
                {
                  staticClass: "btn btn-default",
                  on: {
                    click: function($event) {
                      return _vm.refreshPartylist()
                    }
                  }
                },
                [
                  _c("i", { staticClass: "fa fa-refresh" }),
                  _vm._v(" Refresh Team Name\r\n\t\t\t")
                ]
              )
            ],
            1
          ),
          _vm._v(" "),
          _c("div", { staticClass: "table-responsive" }, [
            _c(
              "table",
              {
                staticClass: "table table-hover",
                attrs: { id: "partylist_table" }
              },
              [
                _vm._m(0),
                _vm._v(" "),
                _c(
                  "tbody",
                  [
                    _vm._l(_vm.data.partylists, function(partylist, i) {
                      return _c("tr", [
                        _c("td", [_vm._v(_vm._s(partylist.id))]),
                        _vm._v(" "),
                        _c("td", [_vm._v(_vm._s(partylist.name))]),
                        _vm._v(" "),
                        _c("td", [
                          _c(
                            "button",
                            {
                              staticClass: "btn btn-info",
                              on: {
                                click: function($event) {
                                  return _vm.edit(i)
                                }
                              }
                            },
                            [
                              _c("i", { staticClass: "fa fa-edit" }),
                              _vm._v(" Edit\r\n\t\t\t\t\t\t\t")
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "button",
                            {
                              staticClass: "btn btn-danger",
                              on: {
                                click: function($event) {
                                  _vm.util.showModal("#delete-partylist-modal")
                                  _vm.id = partylist.id
                                }
                              }
                            },
                            [
                              _c("i", { staticClass: "fa fa-trash" }),
                              _vm._v(" Delete\r\n\t\t\t\t\t\t\t")
                            ]
                          )
                        ])
                      ])
                    }),
                    _vm._v(" "),
                    _vm.data.partylists.length < 1
                      ? _c("tr", [
                          _c("td", { attrs: { colspan: "3" } }, [
                            _vm._v("No Team Name")
                          ])
                        ])
                      : _vm._e()
                  ],
                  2
                )
              ]
            )
          ])
        ])
      ]),
      _vm._v(" "),
      _c(
        "modal",
        { attrs: { id: "delete-partylist-modal" } },
        [
          _c("modal-header", [_vm._v("Delete Team Name")]),
          _vm._v(" "),
          _c("modal-body", [
            _c("h2", [_vm._v("Are you sure to delete Team Name?")])
          ]),
          _vm._v(" "),
          _c("modal-footer", [
            _c(
              "button",
              {
                staticClass: "btn btn-danger",
                on: {
                  click: function($event) {
                    return _vm.deletePartylist()
                  }
                }
              },
              [_vm._v("Delete")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticClass: "btn btn-default",
                on: {
                  click: function($event) {
                    return _vm.util.hideModal("#delete-partylist-modal")
                  }
                }
              },
              [_vm._v("Cancel")]
            )
          ])
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", [
        _c("th", [_vm._v("ID")]),
        _vm._v(" "),
        _c("th", [_vm._v("Name")]),
        _vm._v(" "),
        _c("th", [_vm._v("Action")])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-70f7e772", module.exports)
  }
}

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(88)
/* template */
var __vue_template__ = __webpack_require__(89)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/partylist/add.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-252159c1", Component.options)
  } else {
    hotAPI.reload("data-v-252159c1", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			loading: false
		};
	},
	methods: {
		add: function add() {
			if (this.loading) return;
			this.loading = true;
			var vm = this;
			this.util.notify('Adding Team Name', 'loading');
			axios.post(config.API + 'partylist', $('#add-form').serialize()).then(function (response) {
				$.notifyClose();
				vm.loading = false;
				if (vm.util.showResult(response, 'success')) {
					vm.$router.push({ name: 'Manage Partylist', query: { refresh: true } });
				}
			}).catch(function (error) {
				$.notifyClose();
				vm.loading = false;
				vm.util.showResult(error);
			});
		}
	}
});

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "panel panel-default" }, [
    _c("div", { staticClass: "panel-body" }, [
      _c("h4", [_vm._v("Add Team Name")]),
      _vm._v(" "),
      _c(
        "form",
        {
          attrs: { id: "add-form" },
          on: {
            submit: function($event) {
              $event.preventDefault()
              return _vm.add()
            }
          }
        },
        [
          _vm._m(0),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c(
                "button",
                { staticClass: "btn btn-success", attrs: { type: "submit" } },
                [_vm._v("Submit")]
              ),
              _vm._v(" "),
              _c(
                "router-link",
                {
                  staticClass: "btn btn-default",
                  attrs: { to: { name: "Manage Partylist" } }
                },
                [_vm._v("Back")]
              )
            ],
            1
          )
        ]
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "name" } }, [_vm._v("Name")]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "text", name: "name", required: "" }
      })
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-252159c1", module.exports)
  }
}

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(91)
/* template */
var __vue_template__ = __webpack_require__(92)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/partylist/edit.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2ad0859a", Component.options)
  } else {
    hotAPI.reload("data-v-2ad0859a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 91 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			loading: false
		};
	},

	created: function created() {
		if (!this.data.partylist.id) {
			this.$router.push({ name: 'Manage Partylist' });
		}
	},

	methods: {
		edit: function edit() {
			if (this.loading) return;
			this.loading = true;
			var vm = this;
			this.util.notify('Updating Team Name', 'loading');
			axios.put(config.API + 'partylist/' + this.data.partylist.id, $('#edit-form').serialize()).then(function (response) {
				vm.loading = false;
				$.notifyClose();
				if (vm.util.showResult(response, 'success')) {
					vm.$router.push({ name: 'Manage Partylist', query: { refresh: true } });
				}
			}).catch(function (error) {
				$.notifyClose();
				vm.loading = false;
				vm.util.showResult(error);
			});
		}
	}
});

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "panel panel-default" }, [
    _c("div", { staticClass: "panel-body" }, [
      _c("h4", [_vm._v("Edit Team")]),
      _vm._v(" "),
      _c(
        "form",
        {
          attrs: { id: "edit-form" },
          on: {
            submit: function($event) {
              $event.preventDefault()
              return _vm.edit()
            }
          }
        },
        [
          _c("div", { staticClass: "form-group" }, [
            _c("label", { attrs: { for: "name" } }, [_vm._v("Name")]),
            _vm._v(" "),
            _c("input", {
              staticClass: "form-control",
              attrs: { type: "text", name: "name", required: "" },
              domProps: { value: _vm.data.partylist.name }
            })
          ]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("input", {
                staticClass: "btn btn-success",
                attrs: { type: "submit", value: "Submit" }
              }),
              _vm._v(" "),
              _c(
                "router-link",
                {
                  staticClass: "btn btn-default",
                  attrs: { to: { name: "Manage Partylist" } }
                },
                [_vm._v("Back")]
              )
            ],
            1
          )
        ]
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-2ad0859a", module.exports)
  }
}

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(94)
/* template */
var __vue_template__ = __webpack_require__(95)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/voter/voter.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0a7f45a8", Component.options)
  } else {
    hotAPI.reload("data-v-0a7f45a8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	created: function created() {
		this.util.setTitle('Voting System - Manage Voters');
	}
});

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "container col-md-8 col-md-offset-2" },
    [_c("h4", [_vm._v("Manage Voters")]), _vm._v(" "), _c("router-view")],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0a7f45a8", module.exports)
  }
}

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(97)
/* template */
var __vue_template__ = __webpack_require__(98)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/voter/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-85533394", Component.options)
  } else {
    hotAPI.reload("data-v-85533394", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 97 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _methods;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			id: 0
		};
		search: '';
	},

	created: function created() {
		this.refreshVoter();
		search: '';
	},

	methods: (_methods = {

		edit: function edit() {
			this.data.push({
				name: '',
				student_id: '',
				course: '',
				election_id: '',
				otp: ''
			});
		},

		searchit: function searchit() {
			this.searchdata(this.search);
		},


		searchdata: function searchdata(val) {
			var _this = this;

			axios.get(config.API + 'voter/search/' + val).then(function (res) {
				_this.data.voters.data = res.data;
				$.notifyClose();
			});
		},

		refreshVoter: function refreshVoter() {
			var vm = this;
			this.util.notify('Refreshing Voter', 'loading');
			axios.get(config.API + 'voter?page=' + this.current_page).then(function (response) {

				$.notifyClose();
				vm.data.voters = response.data;
			}).catch(function (error) {
				$.notifyClose();
				vm.util.showResult(error);
			});
		}

	}, _defineProperty(_methods, 'edit', function edit(i) {
		var vm = this;
		this.data.voter = this.data.voters.data[i];
		this.$router.push({ name: 'Edit Voter', params: { id: vm.data.voter.id } });
	}), _defineProperty(_methods, 'deleteVoter', function deleteVoter() {
		var vm = this;
		this.util.notify('Deleting voter', 'loading');
		this.util.hideModal('#delete-voter-modal');
		axios.delete(config.API + 'voter/' + this.id).then(function (response) {
			$.notifyClose();
			if (vm.util.showResult(response, 'success')) vm.refreshVoter();
		}).catch(function (error) {
			$.notifyClose();
			vm.util.showResult(error);
		});
	}), _methods),

	watch: {
		'$route.query.page': function $routeQueryPage() {
			$.notifyClose();
			this.refreshVoter();
		}
	},

	computed: {
		pages: function pages() {
			var pages = [];
			if (this.data.voters.last_page) for (var i = 1; i <= this.data.voters.last_page; i++) {
				var x = {};
				x['page'] = i;
				pages.push(x);
			}
			return pages;
		},

		current_page: function current_page() {
			return this.$route.query.page ? this.$route.query.page : 1;
		}
	}
});

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("div", { staticClass: "panel panel-default" }, [
        _c("div", { staticClass: "panel-body" }, [
          _c(
            "div",
            {
              staticClass: "form-group",
              staticStyle: { display: "inline-block" }
            },
            [
              _c(
                "router-link",
                {
                  staticClass: "btn btn-success",
                  attrs: { to: { name: "Add Voter" } }
                },
                [
                  _c("i", { staticClass: "fa fa-plus" }),
                  _vm._v(" Add Voter\r\n\t\t\t")
                ]
              ),
              _vm._v(" "),
              _c(
                "button",
                {
                  staticClass: "btn btn-default",
                  on: {
                    click: function($event) {
                      return _vm.refreshVoter()
                    }
                  }
                },
                [
                  _c("i", { staticClass: "fa fa-refresh" }),
                  _vm._v(" Refresh Voter\r\n\t\t\t")
                ]
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "pull-right",
              staticStyle: { display: "inline-block" }
            },
            [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.search,
                    expression: "search"
                  }
                ],
                staticClass: "form-control",
                staticStyle: { height: "33px" },
                attrs: { type: "search", placeholder: "Search Name or SN..." },
                domProps: { value: _vm.search },
                on: {
                  keyup: _vm.searchit,
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.search = $event.target.value
                  }
                }
              })
            ]
          ),
          _vm._v(" "),
          _c("div", { staticClass: "table-responsive" }, [
            _c(
              "table",
              {
                staticClass: "table table-hover",
                attrs: { id: "position_table" }
              },
              [
                _vm._m(0),
                _vm._v(" "),
                _c(
                  "tbody",
                  [
                    _vm._l(_vm.data.voters.data, function(voter, i) {
                      return _c("tr", { key: voter.id }, [
                        _c("td", [_vm._v(_vm._s(voter.name))]),
                        _vm._v(" "),
                        _c("td", [_vm._v(_vm._s(voter.student_id))]),
                        _vm._v(" "),
                        _c("td", [_vm._v(_vm._s(voter.course))]),
                        _vm._v(" "),
                        _c("td", [
                          _c(
                            "button",
                            {
                              staticClass: "btn btn-info",
                              on: {
                                click: function($event) {
                                  return _vm.edit(i)
                                }
                              }
                            },
                            [
                              _c("i", { staticClass: "fa fa-edit" }),
                              _vm._v(" Edit\r\n\t\t\t\t\t\t\t")
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "button",
                            {
                              staticClass: "btn btn-danger",
                              on: {
                                click: function($event) {
                                  _vm.util.showModal("#delete-voter-modal")
                                  _vm.id = voter.id
                                }
                              }
                            },
                            [
                              _c("i", { staticClass: "fa fa-trash" }),
                              _vm._v(" Delete\r\n\t\t\t\t\t\t\t")
                            ]
                          )
                        ])
                      ])
                    }),
                    _vm._v(" "),
                    _vm.data.voters.data && _vm.data.voters.data.length < 1
                      ? _c("tr", [
                          _c("td", { attrs: { colspan: "3" } }, [
                            _vm._v("No Voters")
                          ])
                        ])
                      : _vm._e()
                  ],
                  2
                )
              ]
            )
          ]),
          _vm._v(" "),
          _vm.pages.length > 1
            ? _c(
                "ul",
                { staticClass: "pagination" },
                _vm._l(_vm.pages, function(page) {
                  return _c(
                    "router-link",
                    {
                      key: page["pages"],
                      class: { active: _vm.current_page == page["page"] },
                      attrs: {
                        tag: "li",
                        to: { query: { page: page["page"] } },
                        exact: ""
                      }
                    },
                    [
                      _c("a", { attrs: { href: "#" } }, [
                        _vm._v(_vm._s(page["page"]))
                      ])
                    ]
                  )
                }),
                1
              )
            : _vm._e()
        ])
      ]),
      _vm._v(" "),
      _c(
        "modal",
        { attrs: { id: "delete-voter-modal" } },
        [
          _c("modal-header", [_vm._v("Delete Voter")]),
          _vm._v(" "),
          _c("modal-body", [
            _c("h2", [_vm._v("Are you sure to delete voter?")])
          ]),
          _vm._v(" "),
          _c("modal-footer", [
            _c(
              "button",
              {
                staticClass: "btn btn-danger",
                on: {
                  click: function($event) {
                    return _vm.deleteVoter()
                  }
                }
              },
              [_vm._v("Delete")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticClass: "btn btn-default",
                on: {
                  click: function($event) {
                    return _vm.util.hideModal("#delete-voter-modal")
                  }
                }
              },
              [_vm._v("Cancel")]
            )
          ])
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", [
        _c("th", [_vm._v("Name")]),
        _vm._v(" "),
        _c("th", [_vm._v("Civ HR Control nr")]),
        _vm._v(" "),
        _c("th", [_vm._v("Unit")]),
        _vm._v(" "),
        _c("th", [_vm._v("Action")])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-85533394", module.exports)
  }
}

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(100)
/* template */
var __vue_template__ = __webpack_require__(101)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/voter/add.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7c4e8cf6", Component.options)
  } else {
    hotAPI.reload("data-v-7c4e8cf6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 100 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			loading: false
		};
	},
	methods: {
		add: function add() {
			if (this.loading) return;
			this.loading = true;
			var vm = this;
			this.util.notify('Adding Voter', 'loading');
			axios.post(config.API + 'voter', $('#add-form').serialize()).then(function (response) {
				$.notifyClose();
				vm.loading = false;
				if (vm.util.showResult(response, 'success')) {
					vm.$router.push({ name: 'Manage Voter' });
				}
			}).catch(function (error) {
				$.notifyClose();
				vm.loading = false;
				vm.util.showResult(error);
			});
		}
	}
});

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "panel panel-default" }, [
    _c("div", { staticClass: "panel-body" }, [
      _c("h4", [_vm._v("Add Voter")]),
      _vm._v(" "),
      _c(
        "form",
        {
          attrs: { id: "add-form" },
          on: {
            submit: function($event) {
              $event.preventDefault()
              return _vm.add()
            }
          }
        },
        [
          _vm._m(0),
          _vm._v(" "),
          _vm._m(1),
          _vm._v(" "),
          _vm._m(2),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c(
                "button",
                { staticClass: "btn btn-success", attrs: { type: "submit" } },
                [_vm._v("Submit")]
              ),
              _vm._v(" "),
              _c(
                "router-link",
                {
                  staticClass: "btn btn-default",
                  attrs: { to: { name: "Manage Voter" } }
                },
                [_vm._v("Back")]
              )
            ],
            1
          )
        ]
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "name" } }, [_vm._v("Name")]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "text", name: "name", required: "" }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "student_id" } }, [
        _vm._v("Civ HR Control nr")
      ]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "text", name: "student_id", required: "" }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "course" } }, [_vm._v("Unit")]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "text", name: "course", required: "" }
      })
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7c4e8cf6", module.exports)
  }
}

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(103)
/* template */
var __vue_template__ = __webpack_require__(104)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/voter/edit.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-25051e56", Component.options)
  } else {
    hotAPI.reload("data-v-25051e56", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 103 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			loading: false
		};
	},

	created: function created() {
		if (!this.data.voter.id) {
			this.$router.push({ name: 'Manage Voter' });
		}
	},

	methods: {
		edit: function edit() {
			if (this.loading) return;
			this.loading = true;
			var vm = this;
			this.util.notify('Updating voter', 'loading');
			axios.put(config.API + 'voter/' + this.data.voter.id, $('#edit-form').serialize()).then(function (response) {
				vm.loading = false;
				$.notifyClose();
				if (vm.util.showResult(response, 'success')) {
					vm.$router.push({ name: 'Manage Voter' });
				}
			}).catch(function (error) {
				$.notifyClose();
				vm.loading = false;
				vm.util.showResult(error);
			});
		}
	}
});

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "panel panel-default" }, [
    _c("div", { staticClass: "panel-body" }, [
      _c("h4", [_vm._v("Edit Voter")]),
      _vm._v(" "),
      _c(
        "form",
        {
          attrs: { id: "edit-form" },
          on: {
            submit: function($event) {
              $event.preventDefault()
              return _vm.edit()
            }
          }
        },
        [
          _c("div", { staticClass: "form-group" }, [
            _c("label", { attrs: { for: "name" } }, [_vm._v("Name")]),
            _vm._v(" "),
            _c("input", {
              staticClass: "form-control",
              attrs: { type: "text", name: "name", required: "" },
              domProps: { value: _vm.data.voter.name }
            })
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "form-group" }, [
            _c("label", { attrs: { for: "student_id" } }, [
              _vm._v("Civ HR Control nr")
            ]),
            _vm._v(" "),
            _c("input", {
              staticClass: "form-control",
              attrs: { type: "text", name: "student_id", required: "" },
              domProps: { value: _vm.data.voter.student_id }
            })
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "form-group" }, [
            _c("label", { attrs: { for: "course" } }, [_vm._v("Unit")]),
            _vm._v(" "),
            _c("input", {
              staticClass: "form-control",
              attrs: { type: "text", name: "course", required: "" },
              domProps: { value: _vm.data.voter.course }
            })
          ]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("input", {
                staticClass: "btn btn-success",
                attrs: { type: "submit", value: "Submit" }
              }),
              _vm._v(" "),
              _c(
                "router-link",
                {
                  staticClass: "btn btn-default",
                  attrs: { to: { name: "Manage Voter" } }
                },
                [_vm._v("Back")]
              )
            ],
            1
          )
        ]
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-25051e56", module.exports)
  }
}

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(106)
/* template */
var __vue_template__ = __webpack_require__(107)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/nominee/nominee.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-70ec0c7e", Component.options)
  } else {
    hotAPI.reload("data-v-70ec0c7e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 106 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	created: function created() {
		this.util.setTitle('Voting System - Manage Nominee');
	}
});

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "container col-md-10 col-md-offset-1" },
    [_c("h4", [_vm._v("Manage Candidate")]), _vm._v(" "), _c("router-view")],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-70ec0c7e", module.exports)
  }
}

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(109)
/* template */
var __vue_template__ = __webpack_require__(110)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/nominee/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-eb3ff682", Component.options)
  } else {
    hotAPI.reload("data-v-eb3ff682", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 109 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			id: 0
		};
	},

	created: function created() {
		this.refreshNominee();
	},

	methods: {

		deleteNominee: function deleteNominee() {
			this.util.hideModal('#delete-nominee-modal');
			var vm = this;
			this.util.notify('Deleting Candidate', 'loading');
			axios.delete(config.API + 'nominee/' + this.id).then(function (response) {
				$.notifyClose();
				if (vm.util.showResult(response, 'success')) vm.refreshNominee();
			}).catch(function (error) {
				$.notifyClose();
				vm.util.showResult(error, 'error');
			});
		},

		refreshNominee: function refreshNominee() {
			var vm = this;
			this.util.notify('Refreshing Candidate', 'loading');
			axios.get(config.API + 'nominee').then(function (response) {
				$.notifyClose();
				console.log(response);
				vm.data.nominees = response.data;
			}).catch(function (error) {
				$.notifyClose();
				vm.showResult(error);
			});
		},

		getPosition: function getPosition(id) {
			var positions = this.data.positions;
			for (var i in positions) {
				if (positions[i].id == id) return positions[i]['name'];
			}
		},

		getPartylist: function getPartylist(id) {
			var partylists = this.data.partylists;
			for (var i in partylists) {
				if (partylists[i].id == id) return partylists[i]['name'];
			}return 'No Team';
		}
	},

	computed: {
		nominees: function nominees() {
			var nominees = [];
			var y = this.data.nominees;
			for (var nominee in this.data.nominees) {
				if (y[nominee].position_id == this.position_id || this.position_id == 0) {
					var x = y[nominee];
					x.position = this.getPosition(y[nominee].position_id);
					x.partylist = this.getPartylist(y[nominee].partylist_id);
					nominees.push(x);
				}
			}
			return nominees;
		},

		position_id: function position_id() {
			return this.$route.query.position_id ? this.$route.query.position_id : 0;
		}
	}
});

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "row" },
    [
      _c(
        "div",
        { staticClass: "col-md-3", staticStyle: { "max-width": "250px" } },
        [
          _c(
            "ul",
            { staticClass: "list-group" },
            [
              _c(
                "router-link",
                {
                  staticClass: "list-group-item",
                  class: { active: _vm.position_id == 0 },
                  attrs: {
                    tag: "li",
                    to: { name: "Manage Nominee" },
                    exact: "",
                    replace: ""
                  }
                },
                [_vm._v("\r\n\t\t\t\tAll Position\r\n\t\t\t")]
              ),
              _vm._v(" "),
              _vm._l(_vm.data.positions, function(position) {
                return _c(
                  "router-link",
                  {
                    key: position.id,
                    staticClass: "list-group-item",
                    attrs: {
                      tag: "li",
                      to: { query: { position_id: position.id } },
                      exact: "",
                      replace: ""
                    }
                  },
                  [
                    _vm._v(
                      "\r\n\t\t\t\t" + _vm._s(position.name) + "\r\n\t\t\t"
                    )
                  ]
                )
              })
            ],
            2
          )
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "col-md-9 panel panel-default" }, [
        _c("div", { staticClass: "panel-body table-responsive" }, [
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c(
                "router-link",
                {
                  staticClass: "btn btn-success",
                  attrs: {
                    to: {
                      name: "Add Nominee",
                      query: { position_id: _vm.position_id }
                    }
                  }
                },
                [
                  _c("i", { staticClass: "fa fa-plus" }),
                  _vm._v(" Add Candidate")
                ]
              )
            ],
            1
          ),
          _vm._v(" "),
          _c("table", { staticClass: "table table-hover" }, [
            _vm._m(0),
            _vm._v(" "),
            _c(
              "tbody",
              [
                _vm._l(_vm.nominees, function(nominee) {
                  return _c("tr", [
                    _c("td", [
                      _c("img", {
                        staticClass: "thumbnail",
                        staticStyle: { height: "60px", width: "60px" },
                        attrs: {
                          alt: nominee.name,
                          src: _vm.data.storageURL + nominee.image
                        }
                      })
                    ]),
                    _vm._v(" "),
                    _c("td", [_vm._v(_vm._s(nominee.name))]),
                    _vm._v(" "),
                    _c("td", [_vm._v(_vm._s(nominee.student_id))]),
                    _vm._v(" "),
                    _c("td", [_vm._v(_vm._s(nominee.course))]),
                    _vm._v(" "),
                    _c("td", [_vm._v(_vm._s(nominee.position))]),
                    _vm._v(" "),
                    _c("td", [_vm._v(_vm._s(nominee.partylist))]),
                    _vm._v(" "),
                    _c(
                      "td",
                      [
                        _c(
                          "router-link",
                          {
                            staticClass: "btn btn-info",
                            attrs: {
                              to: {
                                name: "Edit Nominee",
                                params: { id: nominee.id }
                              }
                            }
                          },
                          [
                            _c("i", { staticClass: "fa fa-edit" }),
                            _vm._v(" Edit\r\n\t\t\t\t\t\t\t")
                          ]
                        ),
                        _vm._v(" "),
                        _c(
                          "button",
                          {
                            staticClass: "btn btn-danger",
                            on: {
                              click: function($event) {
                                _vm.util.showModal("#delete-nominee-modal")
                                _vm.id = nominee.id
                              }
                            }
                          },
                          [
                            _c("i", { staticClass: "fa fa-trash" }),
                            _vm._v(" Delete\r\n\t\t\t\t\t\t\t")
                          ]
                        )
                      ],
                      1
                    )
                  ])
                }),
                _vm._v(" "),
                _vm.nominees.length < 1
                  ? _c("tr", [
                      _c("td", { attrs: { colspan: "7" } }, [
                        _vm._v("No nominees")
                      ])
                    ])
                  : _vm._e()
              ],
              2
            )
          ])
        ])
      ]),
      _vm._v(" "),
      _c(
        "modal",
        { attrs: { id: "delete-nominee-modal" } },
        [
          _c("modal-header", [_vm._v("Delete Candidate")]),
          _vm._v(" "),
          _c("modal-body", [
            _c("h3", [_vm._v("Are you sure to delete this Candidate?")])
          ]),
          _vm._v(" "),
          _c("modal-footer", [
            _c(
              "button",
              {
                staticClass: "btn btn-danger",
                on: {
                  click: function($event) {
                    return _vm.deleteNominee()
                  }
                }
              },
              [_vm._v("Delete")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticClass: "btn btn-default",
                on: {
                  click: function($event) {
                    return _vm.util.hideModal("#delete-nominee-modal")
                  }
                }
              },
              [_vm._v("\r\n\t\t\t\tBack\r\n\t\t\t")]
            )
          ])
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", [
        _c("th"),
        _vm._v(" "),
        _c("th", [_vm._v("Name")]),
        _vm._v(" "),
        _c("th", [_vm._v("Civ HR Control nr")]),
        _vm._v(" "),
        _c("th", [_vm._v("Unit")]),
        _vm._v(" "),
        _c("th", [_vm._v("Position")]),
        _vm._v(" "),
        _c("th", [_vm._v("Team Name")]),
        _vm._v(" "),
        _c("th", [_vm._v("Action")])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-eb3ff682", module.exports)
  }
}

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(112)
/* template */
var __vue_template__ = __webpack_require__(113)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/nominee/add.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-389a664e", Component.options)
  } else {
    hotAPI.reload("data-v-389a664e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 112 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			loading: false
		};
	},

	methods: {
		add: function add() {
			if (this.loading) return;
			var vm = this;
			this.loading = true;
			this.util.notify('Adding Candidate', 'progress', 0);
			$('#add_form').ajaxSubmit({
				success: function success(response) {
					$.notifyClose();
					vm.loading = false;
					if (vm.util.showResult(response, 'success', 'ajax')) vm.$router.push({ name: 'Manage Nominee' });
				},
				error: function error(_error) {
					$.notifyClose();
					vm.loading = false;
					vm.util.showResult(_error, 'error', 'ajax');
				},
				uploadProgress: function uploadProgress(a, b, c, progress) {
					vm.util.notify('Adding Candidate', 'progress', progress);
				}
			});
		}
	},

	computed: {
		position_id: {
			get: function get() {
				return this.$route.query.position_id;
			},

			set: function set(id) {
				this.$router.replace({ query: { position_id: id } });
			}
		}
	}
});

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "panel panel-default" }, [
    _c("div", { staticClass: "panel-body" }, [
      _c(
        "form",
        {
          staticClass: "row",
          attrs: {
            method: "POST",
            id: "add_form",
            action: _vm.data.API + "nominee",
            enctype: "mutlipart/formdata"
          },
          on: {
            submit: function($event) {
              $event.preventDefault()
              return _vm.add()
            }
          }
        },
        [
          _c(
            "div",
            { staticClass: "col-md-4" },
            [_c("uploader", { attrs: { "file-name": "image" } })],
            1
          ),
          _vm._v(" "),
          _c("div", { staticClass: "col-md-8" }, [
            _vm._m(0),
            _vm._v(" "),
            _vm._m(1),
            _vm._v(" "),
            _vm._m(2),
            _vm._v(" "),
            _vm._m(3),
            _vm._v(" "),
            _vm._m(4),
            _vm._v(" "),
            _c("div", { staticClass: "form-group" }, [
              _c("label", { attrs: { for: "position_id" } }, [
                _vm._v("Position")
              ]),
              _vm._v(" "),
              _c(
                "select",
                {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.position_id,
                      expression: "position_id"
                    }
                  ],
                  staticClass: "form-control",
                  attrs: { name: "position_id", required: "" },
                  on: {
                    change: function($event) {
                      var $$selectedVal = Array.prototype.filter
                        .call($event.target.options, function(o) {
                          return o.selected
                        })
                        .map(function(o) {
                          var val = "_value" in o ? o._value : o.value
                          return val
                        })
                      _vm.position_id = $event.target.multiple
                        ? $$selectedVal
                        : $$selectedVal[0]
                    }
                  }
                },
                [
                  _c("option", { attrs: { value: "0", disabled: "" } }, [
                    _vm._v("--- Select Position ---")
                  ]),
                  _vm._v(" "),
                  _vm._l(_vm.data.positions, function(position) {
                    return _c("option", { domProps: { value: position.id } }, [
                      _vm._v(_vm._s(position.name))
                    ])
                  })
                ],
                2
              )
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group" }, [
              _c("label", { attrs: { for: "partylist_id" } }, [
                _vm._v("Team Name")
              ]),
              _vm._v(" "),
              _c(
                "select",
                {
                  staticClass: "form-control",
                  attrs: { name: "partylist_id" }
                },
                [
                  _c("option", { attrs: { value: "" } }, [
                    _vm._v("--- Select Team Name (Optional) ---")
                  ]),
                  _vm._v(" "),
                  _vm._l(_vm.data.partylists, function(partylist) {
                    return _c("option", { domProps: { value: partylist.id } }, [
                      _vm._v(_vm._s(partylist.name))
                    ])
                  })
                ],
                2
              )
            ]),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "form-group pull-right" },
              [
                _c("input", {
                  staticClass: "btn btn-info",
                  attrs: { type: "submit", value: "Submit" }
                }),
                _vm._v(" "),
                _c(
                  "router-link",
                  {
                    staticClass: "btn btn-default",
                    attrs: {
                      to: {
                        name: "Manage Nominee",
                        query: { position_id: _vm.position_id }
                      }
                    }
                  },
                  [_vm._v("\n\t\t\t\t\t\tCancel\n\t\t\t\t\t")]
                )
              ],
              1
            )
          ])
        ]
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "name" } }, [_vm._v("Name")]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "text", name: "name", required: "" }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "student_id" } }, [
        _vm._v("Civ HR Control nr")
      ]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "text", name: "student_id", required: "" }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "course" } }, [_vm._v("Unit")]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "text", name: "course", required: "" }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "motto" } }, [_vm._v("Motto")]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "text", name: "motto", placeholder: "(Optional)" }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "description" } }, [_vm._v("Description")]),
      _vm._v(" "),
      _c("textarea", {
        staticClass: "form-control",
        attrs: { name: "description", placeholder: "(Optional)" }
      })
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-389a664e", module.exports)
  }
}

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(115)
/* template */
var __vue_template__ = __webpack_require__(116)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/nominee/edit.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f30deaa6", Component.options)
  } else {
    hotAPI.reload("data-v-f30deaa6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			loading: false
		};
	},

	created: function created() {
		if (!this.nominee.id) this.$router.push({ name: 'Manage Nominee' });
	},

	methods: {
		edit: function edit() {
			if (this.loading) return;
			var vm = this;
			this.loading = true;
			this.util.notify('Updating Candidate', 'progress', 0);
			$('#edit_form').ajaxSubmit({
				success: function success(response) {
					$.notifyClose();
					vm.loading = false;
					if (vm.util.showResult(response, 'success', 'ajax')) vm.$router.push({ name: 'Manage Nominee' });
				},
				error: function error(_error) {
					$.notifyClose();
					vm.loading = false;
					vm.util.showResult(_error, 'error', 'ajax');
				},
				uploadProgress: function uploadProgress(a, b, c, progress) {
					vm.util.notify('Updating Candidate', 'progress', progress);
				}
			});
		}
	},

	computed: {
		id: function id() {
			return this.$route.params.id;
		},

		nominee: function nominee() {
			for (var i in this.data.nominees) {
				if (this.data.nominees[i].id == this.id) return this.data.nominees[i];
			}return {};
		}
	}
});

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "panel panel-default" }, [
    _c("div", { staticClass: "panel-body" }, [
      _c(
        "form",
        {
          staticClass: "row",
          attrs: {
            method: "POST",
            id: "edit_form",
            action: _vm.data.API + "nominee/" + _vm.id,
            enctype: "multipart/form-data"
          },
          on: {
            submit: function($event) {
              $event.preventDefault()
              return _vm.edit()
            }
          }
        },
        [
          _c("input", {
            attrs: { type: "hidden", name: "_method", value: "PUT" }
          }),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "col-md-4" },
            [
              _c("uploader", {
                attrs: {
                  "file-name": "image",
                  "image-src": _vm.data.storageURL + _vm.nominee.image
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c("div", { staticClass: "col-md-8" }, [
            _c("div", { staticClass: "form-group" }, [
              _c("label", { attrs: { for: "name" } }, [_vm._v("Name")]),
              _vm._v(" "),
              _c("input", {
                staticClass: "form-control",
                attrs: { type: "text", name: "name", required: "" },
                domProps: { value: _vm.nominee.name }
              })
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group" }, [
              _c("label", { attrs: { for: "student_id" } }, [
                _vm._v("Civ HR Control nr")
              ]),
              _vm._v(" "),
              _c("input", {
                staticClass: "form-control",
                attrs: { type: "text", name: "student_id", required: "" },
                domProps: { value: _vm.nominee.student_id }
              })
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group" }, [
              _c("label", { attrs: { for: "course" } }, [_vm._v("Unit")]),
              _vm._v(" "),
              _c("input", {
                staticClass: "form-control",
                attrs: { type: "text", name: "course", required: "" },
                domProps: { value: _vm.nominee.course }
              })
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group" }, [
              _c("label", { attrs: { for: "motto" } }, [_vm._v("Motto")]),
              _vm._v(" "),
              _c("input", {
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  name: "motto",
                  placeholder: "(Optional)"
                },
                domProps: { value: _vm.nominee.motto }
              })
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group" }, [
              _c("label", { attrs: { for: "description" } }, [
                _vm._v("Description")
              ]),
              _vm._v(" "),
              _c(
                "textarea",
                {
                  staticClass: "form-control",
                  attrs: { name: "description", placeholder: "(Optional)" }
                },
                [_vm._v(_vm._s(_vm.nominee.description))]
              )
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group" }, [
              _c("label", { attrs: { for: "position_id" } }, [
                _vm._v("Position")
              ]),
              _vm._v(" "),
              _c(
                "select",
                {
                  staticClass: "form-control",
                  attrs: { name: "position_id", required: "" },
                  domProps: { value: _vm.nominee.position_id }
                },
                [
                  _c("option", { attrs: { value: "0", disabled: "" } }, [
                    _vm._v("--- Select Position ---")
                  ]),
                  _vm._v(" "),
                  _vm._l(_vm.data.positions, function(position) {
                    return _c("option", { domProps: { value: position.id } }, [
                      _vm._v(_vm._s(position.name))
                    ])
                  })
                ],
                2
              )
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group" }, [
              _c("label", { attrs: { for: "partylist_id" } }, [
                _vm._v("Team Name")
              ]),
              _vm._v(" "),
              _c(
                "select",
                {
                  staticClass: "form-control",
                  attrs: { name: "partylist_id" },
                  domProps: { value: _vm.nominee.partylist_id }
                },
                [
                  _c("option", { attrs: { value: "" } }, [
                    _vm._v("--- Select Team Name (Optional) ---")
                  ]),
                  _vm._v(" "),
                  _vm._l(_vm.data.partylists, function(partylist) {
                    return _c("option", { domProps: { value: partylist.id } }, [
                      _vm._v(_vm._s(partylist.name))
                    ])
                  })
                ],
                2
              )
            ]),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "form-group pull-right" },
              [
                _c("input", {
                  staticClass: "btn btn-info",
                  attrs: { type: "submit", value: "Submit" }
                }),
                _vm._v(" "),
                _c(
                  "router-link",
                  {
                    staticClass: "btn btn-default",
                    attrs: { to: { name: "Manage Nominee" } }
                  },
                  [_vm._v("\r\n\t\t\t\t\t\tBack\r\n\t\t\t\t\t")]
                )
              ],
              1
            )
          ])
        ]
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-f30deaa6", module.exports)
  }
}

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(118)
/* template */
var __vue_template__ = __webpack_require__(119)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/admin/admin.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-20dcf5fa", Component.options)
  } else {
    hotAPI.reload("data-v-20dcf5fa", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 118 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	created: function created() {
		this.util.setTitle('Voting System - Manage Account');
	}
});

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "container col-md-8 col-md-offset-2" },
    [_c("h4", [_vm._v("Manage Account")]), _vm._v(" "), _c("router-view")],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-20dcf5fa", module.exports)
  }
}

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(121)
/* template */
var __vue_template__ = __webpack_require__(122)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/admin/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2124bc06", Component.options)
  } else {
    hotAPI.reload("data-v-2124bc06", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 121 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({

	data: function data() {
		return {
			id: 0
		};
	},

	created: function created() {
		this.refreshAdmin();
	},

	methods: {
		deleteAdmin: function deleteAdmin() {
			this.util.hideModal('#delete-admin-modal');
			this.util.notify('Deleting admin', 'loading');
			var vm = this;
			axios.delete(config.API + 'admin/' + this.id).then(function (response) {
				$.notifyClose();
				if (vm.util.showResult(response, 'success')) vm.refreshAdmin();
			}).catch(function (error) {
				$.notifyClose();
				vm.util.showResult(error, 'error');
			});
		},

		refreshAdmin: function refreshAdmin() {
			this.util.notify('Refreshing admin', 'loading');
			var vm = this;
			axios.get(config.API + 'admin').then(function (response) {
				$.notifyClose();
				if (response.data.status == 'failed') vm.util.showResult(response, 'success');else vm.data.admins = response.data;
			}).catch(function (error) {
				$.notifyClose();
				vm.util.showResult(error, 'error');
			});
		}
	}
});

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "panel panel-default" },
    [
      _c("div", { staticClass: "panel-body table-responsive" }, [
        _c(
          "div",
          { staticClass: "form-group" },
          [
            _c(
              "router-link",
              {
                staticClass: "btn btn-success",
                attrs: { to: { name: "Add Account" } }
              },
              [_c("i", { staticClass: "fa fa-plus" }), _vm._v(" Add Account")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticClass: "btn btn-default",
                on: {
                  click: function($event) {
                    return _vm.refreshAdmin()
                  }
                }
              },
              [_c("i", { staticClass: "fa fa-refresh" }), _vm._v(" Refresh")]
            )
          ],
          1
        ),
        _vm._v(" "),
        _c("table", { staticClass: "table table-hover" }, [
          _vm._m(0),
          _vm._v(" "),
          _c(
            "tbody",
            _vm._l(_vm.data.admins, function(admin) {
              return _c("tr", [
                _c("td", [_vm._v(_vm._s(admin.id))]),
                _vm._v(" "),
                _c("td", [_vm._v(_vm._s(admin.name))]),
                _vm._v(" "),
                _c("td", [_vm._v(_vm._s(admin.email))]),
                _vm._v(" "),
                _c("td", [
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-danger",
                      on: {
                        click: function($event) {
                          _vm.id = admin.id
                          _vm.util.showModal("#delete-admin-modal")
                        }
                      }
                    },
                    [
                      _c("i", { staticClass: "fa fa-trash" }),
                      _vm._v(" Delete\r\n\t\t\t\t\t\t")
                    ]
                  )
                ])
              ])
            }),
            0
          )
        ])
      ]),
      _vm._v(" "),
      _c(
        "modal",
        { attrs: { id: "delete-admin-modal" } },
        [
          _c("modal-header", [_vm._v("Delete Admin")]),
          _vm._v(" "),
          _c("modal-body", [
            _c("h3", [_vm._v("Are you sure to delete this admin?")])
          ]),
          _vm._v(" "),
          _c("modal-footer", [
            _c(
              "button",
              {
                staticClass: "btn btn-danger",
                on: {
                  click: function($event) {
                    return _vm.deleteAdmin()
                  }
                }
              },
              [_vm._v("Delete")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticClass: "btn btn-default",
                on: {
                  click: function($event) {
                    return _vm.util.hideModal("#delete-admin-modal")
                  }
                }
              },
              [_vm._v("Cancel")]
            )
          ])
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", [
        _c("th", [_vm._v("ID")]),
        _vm._v(" "),
        _c("th", [_vm._v("Name")]),
        _vm._v(" "),
        _c("th", [_vm._v("Email")]),
        _vm._v(" "),
        _c("th", [_vm._v("Delete")])
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-2124bc06", module.exports)
  }
}

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(124)
/* template */
var __vue_template__ = __webpack_require__(125)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/admin/edit.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-aa7864a2", Component.options)
  } else {
    hotAPI.reload("data-v-aa7864a2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 124 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			loading: false
		};
	},

	methods: {
		refreshUser: function refreshUser() {
			var vm = this;
			axios.get(config.API + 'admin/' + this.data.user.id).then(function (response) {
				vm.data.user = response.data;
			});
		},

		edit: function edit() {
			if (this.loading) return;
			this.loading = true;
			var vm = this;
			this.util.notify('Updating account', 'loading');
			axios.put(config.API + 'admin/' + this.data.user.id, $('#edit_form').serialize()).then(function (response) {
				$.notifyClose();
				vm.loading = false;
				if (vm.util.showResult(response, 'success')) {
					vm.refreshUser();
					vm.$router.push({ name: 'Admin Home' });
				}
			}).catch(function (error) {
				$.notifyClose();
				vm.loading = false;
				vm.util.showResult(error, 'error');
			});
		}
	}
});

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "panel panel-default" }, [
    _c("div", { staticClass: "panel-body" }, [
      _c("h4", [_vm._v("Update Account")]),
      _vm._v(" "),
      _c(
        "form",
        {
          attrs: { id: "edit_form" },
          on: {
            submit: function($event) {
              $event.preventDefault()
              return _vm.edit()
            }
          }
        },
        [
          _c("div", { staticClass: "form-group" }, [
            _c("label", { attrs: { for: "name" } }, [_vm._v("Name")]),
            _vm._v(" "),
            _c("input", {
              staticClass: "form-control",
              attrs: { type: "text", name: "name", required: "" },
              domProps: { value: _vm.data.user.name }
            })
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "form-group" }, [
            _c("label", { attrs: { for: "email" } }, [_vm._v("E-mail")]),
            _vm._v(" "),
            _c("input", {
              staticClass: "form-control",
              attrs: { type: "email", name: "email", required: "" },
              domProps: { value: _vm.data.user.email }
            })
          ]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("input", {
                staticClass: "btn btn-info",
                attrs: { type: "submit", value: "Submit" }
              }),
              _vm._v(" "),
              _c(
                "router-link",
                {
                  staticClass: "btn btn-default",
                  attrs: { to: { name: "Update Password" } }
                },
                [_vm._v("Change Password")]
              )
            ],
            1
          )
        ]
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-aa7864a2", module.exports)
  }
}

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(127)
/* template */
var __vue_template__ = __webpack_require__(128)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/admin/password.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-cfccc980", Component.options)
  } else {
    hotAPI.reload("data-v-cfccc980", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 127 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			loading: false
		};
	},

	methods: {
		edit: function edit() {
			if (this.loading || !this.checkPassword()) return;
			var vm = this;
			vm.loading = true;
			vm.util.notify('Updating Password', 'loading');
			axios.put(config.API + 'admin/password/' + this.data.user.id, $('#edit_form').serialize()).then(function (response) {
				$.notifyClose();
				vm.loading = false;
				vm.util.showResult(response, 'success');
				vm.$router.push({ name: 'Admin Home' });
			}).catch(function (error) {
				$.notifyClose();
				vm.loading = false;
				vm.util.showResult(error, 'error');
			});
		},

		checkPassword: function checkPassword() {
			var isMatch = $("[name=password]").val() == $("[name=confirm_password]").val();
			if (!isMatch) {
				this.util.notify('Password not match', 'error');
			}
			return isMatch;
		}
	}
});

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "panel panel-default" }, [
    _c("div", { staticClass: "panel-body" }, [
      _c("h4", [_vm._v("Update Password")]),
      _vm._v(" "),
      _c(
        "form",
        {
          attrs: { id: "edit_form" },
          on: {
            submit: function($event) {
              $event.preventDefault()
              return _vm.edit()
            }
          }
        },
        [
          _vm._m(0),
          _vm._v(" "),
          _vm._m(1),
          _vm._v(" "),
          _vm._m(2),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("input", {
                staticClass: "btn btn-info",
                attrs: { type: "submit", value: "Submit" }
              }),
              _vm._v(" "),
              _c(
                "router-link",
                {
                  staticClass: "btn btn-default",
                  attrs: { to: { name: "Update Account" } }
                },
                [_vm._v("Back")]
              )
            ],
            1
          )
        ]
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "old_password" } }, [_vm._v("Old Password")]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "password", name: "old_password", required: "" }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "password" } }, [_vm._v("New Password")]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "password", name: "password", required: "" }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "confirm_password" } }, [
        _vm._v("Confirm Password")
      ]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "password", name: "confirm_password", required: "" }
      })
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-cfccc980", module.exports)
  }
}

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = __webpack_require__(130)
/* template */
var __vue_template__ = __webpack_require__(131)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/demo/admin/admin/add.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4a4a3b0c", Component.options)
  } else {
    hotAPI.reload("data-v-4a4a3b0c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 130 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
	data: function data() {
		return {
			loading: false
		};
	},

	methods: {
		add: function add() {
			if (this.loading || !this.isPasswordMatch()) return;
			var vm = this;
			this.loading = true;
			this.util.notify('Adding Admin', 'loading');
			axios.post(config.API + 'admin', $('#add_form').serialize()).then(function (response) {
				vm.loading = false;
				$.notifyClose();
				if (vm.util.showResult(response, 'success')) {
					vm.$router.push({ name: 'Manage Account' });
				}
			}).catch(function (error) {
				vm.loading = false;
				$.notifyClose();
				vm.util.showResult(error, 'error');
			});
		},

		isPasswordMatch: function isPasswordMatch() {
			var isMatch = $('[name=password]').val() == $('[name=confirm_password]').val();
			if (!isMatch) this.util.notify('Password not match', 'error');
			return isMatch;
		}
	}
});

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "panel panel-default" }, [
    _c("div", { staticClass: "panel-body" }, [
      _c(
        "form",
        {
          attrs: { id: "add_form" },
          on: {
            submit: function($event) {
              $event.preventDefault()
              return _vm.add()
            }
          }
        },
        [
          _vm._m(0),
          _vm._v(" "),
          _vm._m(1),
          _vm._v(" "),
          _vm._m(2),
          _vm._v(" "),
          _vm._m(3),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "form-group" },
            [
              _c("input", {
                staticClass: "btn btn-info",
                attrs: { type: "submit", value: "Submit" }
              }),
              _vm._v(" "),
              _c(
                "router-link",
                {
                  staticClass: "btn btn-default",
                  attrs: { to: { name: "Manage Account" } }
                },
                [_vm._v("Back")]
              )
            ],
            1
          )
        ]
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "name" } }, [_vm._v("Name")]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "text", name: "name", required: "" }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "email" } }, [_vm._v("Email")]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "email", name: "email", required: "" }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "password" } }, [_vm._v("Password")]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "password", name: "password", required: "" }
      })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-group" }, [
      _c("label", { attrs: { for: "confirm_password" } }, [
        _vm._v("Confirm Password")
      ]),
      _vm._v(" "),
      _c("input", {
        staticClass: "form-control",
        attrs: { type: "password", name: "confirm_password", required: "" }
      })
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4a4a3b0c", module.exports)
  }
}

/***/ }),
/* 132 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);