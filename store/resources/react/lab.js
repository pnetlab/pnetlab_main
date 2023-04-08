require('./bootstrap');
/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom'
import Loading from './components/common/Loading'
import ContextMenu from './components/common/ContextMenu'
import * as qs from 'query-string';

import '../assets/css/app.scss';
import './components/lab/type.scss';
import './components/input/responsive/input.scss';

import Timer from './components/lab/timer/Timer';
import Topo from './components/lab/topo/Topo';
import Wb_bar from './components/lab/workbook/viewer/Wb_bar';
import HTMLConsole from './components/lab/html/HTMLConsole';
import Wireshark from './components/lab/wireshark/Wireshark';
import TextControl from './components/lab/text/TextControl';
import LinkControl from './components/lab/link/LinkControl';
import LinkQuality from './components/lab/link/LinkQuality';
import LineControl from './components/lab/line/LineControl';
import LockLabModal from './components/lab/locklab/LockLabModal';
import LabBackground from './components/lab/background/LabBackground';
import Member from './components/lab/members/Members';
import NodeSize from './components/lab/node/NodeSize';
import StatusModal from './components/lab/status/StatusModal';
import NodeFolderModal from './components/lab/commit/NodeFolderModal';
import NodeCommitModal from './components/lab/commit/NodeCommitModal';
import IconEditor from './components/lab/image/IconEditor';

require('./components/lab/multiconfig/MultiCfgInit');
import topology from './components/lab/topology/topology';
import NodeForm from './components/lab/node/NodeForm';

global.App = {};
App.server = server;
App.pages = {};
App.parsed = {};

App.loading = (flag, text) => {
  App.Loading.loading(flag, text);
  return '';
}

App.getInitialProps = (search) => {
  var parsed = qs.parse(search);
  App.parsed = parsed;
}

App.isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}


App.onReadyRegister = [];
App.topology = new topology();
var dataProcess = App.topology.getTopoData()

var frame = document.createElement("div");
document.body.appendChild(frame)
render(<>
  <Loading ref={(loading) => { App.Loading = loading }} flag={false} text="Loading..." />
  <ContextMenu></ContextMenu>
  <IconEditor></IconEditor>
</>, frame);


var bottom = document.createElement("div");
bottom.setAttribute('class', 'bottom_frame box_flex')
document.body.appendChild(bottom)
render(<>
  <style>{`
    .bottom_frame{
      position: fixed;
      bottom: 5px;
      left: 0px;
      right: 0px;
      z-index: 1041;
      pointer-events: none;
      transition: all 0.2s ease-out;
    }
    :root {
      --ck-z-modal: 1060;
    }
    .bottom_frame *{
      pointer-events: auto;
    }
  `}</style>

  <link rel="stylesheet" href="/store/public/extensions/icons/css/font-awesome.min.css" media="all" type="text/css" />
  <Wb_bar></Wb_bar>

  <div className='box_flex' style={{ flexGrow: 1, pointerEvents: 'none' }}>
    <div className='box_flex' style={{ margin: 'auto', pointerEvents: 'auto' }}>
      <Wireshark></Wireshark>&nbsp;
      <HTMLConsole></HTMLConsole>
    </div>
  </div>

  <Topo></Topo>
  <Timer></Timer>
  <TextControl></TextControl>
  <NodeSize></NodeSize>
  <LinkControl></LinkControl>
  <LineControl ref={c => App.lineControl = c}></LineControl>
  <LinkQuality></LinkQuality>
  <LockLabModal></LockLabModal>
  <LabBackground></LabBackground>
  <StatusModal></StatusModal>
  <NodeFolderModal></NodeFolderModal>
  <NodeCommitModal></NodeCommitModal>
  <NodeForm></NodeForm>

</>, bottom, () => {
  
  dataProcess.then(() => {
    App.topology.printTopology()
    App.onReadyRegister.map(func =>{
      func();
    })
  })
  
});

render(<Member></Member>, document.getElementById('lab_members'))
















