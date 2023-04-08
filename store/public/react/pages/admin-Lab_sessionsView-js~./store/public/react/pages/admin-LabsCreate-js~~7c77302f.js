(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["./store/public/react/pages/admin-Lab_sessionsView-js~./store/public/react/pages/admin-LabsCreate-js~~7c77302f"],{

/***/ "./store/resources/react/components/input/InputImg.js":
/*!************************************************************!*\
  !*** ./store/resources/react/components/input/InputImg.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
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

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
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



var InputImg =
/*#__PURE__*/
function (_Component) {
  _inherits(InputImg, _Component);

  function InputImg(props, context) {
    var _this;

    _classCallCheck(this, InputImg);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InputImg).call(this, props, context));
    _this.state = {
      value: '',
      loading: false,
      loaded: 0,
      total: 1,
      preview: ''
    };
    _this.upload_link = get(_this.props.upload_link, null);
    _this.unique = 'input_file_' + Math.floor(Math.random() * 10000);
    return _this;
  }

  _createClass(InputImg, [{
    key: "initial",
    value: function initial() {
      var _this$props = this.props,
          id = _this$props.id,
          value = _this$props.value,
          decoratorOut = _this$props.decoratorOut,
          decoratorIn = _this$props.decoratorIn,
          onChange = _this$props.onChange,
          upload = _this$props.upload,
          children = _this$props.children,
          style = _this$props.style,
          className = _this$props.className,
          rent = _objectWithoutProperties(_this$props, ["id", "value", "decoratorOut", "decoratorIn", "onChange", "upload", "children", "style", "className"]);

      this.id = get(id, '');
      this.onChange = get(onChange, function () {});
      this.decoratorOut = get(decoratorOut, null);
      this.decoratorIn = get(decoratorIn, null);
      this.rent = rent;
      this.className = className;
    }
  }, {
    key: "setValue",
    value: function setValue(value) {
      var _this2 = this;

      if (!value) value = '';
      if (this.decoratorIn) value = this.decoratorIn(value);
      this.input.value = '';
      return new Promise(function (resolve) {
        return _this2.setState({
          value: value,
          preview: value != '' ? _this2.upload_link + '?action=Read&file=' + value : ''
        }, function () {
          resolve(value);
        });
      });
    }
  }, {
    key: "getValue",
    value: function getValue() {
      var value = this.state.value;
      if (this.decoratorOut) value = this.decoratorOut(value);
      return value;
    }
  }, {
    key: "getFile",
    value: function getFile() {
      return this.input.file;
    }
  }, {
    key: "getInput",
    value: function getInput() {
      return this.input;
    }
  }, {
    key: "revertValue",
    value: function revertValue(value) {
      if (this.decoratorOut) value = this.decoratorOut(value);
      return value;
    }
  }, {
    key: "upload",
    value: function () {
      var _upload = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.getUploadLink();

              case 2:
                response = _context.sent;

                if (response) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return", false);

              case 5:
                if (response['result']) {
                  _context.next = 8;
                  break;
                }

                error_handle(response);
                return _context.abrupt("return", false);

              case 8:
                if (!response['data']) {
                  _context.next = 21;
                  break;
                }

                response = response['data'];
                _context.next = 12;
                return this.uploadData(response['ulink'], response['utoken']);

              case 12:
                response = _context.sent;

                if (response) {
                  _context.next = 15;
                  break;
                }

                return _context.abrupt("return", false);

              case 15:
                if (response['result']) {
                  _context.next = 18;
                  break;
                }

                error_handle(response);
                return _context.abrupt("return", false);

              case 18:
                _context.next = 20;
                return this.setValue(response['data']);

              case 20:
                return _context.abrupt("return", true);

              case 21:
                return _context.abrupt("return", true);

              case 22:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function upload() {
        return _upload.apply(this, arguments);
      }

      return upload;
    }()
  }, {
    key: "getUploadLink",
    value: function getUploadLink() {
      var _this3 = this;

      if (!isset(this.upload_link) || !isset(this.input.files[0])) {
        return Promise.resolve({
          result: true
        });
      }

      this.setState({
        loading: true
      });
      return axios.request({
        url: this.upload_link,
        method: 'post',
        data: {
          column: this.props.column,
          action: 'Upload',
          file: {
            'size': this.input.files[0].size
          }
        }
      }).then(function (response) {
        response = response['data'];

        _this3.setState({
          loading: false
        });

        return response;
      })["catch"](function (error) {
        _this3.setState({
          loading: false
        });

        console.log(error);
        error_handle(error);
      });
    }
  }, {
    key: "uploadData",
    value: function uploadData(url, token) {
      var _this4 = this;

      if (!isset(this.upload_link) || !isset(this.input.files[0])) {
        return Promise.resolve({
          result: true
        });
      }

      var formData = new FormData();
      formData.append('file', this.input.files[0]);
      formData.append('utoken', token);
      this.setState({
        loading: true
      });
      return axios.request({
        url: url,
        method: 'post',
        headers: {
          'content-type': 'multipart/form-data'
        },
        data: formData,
        onUploadProgress: function onUploadProgress(event) {
          _this4.setState({
            total: event.total,
            loaded: event.loaded
          });
        }
      }).then(function (response) {
        response = response['data'];

        _this4.setState({
          loading: false
        });

        return response;
      })["catch"](function (error) {
        _this4.setState({
          loading: false
        });

        console.log(error);
        error_handle(error);
      });
    }
  }, {
    key: "onChangeHandle",
    value: function onChangeHandle(event) {
      var file = event.target.files[0];
      var img = new Image();

      var _URL = window.URL || window.webkitURL;

      img.src = _URL.createObjectURL(file);
      this.setState({
        preview: img.src
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      this.initial();
      var loading = '';

      if (this.state.loading) {
        var percentage = Math.floor(95 * this.state.loaded / this.state.total);
        loading = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
          className: "progress",
          style: {
            height: 5
          }
        }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
          className: "progress-bar progress-bar-striped progress-bar-animated",
          role: "progressbar",
          style: {
            width: "".concat(percentage, "%")
          }
        }));
      }

      return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        className: "box_flex",
        style: {
          marginTop: 15,
          fontWeight: 'normal'
        }
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("label", {
        style: {
          marginBottom: 0
        },
        className: "button",
        htmlFor: this.unique
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("i", {
        className: "fa fa-cloud-upload"
      }), "\xA0Upload"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("input", _extends({
        id: this.unique,
        ref: function ref(input) {
          return _this5.input = input;
        },
        type: "file",
        style: {
          display: 'none'
        },
        onChange: function onChange(event) {
          _this5.onChangeHandle(event);
        }
      }, this.rent)), this.props.children), loading, this.state.preview != '' ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        className: 'box_border ' + this.className,
        style: {
          textAlign: 'center'
        }
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("img", {
        src: this.state.preview,
        style: {
          maxWidth: '80%'
        }
      }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        className: "close",
        onClick: function onClick() {
          _this5.setValue('');
        }
      }, "\xD7")) : '');
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (isset(this.props.value)) {
        this.setValue(this.props.value);
      }
    }
  }]);

  return InputImg;
}(react__WEBPACK_IMPORTED_MODULE_1__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (InputImg);

/***/ })

}]);