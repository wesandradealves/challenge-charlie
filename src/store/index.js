import Vue from "vue";
import Vuex from "vuex";
import NProgress from "nprogress";

const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const credentials = new CognitiveServicesCredentials('acab0bd3fd0e416282ee74767b15c646');
const ImageSearchAPIClient = require('azure-cognitiveservices-imagesearch');
const client = new ImageSearchAPIClient(credentials);

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		err: false,
		calendar: [],
		selected: {
			day: 0,
			weather: 0
		},
		thumbnailUrl: '',
		temp: ''
	},
	actions: {
	    doGetThumbnailUrl({dispatch, state}, str) {
	    	NProgress.start();

			client.imagesOperations.search(decodeURI('céu ' + str), function (err, result, request, response) {
			 if (err) throw err;
			 state.thumbnailUrl = result.value[1].thumbnailUrl;
			 NProgress.done(); 
			});	
	    },		
	}
});
