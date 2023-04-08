require('./bootstrap');
/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
 
import React from 'react';
import { render } from 'react-dom'
import * as qs from 'query-string';
import AddLabModal from './components/main/lab/AddLabModal';
import EditLabModal from './components/main/lab/EditLabModal';

import '../assets/css/app.scss';
import './components/main/main.scss';
import './components/input/responsive/input.scss';
import PreviewFrame from './components/main/preview/PreviewFrame';
import CheckLabSession from './components/realtime/CheckLabSession'; 
import MenuClient from './components/menu/MenuClient';
import Loading from './components/common/Loading';
import SearchLabBox from './components/main/lab/SearchLabBox';
import MoveFolderLab from './components/main/move/MoveFolderLab';
import LineControl from './components/lab/line/LineControl';
import LinkControl from './components/lab/link/LinkControl';

global.App = {};
App.server = server;
App.pages = {};
App.parsed = {};

App.loading = (flag, text) => {
	App.Loading.loading(flag,text);
	return '';
}

App.getInitialProps = (search) => {
	var parsed = qs.parse(search);
	App.server = {...App.server, ...parsed};
	App.parsed = parsed;
}
App.getInitialProps(window.location.href.replace(/.*\?/,'?'));

App.isMobile=()=>{
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

global.scope = angular.element(document.getElementById('unlMainAppId')).scope();



render (<MenuClient></MenuClient>, document.getElementById('main_header')); 

if(window.location.href.includes('main')){
    render (<><PreviewFrame></PreviewFrame></>, document.getElementById('lab_preview')); 
    render (<SearchLabBox></SearchLabBox>, document.getElementById('search_lab_box')); 
    
    var bottom = document.createElement("div");
    document.body.appendChild(bottom)
    render(<>
        <Loading ref={(loading) => {App.Loading = loading}} flag={false} text="Loading..."/>
        <AddLabModal></AddLabModal>
        <EditLabModal></EditLabModal>
        <MoveFolderLab></MoveFolderLab>
        <CheckLabSession callback={(result)=>{
            if(result != null && result != '') window.location='/legacy/topology';
        }}></CheckLabSession>
    </>, bottom);
}

 
	

	


	