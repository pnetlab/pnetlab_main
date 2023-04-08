(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["./store/public/react/pages/admin-User_rolesView-js~./store/public/react/pages/admin-UsersOffline-js~~2e9e45b3"],{

/***/ "./store/resources/react/components/func/FuncFolderPlat.js":
/*!*****************************************************************!*\
  !*** ./store/resources/react/components/func/FuncFolderPlat.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_Loading__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/Loading */ "./store/resources/react/components/common/Loading.js");
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




var FolderFlat =
/*#__PURE__*/
function (_Component) {
  _inherits(FolderFlat, _Component);

  function FolderFlat(props) {
    var _this;

    _classCallCheck(this, FolderFlat);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FolderFlat).call(this, props));
    _this.state = {
      files: [],
      folders: [],
      folder: _this.props.folder,
      workspace: '',
      editing: '',
      editing_value: ''
    };
    _this.parent = _this.props.parent;
    return _this;
  }

  _createClass(FolderFlat, [{
    key: "setFolder",
    value: function setFolder(folder) {
      var _this2 = this;

      var reload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (!folder || folder == '') folder = this.props.folder;
      this.setState({
        folder: folder,
        editing: '',
        workspace: ''
      }, function () {
        if (reload) _this2.loadFolder();
      });
    }
  }, {
    key: "setWorkSpace",
    value: function setWorkSpace(path) {
      var _this3 = this;

      if (!path) path = '';
      this.setState({
        workspace: path,
        editing: ''
      }, function () {
        _this3.loadFolder();
      });
    }
  }, {
    key: "getWorkSpace",
    value: function getWorkSpace() {
      return this.state.workspace;
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var except = get(this.props.except, []);
      var splits = this.state.workspace.split('/');
      var workspaceArray = [];
      splits.map(function (item) {
        if (item != '') workspaceArray.push(item);
      });
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ol", {
        className: "breadcrumb",
        style: {
          margin: 0,
          padding: '5px',
          position: 'relative'
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
        className: "breadcrumb-item button",
        onClick: function onClick() {
          _this4.setWorkSpace('');
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fa fa-folder",
        style: {
          color: '#dfba49'
        }
      }), "\xA0", this.state.folder.replace(/.*\//, '')), workspaceArray.map(function (item, key) {
        var path = '/' + workspaceArray.slice(0, key + 1).join('/');
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
          key: key,
          className: "breadcrumb-item button",
          onClick: function onClick() {
            _this4.setWorkSpace(path);
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fa fa-folder",
          style: {
            color: '#dfba49'
          }
        }), "\xA0", item);
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          position: 'absolute',
          right: 5,
          top: 0,
          bottom: 0,
          background: 'inherit'
        },
        className: "box_flex"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        title: "Add New Folder",
        className: "fa fa-plus-circle button",
        onClick: function onClick() {
          _this4.addNewFolder();
        }
      })))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          paddingLeft: 10,
          overflow: 'auto',
          height: this.props.height ? this.state.height : 200
        }
      }, this.state.folders.map(function (item, key) {
        var folderName = item.split('/').pop();
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: "folder_item",
          key: key,
          style: {
            display: except.includes(folderName) ? 'none' : 'block',
            position: 'relative'
          }
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fa fa-folder",
          style: {
            color: '#dfba49'
          }
        }), "\xA0", _this4.state.editing == folderName ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
          ref: function ref(c) {
            return _this4.editingInput = c;
          },
          type: "text",
          onBlur: function onBlur() {
            _this4.editFolder();
          },
          value: _this4.state.editing_value,
          onChange: function onChange(e) {
            _this4.setState({
              editing_value: e.target.value
            });
          }
        }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
          className: "button",
          onClick: function onClick() {
            _this4.setWorkSpace(_this4.state.workspace + '/' + folderName);
          }
        }, folderName), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          style: {
            position: 'absolute',
            right: 5,
            top: 0,
            bottom: 0,
            background: 'inherit'
          },
          className: "box_flex folder_buttons"
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          style: {
            padding: 5
          },
          title: "Edit Folder",
          className: "fa fa-edit button",
          onClick: function onClick(e) {
            e.stopPropagation();

            _this4.setState({
              editing: folderName,
              editing_value: folderName
            });
          }
        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          style: {
            padding: 5
          },
          title: "Delete Folder",
          className: "fa fa-close button",
          onClick: function onClick(e) {
            e.stopPropagation();

            _this4.deleteFolder(folderName);
          }
        })));
      }), this.state.files.map(function (item, key) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: key
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
          className: "fa fa-file-text-o",
          style: {
            color: 'gray'
          }
        }), "\xA0", item.split('/').pop());
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: {
          position: 'relative'
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_common_Loading__WEBPACK_IMPORTED_MODULE_1__["default"], {
        ref: function ref(c) {
          return _this4.load = c;
        },
        style: {
          position: 'absolute'
        }
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("style", null, "\n                    .folder_item .folder_buttons{\n                        display: none;\n                    }\n                    .folder_item:hover .folder_buttons{\n                        display: flex;\n                    }\n\n                "));
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setWorkSpace('');
    }
  }, {
    key: "loadFolder",
    value: function loadFolder() {
      var _this5 = this;

      if (!this.props.link) return;
      this.load.loading(true);
      return axios.request({
        url: this.props.link,
        method: 'post',
        data: {
          folder: this.state.folder + this.state.workspace
        }
      }).then(function (response) {
        response = response['data'];

        _this5.load.loading(false);

        if (response['result']) {
          _this5.setState({
            folders: response['data']['folders'],
            files: response['data']['files']
          }, function () {
            if (_this5.editingInput) _this5.editingInput.focus();
          });
        }
      })["catch"](function (error) {
        _this5.load.loading(false);

        error_handle(error);
      });
    }
  }, {
    key: "addNewFolder",
    value: function addNewFolder() {
      var _this6 = this;

      var newFolder = 'New Folder';
      var index = 1;

      while (this.state.folders.find(function (item) {
        var folderName = item.split('/').pop();
        return folderName == newFolder;
      }) !== undefined) {
        newFolder = 'New Folder ' + index;
        index++;
      }

      var path = this.state.folder + this.state.workspace;
      path = path.replace('/opt/unetlab/labs', '');
      App.loading(true);
      return axios.request({
        url: '/api/folders/add',
        method: 'post',
        data: {
          path: path,
          name: newFolder
        }
      }).then(function (response) {
        response = response['data'];
        App.loading(false);

        if (response['status'] == 'success') {
          _this6.setState({
            editing: newFolder,
            editing_value: newFolder
          });

          _this6.loadFolder();
        } else {
          error_handle(response);
        }
      })["catch"](function (error) {
        App.loading(false);
        error_handle(error);
      });
    }
  }, {
    key: "editFolder",
    value: function editFolder() {
      var _this7 = this;

      if (this.state.editing == this.state.editing_value) {
        this.setState({
          editing: '',
          editing_value: ''
        });
        return;
      }

      var path = this.state.folder + '/' + this.state.editing;
      var new_path = this.state.folder + '/' + this.state.editing_value;
      path = path.replace('/opt/unetlab/labs', '');
      new_path = new_path.replace('/opt/unetlab/labs', '');
      App.loading(true);
      return axios.request({
        url: '/api/folders/edit',
        method: 'post',
        data: {
          path: path,
          new_path: new_path
        }
      }).then(function (response) {
        response = response['data'];
        App.loading(false);

        if (response['status'] == 'success') {
          _this7.setState({
            editing: '',
            editing_value: ''
          }, function () {
            _this7.loadFolder();
          });
        } else {
          error_handle(response);
        }
      })["catch"](function (error) {
        App.loading(false);
        error_handle(error);
      });
    }
  }, {
    key: "deleteFolder",
    value: function deleteFolder(path) {
      var _this8 = this;

      var delPath = this.state.folder + '/' + path;
      delPath = delPath.replace('/opt/unetlab/labs', '');
      makeQuestion('Do you want to Delete this Folder?', 'Yes', 'Cancel').then(function (response) {
        if (response) {
          App.loading(true);
          return axios.request({
            url: '/api/folders/delete',
            method: 'post',
            data: {
              path: delPath
            }
          }).then(function (response) {
            response = response['data'];
            App.loading(false);

            if (response['status'] == 'success') {
              _this8.setState({
                editing: '',
                editing_value: ''
              }, function () {
                _this8.loadFolder();
              });
            } else {
              error_handle(response);
            }
          })["catch"](function (error) {
            App.loading(false);
            error_handle(error);
          });
        }
      });
    }
  }]);

  return FolderFlat;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (FolderFlat);

/***/ })

}]);