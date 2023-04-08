require('./bootstrap');


 
/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
 
import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom'
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';
import Layout from './components/common/Layout'
import Loading from './components/common/Loading'
import * as qs from 'query-string';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../assets/css/app.scss';
import './components/admin/style.scss'
import Axios from 'axios';
global.App = {};
App.server = server;
App.pages = {};
App.parsed = {};

 
var pageLoader = require.context('./pages/', true, /\.js$/, 'lazy');
pageLoader.keys().forEach((key) => {
	var match = /.*\/([^\/]+)\/([^\.]+)\.js/.exec(key);
	if(match){
		var pageName = match[1]+match[2];
		if(match[1]=='servey') return;
		App.pages[pageName.toLowerCase()] = lazy(() => {  return import(/* webpackChunkName: "./store/public/react/pages/[request]" */'./pages/'+match[1]+'/'+match[2]+'.js')} );
	}
	
});
	
App.loading = (flag, text) => {
	App.Loading.loading(flag,text);
	return '';
}

App.getInitialProps = (search) => {
	var parsed = qs.parse(search);
	App.server = {...App.server, ...parsed};
	App.parsed = parsed;
}

App.isMobile=()=>{
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

global.LANGUAGE = get(localStorage.getItem('language'), '');


axios.request({
	url: '/store/public/admin/default/language',
	method: 'get',
	params: {lang: LANGUAGE},
})

.then(response => {
	response = response['data'];
	if (!response['result']) {
		return false;
	} else {
		global.LANG = response['data'];
		console.log(get(response['log'], ''));
	}
})

.then(res => {
	render (<Router ref={router => App.router = router}>

		<Layout ref={layout => App.Layout = layout}>

			<Suspense fallback={<Loading flag={true} text="Loading..."/>}>
			
				<Switch>
					<Route ref={route => App.route = route} path="/store/public/:folder/:page/:func" 
						
						component={(props)=>{
							App.getInitialProps(props.location.search);
							var pageIndex =  props.match.params.folder +  props.match.params.page +  props.match.params.func
							var activePage = props.match.params.page;
							App.activePage = activePage;
							var Page = App.pages[pageIndex];
							
							if(Page){
								return(<Page/>);
							}else{
								return '';
							}
							
					}}/>

				</Switch>
			 
			</Suspense>
		
		<Loading ref={(loading) => {App.Loading = loading}} flag={false} text="Loading..."/>

		</Layout>

	</Router>, document.getElementById('app')); 
})

.catch((error)=>{
	console.log(error);
	App.loading(false);
	error_handle(error);
})


 

 
	

	


	