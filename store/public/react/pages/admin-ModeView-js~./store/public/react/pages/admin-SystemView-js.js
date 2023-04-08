(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["./store/public/react/pages/admin-ModeView-js~./store/public/react/pages/admin-SystemView-js"],{

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./store/resources/react/pages/admin/responsive/store.scss":
/*!****************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./store/resources/react/pages/admin/responsive/store.scss ***!
  \****************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".lab_item_image {\n  border: solid thin darkgray;\n  padding: 0px;\n  height: 150px;\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-bottom: 5px;\n  overflow: hidden;\n}\n\n.lab_item_name {\n  margin-bottom: 5px;\n  color: #17a2b8;\n}\n\n.lab_item_image {\n  position: relative;\n}\n.lab_item_image img {\n  width: 100%;\n}\n.lab_item_image .cover {\n  justify-content: center;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background: rgba(0, 0, 0, 0.3);\n  display: none;\n}\n.lab_item_image .cover div {\n  border: solid thin rgba(255, 255, 255, 0.5);\n  border-radius: 5px;\n  padding: 7px;\n  color: white;\n  background: rgba(255, 255, 255, 0.1);\n}\n.lab_item_image:hover .cover {\n  display: flex;\n}\n\n.lab_item {\n  padding: 7px;\n  color: #666;\n  display: flex;\n}\n\n.loadmore.button {\n  padding: 5px;\n  background: rgba(13, 39, 77, 0.1);\n  margin: 15px;\n  border-radius: 10px;\n  color: #ffffff;\n  font-weight: bold;\n  width: 50%;\n  min-width: 200px;\n  text-align: center;\n}\n\n@media only screen and (min-width: 768px) {\n  .lab_item {\n    width: 12.5%;\n    max-width: 250px;\n    min-width: 200px;\n  }\n\n  .lab_frame {\n    margin-left: 160px;\n  }\n}\n@media only screen and (max-width: 768px) {\n  .lab_item {\n    width: 50%;\n  }\n\n  .lab_frame {\n    margin-left: 0px;\n  }\n\n  .lab_control {\n    display: none;\n  }\n}", ""]);

// exports


/***/ }),

/***/ "./store/resources/react/components/admin/system/ShareFolder.js":
/*!**********************************************************************!*\
  !*** ./store/resources/react/components/admin/system/ShareFolder.js ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_Loading__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/Loading */ "./store/resources/react/components/common/Loading.js");
/* harmony import */ var _func_FuncFolder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../func/FuncFolder */ "./store/resources/react/components/func/FuncFolder.js");
function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}





var ShareFolder =
/*#__PURE__*/
function (_Component) {
  _inherits(ShareFolder, _Component);

  function ShareFolder(props) {
    var _permissions;

    var _this;

    _classCallCheck(this, ShareFolder);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ShareFolder).call(this, props));
    _this.id = makeId();
    _this.state = {
      shared: [],
      permissions: (_permissions = {}, _defineProperty(_permissions, USER_PER_DEL_FOLDER, false), _defineProperty(_permissions, USER_PER_ADD_FOLDER, false), _defineProperty(_permissions, USER_PER_EDIT_FOLDER, false), _defineProperty(_permissions, USER_PER_DEL_LAB, false), _defineProperty(_permissions, USER_PER_ADD_LAB, false), _defineProperty(_permissions, USER_PER_IMPORT_LAB, false), _defineProperty(_permissions, USER_PER_EXPORT_LAB, false), _defineProperty(_permissions, USER_PER_MOVE_LAB, false), _defineProperty(_permissions, USER_PER_CLONE_LAB, false), _defineProperty(_permissions, USER_PER_JOIN_LAB, false), _defineProperty(_permissions, USER_PER_OPEN_LAB, false), _defineProperty(_permissions, USER_PER_RENAME_LAB, false), _permissions)
    };
    return _this;
  }

  _createClass(ShareFolder, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "box_shadow box_padding"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-md-6"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, lang("Share Folders")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, 'Choose folders to share with all users'), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "box_border",
        style: {
          padding: 5,
          borderRadius: 5
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, lang('Selected Folders'), ":")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("style", null, "\n                            .file_selected:hover {\n                                background: #eee;\n                            }\n                           \n                        "), this.state.shared.map(function (item) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: item,
          className: "box_flex file_selected",
          style: {
            padding: 5
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fa fa-share-alt fa-border",
          style: {
            color: '#00BCD4'
          }
        }), "\xA0", item, "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fa fa-close button",
          style: {
            marginLeft: 'auto'
          },
          onClick: function onClick() {
            var selected = _this2.state.shared;
            var index = selected.findIndex(function (folder) {
              return folder == item;
            });
            if (index == undefined) return;
            selected.splice(index, 1);

            _this2.setState({
              shared: selected
            });
          }
        }));
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_func_FuncFolder__WEBPACK_IMPORTED_MODULE_2__["default"], {
        expand: true,
        link: "/store/public/admin/default/folder",
        folder: "/opt/unetlab/labs",
        onSelectFolder: function onSelectFolder(folder) {
          var selected = [];

          _this2.state.shared.map(function (item) {
            if ((folder + '/').indexOf(item + '/') == 0) return;
            if ((item + '/').indexOf(folder + '/') == 0) return;
            selected.push(item);
          });

          selected.push(folder);

          _this2.setState({
            shared: selected
          });
        },
        selected: this.state.shared
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-md-6"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, lang("Share Folders permissions")), Object.keys(this.state.permissions).map(function (item) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: item
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
          className: "box_flex"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          style: {
            margin: '5px 10px'
          },
          type: "checkbox",
          checked: _this2.state.permissions[item],
          onChange: function onChange(e) {
            var permissions = _this2.state.permissions;
            permissions[item] = e.target.checked;

            _this2.setState({
              permissions: permissions
            });
          }
        }), lang(item)));
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "button btn btn-primary",
        onClick: function onClick() {
          return _this2.shareFolder();
        }
      }, lang("Save")))));
    }
  }, {
    key: "shareFolder",
    value: function shareFolder() {
      var _data,
          _this3 = this;

      App.loading(true);
      axios.request({
        url: '/store/public/admin/system/update',
        method: 'post',
        data: (_data = {}, _defineProperty(_data, CTRL_SHARED, this.state.shared), _defineProperty(_data, CTRL_SHARED_PERMISSION, this.state.permissions), _data)
      }).then(function (response) {
        response = response['data'];
        App.loading(false);

        if (response['result']) {
          _this3.getShareFolder();
        } else {
          error_handle(response);
        }
      })["catch"](function (error) {
        App.loading(false);
        console.log(error);
        error_handle(error);
      });
    }
  }, {
    key: "getShareFolder",
    value: function getShareFolder() {
      var _this4 = this;

      axios.request({
        url: '/store/public/admin/system/getShareFolder',
        method: 'post'
      }).then(function (response) {
        response = response['data'];

        if (response['result']) {
          var data = response['data'];
          var state = {};
          if (isset(data[CTRL_SHARED])) state['shared'] = data[CTRL_SHARED];

          if (_typeof(data[CTRL_SHARED_PERMISSION]) == 'object') {
            state['permissions'] = {};

            for (var i in _this4.state.permissions) {
              if (isset(data[CTRL_SHARED_PERMISSION][i])) {
                state['permissions'][i] = data[CTRL_SHARED_PERMISSION][i];
              } else {
                state['permissions'][i] = false;
              }
            }
          }

          _this4.setState(_objectSpread({}, state));
        } else {
          error_handle(response);
        }
      })["catch"](function (error) {
        console.log(error);
        error_handle(error);

        _this4.clearProcess();
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getShareFolder();
    }
  }]);

  return ShareFolder;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (ShareFolder);

/***/ }),

/***/ "./store/resources/react/components/func/FuncFolder.js":
/*!*************************************************************!*\
  !*** ./store/resources/react/components/func/FuncFolder.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}



var Folder =
/*#__PURE__*/
function (_Component) {
  _inherits(Folder, _Component);

  function Folder(props) {
    var _this;

    _classCallCheck(this, Folder);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Folder).call(this, props));
    _this.state = {
      files: [],
      folders: [],
      folder: _this.props.folder,
      isset: false,
      loading: false,
      expand: false
    };
    _this.parent = _this.props.parent;
    return _this;
  }

  _createClass(Folder, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var except = get(this.props.except, []);
      var folderName = this.props.folder.split('/').pop();
      var selected = get(this.props.selected, []);
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          display: except.includes(folderName) ? 'none' : 'block'
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        onClick: function onClick() {
          _this2.onClickHandle();
        },
        className: "box_flex folder ".concat(selected.includes(this.props.folder) ? 'selected' : ''),
        style: {
          width: '100%',
          cursor: 'pointer'
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fa fa-folder",
        style: {
          color: '#FFC107'
        }
      }), "\xA0", this.props.folder.split('/').pop(), "\xA0", selected.includes(this.props.folder) ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fa fa-check-circle",
        style: {
          color: '#00d100'
        }
      }) : '', this.state.loading ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        style: {
          margin: 'auto 5px auto auto'
        },
        className: "fa fa-circle-o-notch fa-spin"
      }) : ''), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          paddingLeft: 10,
          display: this.state.expand ? 'block' : 'none'
        }
      }, this.state.files.map(function (item, key) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(File, {
          key: key,
          parent: _this2,
          file: item,
          selected: selected
        });
      }), this.state.folders.map(function (item, key) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Folder, {
          except: except,
          key: key,
          link: _this2.props.link,
          parent: _this2,
          folder: item,
          selected: selected
        });
      })));
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.expand) {
        this.loadFolder();
      }
    }
  }, {
    key: "onClickHandle",
    value: function onClickHandle() {
      if (!this.state.isset) {
        this.loadFolder();
      } else {
        this.setState({
          expand: !this.state.expand
        });
      }

      this.onSelectFolder(this.props.folder);
    }
  }, {
    key: "onSelectFolder",
    value: function onSelectFolder(folder) {
      if (!this.props.onSelectFolder) {
        if (!this.props.parent) return;
        if (!this.props.parent.onSelectFolder) return;
        this.props.parent.onSelectFolder(folder);
      } else {
        this.props.onSelectFolder(folder);
      }
    }
  }, {
    key: "onSelect",
    value: function onSelect(file) {
      if (!this.props.onSelect) {
        if (!this.props.parent) return;
        if (!this.props.parent.onSelect) return;
        this.props.parent.onSelect(file);
      } else {
        this.props.onSelect(file);
      }
    }
  }, {
    key: "loadFolder",
    value: function loadFolder() {
      var _this3 = this;

      if (!this.props.link) return;
      this.setState({
        loading: true
      });
      return axios.request({
        url: this.props.link,
        method: 'post',
        data: {
          folder: this.props.folder
        }
      }).then(function (response) {
        response = response['data'];

        if (response['result']) {
          _this3.setState({
            loading: false,
            expand: true,
            isset: true,
            folders: response['data']['folders'],
            files: response['data']['files']
          });
        } else {
          _this3.setState({
            loading: false,
            expand: true
          });
        }
      })["catch"](function (error) {
        this.setState({
          loading: false
        });
        error_handle(error);
      });
    }
  }]);

  return Folder;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Folder);

var File =
/*#__PURE__*/
function (_Component2) {
  _inherits(File, _Component2);

  function File(props) {
    var _this4;

    _classCallCheck(this, File);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(File).call(this, props));
    _this4.state = {
      file: _this4.props.file
    };
    _this4.parent = _this4.props.parent;
    return _this4;
  }

  _createClass(File, [{
    key: "render",
    value: function render() {
      var _this5 = this;

      var selected = get(this.props.selected, []);
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        onClick: function onClick() {
          _this5.onClickHandle();
        },
        className: "box_flex file ".concat(selected.includes(this.props.file) ? 'selected' : ''),
        style: {
          width: '100%',
          cursor: 'pointer'
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fa fa-file-text-o",
        style: {
          color: 'gray'
        }
      }), "\xA0", this.props.file.split('/').pop(), "\xA0", selected.includes(this.props.file) ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fa fa-check-circle",
        style: {
          color: '#00d100'
        }
      }) : '');
    }
  }, {
    key: "onClickHandle",
    value: function onClickHandle() {
      if (!this.props.parent) return;
      if (!this.props.parent.onSelect) return;
      this.props.parent.onSelect(this.props.file);
    }
  }]);

  return File;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/***/ }),

/***/ "./store/resources/react/pages/admin/responsive/store.scss":
/*!*****************************************************************!*\
  !*** ./store/resources/react/pages/admin/responsive/store.scss ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../../node_modules/css-loader!../../../../../../node_modules/postcss-loader/src??ref--7-2!../../../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!./store.scss */ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./store/resources/react/pages/admin/responsive/store.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ })

}]);