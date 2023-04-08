(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["./store/public/react/pages/admin-LabsCreate-js~./store/public/react/pages/admin-VersionsAddView-js"],{

/***/ "./store/resources/react/components/admin/product/Step_01.js":
/*!*******************************************************************!*\
  !*** ./store/resources/react/components/admin/product/Step_01.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _func_FuncFolder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../func/FuncFolder */ "./store/resources/react/components/func/FuncFolder.js");
/* harmony import */ var _Step__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Step */ "./store/resources/react/components/admin/product/Step.js");
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





var Step_01 =
/*#__PURE__*/
function (_Step) {
  _inherits(Step_01, _Step);

  function Step_01(props) {
    var _this$state;

    var _this;

    _classCallCheck(this, Step_01);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Step_01).call(this, props));
    _this.state = (_this$state = {}, _defineProperty(_this$state, VERSION_UNL, ''), _defineProperty(_this$state, VERSION_NOTE, ''), _defineProperty(_this$state, DEPENDENCE_TABLE, {}), _this$state);
    return _this;
  }

  _createClass(Step_01, [{
    key: "getData",
    value: function getData() {
      return this.state;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      this.product = this.props.product;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: this.id
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row",
        style: {
          justifyContent: 'flex-end',
          display: this.props.next ? '' : 'none'
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "btn btn-primary",
        onClick: function onClick() {
          _this2.product.flow.nextStep();
        }
      }, lang('Next'))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-md-6"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, lang('UNL file'), ":"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, lang("UNL file des"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, ' /opt/unetlab/labs')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "box_border",
        style: {
          padding: 5,
          borderRadius: 5
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, lang('Selected Lab'), ":")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("style", null, "\n\t\t\t\t\t\t\t\t.file_selected:hover {\n\t\t\t\t\t\t\t\t\tbackground: #eee;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t"), this.state[VERSION_UNL] == '' ? '' : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "box_flex file_selected",
        style: {
          padding: 5
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fa fa-file-text-o",
        style: {
          color: 'gray'
        }
      }), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        title: this.state[VERSION_UNL],
        className: "box_line"
      }, this.state[VERSION_UNL]))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_func_FuncFolder__WEBPACK_IMPORTED_MODULE_1__["default"], {
        except: ['Your labs from PNETLab Store'],
        expand: true,
        link: "/store/public/admin/default/folder",
        folder: "/opt/unetlab/labs",
        onSelect: function onSelect(file) {
          _this2.getDepends(file);
        }
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-md-6"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, lang('Additional packages')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, lang("Additional packages des")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "box_border",
        style: {
          padding: 5,
          borderRadius: 5
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, lang('Selected file'), ": ")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("style", null, "\n\t\t\t\t\t\t\t\t.file_selected:hover {\n\t\t\t\t\t\t\t\t\tbackground: darkgray;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t"), Object.keys(this.state[DEPENDENCE_TABLE]).map(function (item) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: item,
          className: "box_flex file_selected",
          style: {
            padding: 5
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fa fa-file-text-o",
          style: {
            color: 'gray'
          }
        }), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          title: _this2.state[DEPENDENCE_TABLE][item],
          className: "box_line"
        }, _this2.state[DEPENDENCE_TABLE][item]), "\xA0", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fa fa-close button",
          style: {
            marginLeft: 'auto'
          },
          onClick: function onClick() {
            var selected = _this2.state[DEPENDENCE_TABLE];
            delete selected[item];

            _this2.setState(_defineProperty({}, DEPENDENCE_TABLE, selected));
          }
        }));
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_func_FuncFolder__WEBPACK_IMPORTED_MODULE_1__["default"], {
        expand: true,
        link: "/store/public/admin/default/folder",
        folder: "/opt/unetlab/addons",
        onSelect: function onSelect(file) {
          var selected = _this2.state[DEPENDENCE_TABLE];
          selected[file] = file;

          _this2.setState(_defineProperty({}, DEPENDENCE_TABLE, selected));
        }
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_func_FuncFolder__WEBPACK_IMPORTED_MODULE_1__["default"], {
        expand: false,
        link: "/store/public/admin/default/folder",
        folder: "/opt/unetlab/html/templates",
        onSelect: function onSelect(file) {
          var selected = _this2.state[DEPENDENCE_TABLE];
          selected[file] = file;

          _this2.setState(_defineProperty({}, DEPENDENCE_TABLE, selected));
        }
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_func_FuncFolder__WEBPACK_IMPORTED_MODULE_1__["default"], {
        expand: false,
        link: "/store/public/admin/default/folder",
        folder: "/opt/unetlab/html/images/icons",
        onSelect: function onSelect(file) {
          var selected = _this2.state[DEPENDENCE_TABLE];
          selected[file] = file;

          _this2.setState(_defineProperty({}, DEPENDENCE_TABLE, selected));
        }
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_func_FuncFolder__WEBPACK_IMPORTED_MODULE_1__["default"], {
        expand: false,
        link: "/store/public/admin/default/folder",
        folder: "/opt/unetlab/scripts",
        onSelect: function onSelect(file) {
          var selected = _this2.state[DEPENDENCE_TABLE];
          selected[file] = file;

          _this2.setState(_defineProperty({}, DEPENDENCE_TABLE, selected));
        }
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, lang(VERSION_NOTE)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, lang('version_node_des'))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("textarea", {
        onChange: function onChange(event) {
          return _this2.setState(_defineProperty({}, VERSION_NOTE, event.target.value));
        },
        value: this.state[VERSION_NOTE],
        className: "product_input",
        style: {
          width: '100%'
        }
      }))));
    }
  }, {
    key: "getDepends",
    value: function getDepends(file) {
      var _this3 = this;

      App.loading(true, 'Checking');
      return axios.request({
        url: '/store/public/admin/labs/getDepends',
        method: 'post',
        data: {
          path: file
        }
      }).then(function (response) {
        App.loading(false);
        response = response['data'];

        if (!response['result']) {
          error_handle(response);
          return false;
        } else {
          var _this3$setState;

          var depends = {};
          response['data'].map(function (item) {
            return depends[item] = item;
          });

          _this3.setState((_this3$setState = {}, _defineProperty(_this3$setState, VERSION_UNL, file), _defineProperty(_this3$setState, DEPENDENCE_TABLE, depends), _this3$setState));
        }
      })["catch"](function (error) {
        error_handle(error);
        App.loading(false);
        return false;
      });
    }
  }]);

  return Step_01;
}(_Step__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Step_01);

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

/***/ })

}]);