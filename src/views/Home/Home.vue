<template>
	<div >
	    <v-style v-if="$store.state.thumbnailUrl">
	      #wrap {
	        background: url({{$store.state.thumbnailUrl}}) center center / cover no-repeat
	      } 
	    </v-style>		
	    <div class="form">
	    	<i>
	    		<img src="https://cdn2.iconfinder.com/data/icons/freecns-cumulus/32/519777-89_Compass-512.png" alt="">
	    	</i>
			<input placeholder="Busca..." type="text" v-model="s" @input="getData">
	    </div>
		<p v-if="$store.state.err">Ocorreram erros na sua busca.</p>
		<div v-else="!$store.state.err" class="days-wrapper">
			<div class="day" v-for="(day, index) in $store.state.calendar" :class="index === 0 ? 'toggle' : ''">
				<div class="inner">
					<weather-list :items="day.weather" :day="index" :date="day.date" />
				</div>
			</div>			
		</div>
	</div>
</template>

<script>
import Vue from "vue";
import { Carousel, Slide } from 'vue-carousel';
import weatherList from '@/components/weatherList/weatherList.vue';

const moment = require('moment');

import NProgress from "nprogress";

var vm = new Vue({
  data: {
  	calendar: [],
  	weathers: []
  }
});

Vue.component('v-style', {
  render: function(createElement) {
    return createElement('style', this.$slots.default)
  }
})

export default {

  name: 'Home',

  data() {
    return {
      timeout: null,
      s: '',
      keys: {
      	maps: 'AIzaSyC5QMfSnVnSCcmkFag0ygrXzj2QJ9usEG4',
      	opencagedata: 'e0af1c4d281c4c469dcf5f64241f226a',
      	openweather: '6dd5ca5d65de339faf1aa60fe4b4a9fa'
      },
      info: [],
      location: [],
    };
  }, 
  methods: {		
  	dateTime(string) {
		return moment(string).format("HH:mm");
  	},
  	formatDate(str) {
  		let date = !str ? moment().add(1,'days') : moment(str); 
  		return date.format("DD/MM/YYYY");
  	},
	array_unique(arr) { 
		const _ = require('lodash');

		return _.uniqWith(arr, _.isEqual);
	},  	
    filterByValue(array, value) { 
      return array.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1);
    },
    getData(v, timeout) {
    	var self = this;

    	clearTimeout(self.timeout);    	

		self.timeout = setTimeout(function () {
	    	self.$store.state.calendar = self.info = [];
		    moment.locale('pt');			

		    self.getAddress().then(response => {
		      NProgress.start();

		      fetch((self.s) ? 'https://api.opencagedata.com/geocode/v1/json?q='+encodeURI(self.s)+'&key='+self.keys.opencagedata : 'https://maps.googleapis.com/maps/api/geocode/json?key='+self.keys.maps+'&latlng=' + response.coords.latitude + ',' + response.coords.longitude, {
		        method: 'GET'
		      }).then(response => response.json())
		      .then(result => {
		      	let r = result.results.filter((data) =>  self.s && result.results.length ? data.components._type === 'state' && data.components.state.toLowerCase().indexOf(self.s.toLowerCase()) !== -1 : data.types.includes("administrative_area_level_1"));

		      	r = r[0];

		      	self.$store.state.err = false;

		      	if(self.s && result.results.length && r !== undefined) {
					self.location = r.geometry
		      	} else if(r !== undefined) {
					self.location = r.geometry.location
		      	} else {
		      		self.$store.state.err = !self.$store.state.err
		      	}
		      }).finally(() => {
		      	if(!self.$store.state.err) {
					fetch(`//api.openweathermap.org/data/2.5/forecast?lat=${self.location.lat}&lon=${self.location.lng}&appid=336a685c326c4e2eb0041535da37b389&lang=pt_BR&units=metric`, {
						method: 'GET'
					}).then(response => response.json())
					.then(result => {
						self.info = result.city;

						vm._data.weathers = result.list;

						for (const [key, item] of Object.entries(result.list)) {
							let date = moment(item.dt_txt.split(' ')[0], 'YYYY-MM-DD').format("DD/MM/YYYY");
							let compare = moment(item.dt_txt.split(' ')[0], 'YYYY-MM-DD').isBefore(moment(new Date(), 'YYYY-MM-DD').add(2,'days'));

							if(!self.$store.state.calendar.some(function(el) {
							    return el.date === date;
							}) && compare) {
								self.$store.state.calendar.push({
									date: date,
									weather: []
								});
							}

							for (const [k, i] of Object.entries(self.$store.state.calendar)) {
								if(i.date === date && !i.weather.includes(item)) {
									i.weather.push(item)
								}
							} 								
						}  						
					}).catch(err => {
						console.log(err);
					}).finally(() => {
						let currentWeather = self.$store.state.calendar.filter(function (e) {
						    return e.date === self.formatDate(new Date()) || e.date === self.formatDate();
						});

						self.$store.state.temp = Math.round(currentWeather[0].weather[0].main.temp);

						self.$store.dispatch('doGetThumbnailUrl', currentWeather[0].weather[0].weather[0].description)

						NProgress.done();  									
					})  
		      	} else {
		      		NProgress.done();
		      	}		        
		      })   
		    });			    
		}, 300);     	
    },
    getCoordinates() {
      return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    },    
    async getAddress() {
      return await this.getCoordinates();
    }
  },
  computed: {
    vm() {
      return vm;
    }  
  },
  mounted() {
  	this.getData();
  },
  components: {
  	weatherList,
    Carousel,
    Slide
  }  
}
</script>

<style lang="sass">

</style>