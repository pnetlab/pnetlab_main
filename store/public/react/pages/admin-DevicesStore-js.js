(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{628:function(e,t,n){"use strict";n.r(t);var o=n(0),a=n.n(o);n(726);function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e){return(i="function"==typeof Symbol&&"symbol"===r(Symbol.iterator)?function(e){return r(e)}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":r(e)})(e)}function l(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function c(e,t){return!t||"object"!==i(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function s(e){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function u(e,t){return(u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var f=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),c(this,s(t).call(this,e))}var n,o,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t)}(t,e),n=t,(o=[{key:"render",value:function(){var e=this,t=this.props.device;if("1"==t.available)var n=a.a.createElement("div",{style:{fontWeight:"bold",color:"green"}},a.a.createElement("i",{className:"fa fa-check-circle-o"})," ",lang("Added to PNET"));else n=a.a.createElement("div",{style:{fontWeight:"bold",color:"red"}},a.a.createElement("i",{className:"fa fa-bookmark"}),"  ",lang("New Device"));return a.a.createElement("div",{className:"lab_item"},a.a.createElement("div",{className:"box_shadow d-flex",style:{padding:7,width:"100%",flexDirection:"column",position:"relative"}},a.a.createElement("div",{className:"lab_item_image"},a.a.createElement("img",{style:{width:"50%"},src:file_public(t[DEVICE_IMG])})),a.a.createElement("strong",{className:"lab_item_name"},t[DEVICE_NAME]),a.a.createElement("p",{className:"lab_item_name",style:{flexGrow:1}},str_limit(t[DEVICE_DES],80)),a.a.createElement("div",null,n),a.a.createElement("div",{className:"box_flex",style:{marginTop:5}},a.a.createElement("button",{className:"btn button btn-sm btn-primary",onClick:function(){e.props.onDownload&&e.props.onDownload(t[DEVICE_ID])}},"Get Device")," ",a.a.createElement("a",{target:"_blank",href:"".concat(App.server.common.APP_CENTER,"/store/devices/guide?id=").concat(t[DEVICE_ID])},a.a.createElement("button",{className:"btn button btn-sm btn-info"},lang("Guide")))),"1"==t.available?a.a.createElement("div",{className:"close",title:lang("Delete Device"),onClick:function(){e.props.onDelete&&e.props.onDelete(t[DEVICE_ID])},style:{position:"absolute",top:7,right:10,cursor:"pointer"}},"×"):""))}}])&&l(n.prototype,o),r&&l(n,r),t}(o.Component),d=n(133);function m(e){return(m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function p(e){return(p="function"==typeof Symbol&&"symbol"===m(Symbol.iterator)?function(e){return m(e)}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":m(e)})(e)}function b(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function y(e,t){return!t||"object"!==p(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function h(e){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function g(e,t){return(g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var v=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=y(this,h(t).call(this,e))).id=makeId(),n.isHide=!0,n.state={log:""},n}var n,o,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}(t,e),n=t,(o=[{key:"modal",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"show";"hide"==e?($("#"+this.id).modal("hide"),this.isHide=!0):($("#"+this.id).modal(),this.isHide=!1)}},{key:"setLog",value:function(e){e||(e=""),this.setState({log:e});var t=document.getElementById("".concat(this.id,"_log"));t.scrollTop=t.scrollHeight}},{key:"getLog",value:function(){return this.state.log}},{key:"componentDidMount",value:function(){var e=$("#".concat(this.id)),t=$("#".concat(this.id," .modal-content"));e.draggable({handle:".modal-header"}),t.resizable({minHeight:300,minWidth:300})}},{key:"setPostion",value:function(e,t){$("#".concat(this.id)).css({left:e,top:t})}},{key:"render",value:function(){return a.a.createElement("div",{className:"modal fade click",id:this.id,"data-backdrop":"false","data-keyboard":"false",style:{height:0,overflow:"unset",top:30,left:"25%",zIndex:"1000000"}},a.a.createElement("div",{className:"modal-dialog modal-lg",role:"document",style:{margin:0,height:0}},a.a.createElement("div",{className:"modal-content",style:{minHeight:300,flexDirection:"column",display:"flex",height:500}},a.a.createElement("div",{className:"modal-header",style:{height:"30px",minHeight:"unset",cursor:"move",padding:"2px 5px",fontWeight:"bold",color:"white",background:"#225baf"}},a.a.createElement("span",{className:"modal-title"},lang("Device Logs")),a.a.createElement("i",{type:"button",className:"close","data-dismiss":"modal","aria-hidden":"true",style:{color:"white"}},"×")),a.a.createElement("div",{id:"".concat(this.id,"_log"),className:"box_padding",style:{flexGrow:1,overflow:"auto",whiteSpace:"pre-line"}},this.state.log))))}}])&&b(n.prototype,o),r&&b(n,r),t}(o.Component);function E(e){return(E="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _(e){return(_="function"==typeof Symbol&&"symbol"===E(Symbol.iterator)?function(e){return E(e)}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":E(e)})(e)}function w(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function x(e,t){return!t||"object"!==_(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function S(e){return(S=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function N(e,t){return(N=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var D=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=x(this,S(t).call(this,e))).state={devices:[],search:"",filter:"",limit:16},n.unit=16,n.devices=[],n.downloader=new d.default((function(e){""!=e&&e!=n.deviceLog.getLog()&&(n.deviceLog.modal(),n.deviceLog.setLog(e))})),n.downloader.onFinish=function(){n.loadDevices()},n}var n,o,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&N(e,t)}(t,e),n=t,(o=[{key:"render",value:function(){var e=this,t=this.state.devices.slice(0,this.state.limit);return a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{className:"box_padding"},a.a.createElement("div",{className:"box_flex"},a.a.createElement("div",{className:"title"},a.a.createElement("i",{className:"fa fa-cog"})," ",lang("Devices")),a.a.createElement("div",{style:{margin:"auto 15px auto auto"}},a.a.createElement("select",{className:"box_border",style:{padding:7,borderRadius:5,lineHeight:"14px"},value:this.state.filter,onChange:function(t){e.setState({filter:t.target.value},(function(){e.filter()}))}},a.a.createElement("option",{value:""},lang("All")),a.a.createElement("option",{value:"1"},lang("Added to PNET")),a.a.createElement("option",{value:"0"},lang("New Devices")))," ",a.a.createElement("input",{className:"box_border",style:{padding:7,borderRadius:5,lineHeight:"14px"},placeholder:"Search",value:this.state.search,onChange:function(t){e.setState({search:t.target.value})},onBlur:function(){e.filter()}}))),a.a.createElement("div",{className:"row"},0==t.length?a.a.createElement("a",{style:{width:"100%"}},a.a.createElement("div",{style:{width:"100%"},className:"alert alert-warning",role:"alert"},lang("No device available"))):a.a.createElement(a.a.Fragment,null,t.map((function(t){return a.a.createElement(f,{key:t[DEVICE_ID],device:t,onDownload:function(t){return e.downloader.download(t)},onDelete:function(t){return e.downloader.delete(t)}})})))),this.state.limit<this.state.devices.length?a.a.createElement("div",{className:"box_flex",style:{justifyContent:"center"}},a.a.createElement("div",{className:"loadmore button",onClick:function(){e.setState({limit:e.state.limit+e.unit})}},"Load More")):""),a.a.createElement(v,{ref:function(t){return e.deviceLog=t}}))}},{key:"componentDidMount",value:function(){this.loadDevices()}},{key:"filter",value:function(){var e=this,t=this.devices;if(""!=this.state.search){var n=this.state.search.toLowerCase();t=t.filter((function(e){return-1!==(e[DEVICE_NAME]+e[DEVICE_DES]).toLowerCase().indexOf(n)}))}""!==this.state.filter&&(t=t.filter((function(t){return t.available==e.state.filter}))),this.setState({devices:t,limit:this.unit})}},{key:"loadDevices",value:function(){var e=this;return App.loading(!0,"Loading..."),axios.request({url:"/store/public/admin/devices/filter",method:"post"}).then((function(t){if(App.loading(!1),!(t=t.data).result)return error_handle(t),!1;e.devices=t.data,e.filter()})).catch((function(e){return console.log(e),App.loading(!1),error_handle(e),!1}))}}])&&w(n.prototype,o),r&&w(n,r),t}(o.Component);t.default=D},726:function(e,t,n){var o=n(727);"string"==typeof o&&(o=[[e.i,o,""]]);var a={hmr:!0,transform:void 0,insertInto:void 0};n(19)(o,a);o.locals&&(e.exports=o.locals)},727:function(e,t,n){(e.exports=n(18)(!1)).push([e.i,".lab_item_image {\n  border: solid thin darkgray;\n  padding: 0px;\n  height: 150px;\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-bottom: 5px;\n  overflow: hidden;\n}\n\n.lab_item_name {\n  margin-bottom: 5px;\n  color: #17a2b8;\n}\n\n.lab_item_image {\n  position: relative;\n}\n.lab_item_image img {\n  width: 100%;\n}\n.lab_item_image .cover {\n  justify-content: center;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background: rgba(0, 0, 0, 0.3);\n  display: none;\n}\n.lab_item_image .cover div {\n  border: solid thin rgba(255, 255, 255, 0.5);\n  border-radius: 5px;\n  padding: 7px;\n  color: white;\n  background: rgba(255, 255, 255, 0.1);\n}\n.lab_item_image:hover .cover {\n  display: flex;\n}\n\n.lab_item {\n  padding: 7px;\n  color: #666;\n  display: flex;\n}\n\n.loadmore.button {\n  padding: 5px;\n  background: rgba(13, 39, 77, 0.1);\n  margin: 15px;\n  border-radius: 10px;\n  color: #ffffff;\n  font-weight: bold;\n  width: 50%;\n  min-width: 200px;\n  text-align: center;\n}\n\n@media only screen and (min-width: 768px) {\n  .lab_item {\n    width: 12.5%;\n    max-width: 250px;\n    min-width: 200px;\n  }\n\n  .lab_frame {\n    margin-left: 160px;\n  }\n}\n@media only screen and (max-width: 768px) {\n  .lab_item {\n    width: 50%;\n  }\n\n  .lab_frame {\n    margin-left: 0px;\n  }\n\n  .lab_control {\n    display: none;\n  }\n}",""])}}]);