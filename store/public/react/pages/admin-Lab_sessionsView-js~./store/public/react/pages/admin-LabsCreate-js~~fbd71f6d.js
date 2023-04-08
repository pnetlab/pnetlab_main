(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["./store/public/react/pages/admin-Lab_sessionsView-js~./store/public/react/pages/admin-LabsCreate-js~~fbd71f6d"],{

/***/ "./store/resources/react/components/input/FormFileSuggest.js":
/*!*******************************************************************!*\
  !*** ./store/resources/react/components/input/FormFileSuggest.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _common_Style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/Style */ "./store/resources/react/components/common/Style.js");
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




var FormFileSuggest =
/*#__PURE__*/
function (_Component) {
  _inherits(FormFileSuggest, _Component);

  function FormFileSuggest(props) {
    var _this;

    _classCallCheck(this, FormFileSuggest);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormFileSuggest).call(this, props));
    _this.id = makeId();
    _this.state = {
      files: [],
      directories: {},
      pwd: '',
      selects: {},
      value: ''
    };
    _this.selects = {};
    _this.page = 1;
    _this.number = 20;
    _this.onSelect = get(_this.props.onSelect, null);
    _this.column = get(_this.props.column, '');
    _this.table = get(_this.props.table, '');
    _this.type = get(_this.props.type, '');
    _this.link = get(_this.props.link, '');
    _this.decorator = get(_this.props.decorator, null);
    return _this;
  }

  _createClass(FormFileSuggest, [{
    key: "setOnSelect",
    value: function setOnSelect(onSelect) {
      this.onSelect = onSelect;
    }
  }, {
    key: "setColumn",
    value: function setColumn(column) {
      this.column = column;
    }
  }, {
    key: "setTable",
    value: function setTable(table) {
      this.table = table;
    }
  }, {
    key: "setType",
    value: function setType(type) {
      this.type = type;
    }
  }, {
    key: "setLink",
    value: function setLink(link) {
      this.link = link;
    }
  }, {
    key: "setDecorator",
    value: function setDecorator(decorator) {
      this.decorator = decorator;
    }
  }, {
    key: "modal",
    value: function modal() {
      var cmd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'show';

      if (cmd == 'hide') {
        $("#file_mng_modal" + this.id).modal('hide');
      } else {
        $("#file_mng_modal" + this.id).modal();
      }
    }
  }, {
    key: "updatePage",
    value: function updatePage(vector) {
      var oldPage = this.page;

      if (vector == 'up') {
        if (count(this.state.files) >= this.number) {
          this.page++;
        }
      } else {
        this.page--;
      }

      if (this.page <= 0) this.page = 1;

      if (oldPage != this.page) {
        this.scand();
      }
    }
  }, {
    key: "scand",
    value: function scand() {
      var _this2 = this;

      axios.request({
        url: this.link,
        method: 'post',
        data: {
          'column': this.column,
          'action': 'History',
          'page': this.page,
          'number': this.number
        }
      }).then(function (response) {
        response = response['data'];

        if (response['result']) {
          _this2.setState({
            files: response['data']
          });
        } else {
          return Promise.reject(response);
        }
      })["catch"](function (error) {
        console.log(error);
        error_handle(error);
      });
    }
  }, {
    key: "deleteFiles",
    value: function () {
      var _deleteFiles = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        var files, i;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                files = this.state.selects;
                _context.t0 = _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.keys(files);

              case 2:
                if ((_context.t1 = _context.t0()).done) {
                  _context.next = 8;
                  break;
                }

                i = _context.t1.value;
                _context.next = 6;
                return this.deleteFile(files[i]);

              case 6:
                _context.next = 2;
                break;

              case 8:
                this.scand();

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function deleteFiles() {
        return _deleteFiles.apply(this, arguments);
      }

      return deleteFiles;
    }()
  }, {
    key: "deleteFile",
    value: function deleteFile(file) {
      var _this3 = this;

      App.loading(true, 'Deleting...');
      return axios.request({
        url: this.link,
        method: 'post',
        data: {
          'action': 'Delete',
          'file': file[FILE_PATH]
        }
      }).then(function (response) {
        App.loading(false, 'Deleting...');
        response = response['data'];

        if (response['result']) {
          delete _this3.selects[file[FILE_PATH]];
        } else {
          return Promise.reject(response);
        }
      })["catch"](function (error) {
        App.loading(false, 'Deleting...');
        console.log(error);
        error_handle(error);
      });
    }
  }, {
    key: "downloadFile",
    value: function () {
      var _downloadFile = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {
        var files, i;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                files = this.state.selects;
                _context2.t0 = _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.keys(files);

              case 2:
                if ((_context2.t1 = _context2.t0()).done) {
                  _context2.next = 8;
                  break;
                }

                i = _context2.t1.value;
                _context2.next = 6;
                return this.readFile(files[i]);

              case 6:
                _context2.next = 2;
                break;

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function downloadFile() {
        return _downloadFile.apply(this, arguments);
      }

      return downloadFile;
    }()
  }, {
    key: "readFile",
    value: function readFile(file) {
      App.loading(true, 'Downloading...');
      return axios.request({
        url: this.link,
        method: 'post',
        data: {
          'action': 'Read',
          'file': file[FILE_PATH]
        },
        responseType: 'blob'
      }).then(function (response) {
        App.loading(false, 'Downloading...');
        response = response['data'];
        var blob = new Blob([response]);
        var a = document.createElement('a');
        a.download = file.replace(/^.*[\\\/]/, '');
        a.href = URL.createObjectURL(blob);
        a.click();
      })["catch"](function (error) {
        App.loading(false, 'Downloading...');
        console.log(error);
        error_handle(error);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var files = [];

      var _loop = function _loop(i) {
        var file = _this4.state.files[i];
        var fileLink = file[FILE_PATH];
        var filePreview = file[FILE_PATH];
        if (_this4.decorator) filePreview = _this4.decorator(filePreview);
        var fileName = file[FILE_NAME];
        fileExtension = fileName.split('.').pop().toLocaleLowerCase();
        fileIcon = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("i", {
          className: "fa fa-file-text-o"
        });

        if (/jpeg|png|jpg|tiff|gif/.test(fileExtension)) {
          fileIcon = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("img", {
            src: filePreview
          });
        }

        files.push(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
          title: fileLink,
          className: "file_item",
          key: i
        }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("label", {
          style: {
            justifyContent: 'center',
            width: '100%'
          }
        }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("input", {
          checked: isset(_this4.state.selects[fileLink]) && _this4.state.selects[fileLink],
          onChange: function onChange(event) {
            if (window.event.ctrlKey) {
              if (event.target.checked) {
                _this4.selects[fileLink] = file;
              } else {
                delete _this4.selects[fileLink];
              }
            } else {
              _this4.selects = [];
              _this4.selects[fileLink] = file;
            }

            _this4.setState({
              selects: _this4.selects,
              value: fileLink
            });
          },
          className: "file_select",
          type: "checkbox"
        }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
          className: "file_icon"
        }, fileIcon, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
          className: "file_name"
        }, fileName)))));
      };

      for (var i in this.state.files) {
        var fileExtension;
        var fileIcon;

        _loop(i);
      }

      return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        className: "modal fade",
        id: "file_mng_modal" + this.id
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        className: "modal-dialog modal-lg modal-dialog-centered"
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        className: "modal-content"
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        className: "modal-header"
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h4", {
        className: "modal-title"
      }, lang(this.state.pwd)), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("button", {
        type: "button",
        className: "close",
        "data-dismiss": "modal"
      }, "\xD7")), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        className: "modal-body",
        style: {
          textAlign: 'initial'
        }
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        style: {
          display: 'flex'
        }
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        style: {
          marginLeft: 0
        }
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        style: {
          display: 'flex'
        }
      }, this.page == 1 ? '' : react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", {
        className: "file_page button",
        onClick: function onClick() {
          return _this4.updatePage('down');
        }
      }, '<')), count(this.state.files) < this.number ? '' : react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", {
        className: "file_page button",
        onClick: function onClick() {
          return _this4.updatePage('up');
        }
      }, '>'))))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        style: {
          marginRight: 0,
          marginLeft: 'auto',
          display: 'flex'
        }
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        className: "button box_flex",
        title: "Delete selected",
        onClick: function onClick() {
          _this4.deleteFiles();
        },
        style: {
          display: 'flex'
        }
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("i", {
        className: "fa fa-trash"
      }), "\xA0", lang("Delete")), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        className: "button box_flex",
        title: "Download selected",
        onClick: function onClick() {
          _this4.downloadFile();
        },
        style: {
          display: 'flex'
        }
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("i", {
        className: "fa fa-save"
      }), "\xA0", lang("Download")))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        className: "file_container"
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_common_Style__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "file_manager_css"
      }, "\n\t\t\t\t\t\t\t\t\t\t.file_container {\n\t\t\t\t\t\t\t\t\t\t\tdisplay: flex;\n\t\t\t\t\t\t\t\t\t\t\tflex-wrap: wrap;\n\t\t\t\t\t\t\t\t\t\t\tmargin-top: 15px;\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t.file_item {\n\t\t\t\t\t\t\t\t\t\t    border-radius: 5px;\n\t\t\t\t\t\t\t\t\t\t    padding: 5px;\n\t\t\t\t\t\t\t\t\t\t    text-align: center;\n\t\t\t\t\t\t\t\t\t\t    width: 100px;\n\t\t\t\t\t\t\t\t\t\t    align-items: center;\n\t\t\t\t\t\t\t\t\t\t    overflow: hidden;\n\t\t\t\t\t\t\t\t\t\t    margin: 4px;\n\t\t\t\t\t\t\t\t\t\t\tposition: relative;\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t.file_name {\n\t\t\t\t\t\t\t\t\t\t\twidth: 100%;\n\t\t\t\t\t\t\t\t\t\t\tfont-size: small;\n\t\t\t\t\t\t\t\t\t\t\tmargin-top: 5px;\n\t\t\t\t\t\t\t\t\t\t\tcolor: #607D8B;\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t.file_icon {\n\t\t\t\t\t\t\t\t\t\t\tpadding: 5px;\n\t\t\t\t\t\t\t\t    \t\tborder-radius: 4px;\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t.file_icon i{\n\t\t\t\t\t\t\t\t\t\t\tfont-size: 40px;\n\t\t\t\t\t\t\t\t\t\t\tcolor: #607D8B;\n\t\t\t\t\t\t\t\t\t\t\t-webkit-text-stroke: 1px white;\n\t\t\t\t\t\t\t\t\t\t\tcursor: pointer;\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t.file_icon img{\n\t\t\t\t\t\t\t\t\t\t\twidth:40px;\n\t\t\t\t\t\t\t\t\t\t\tcursor: pointer;\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t.file_select {\n\t\t\t\t\t\t\t\t\t\t\tdisplay:none;\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t.file_page {\n\t\t\t\t\t\t\t\t\t\t\tline-height: 1.25;\n\t\t\t\t\t\t\t\t\t\t    color: #607d8b;\n\t\t\t\t\t\t\t\t\t\t    background-color: #fff;\n\t\t\t\t\t\t\t\t\t\t    border: 1px solid #dee2e6;\n\t\t\t\t\t\t\t\t\t\t    padding: 5px 10px;\n\t\t\t\t\t\t\t\t\t\t    border-radius: 4px;\n\t\t\t\t\t\t\t\t\t\t    margin: 2px;\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t.file_select:checked ~ .file_icon {\n\t\t\t\t\t\t\t\t\t\t    background: #e5e5e5;\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t"), files), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        className: "modal-footer"
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("button", {
        type: "button",
        className: "btn btn-primary",
        onClick: function onClick() {
          _this4.onSelect(_this4.state.value);

          _this4.modal('hide');
        }
      }, lang('Select')), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("button", {
        type: "button",
        className: "btn btn-danger",
        "data-dismiss": "modal"
      }, lang("Close"))))))));
    }
  }]);

  return FormFileSuggest;
}(react__WEBPACK_IMPORTED_MODULE_1__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (FormFileSuggest);

/***/ })

}]);