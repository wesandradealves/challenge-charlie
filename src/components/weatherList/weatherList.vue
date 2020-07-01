<template>
	<div class="weather-wrapper" :class="`weather-${day}`">
	  <button @click="tick('prev')"><i class="fas fa-angle-left"></i></button>
	  <div class="weather-wrapper-inner">
		  <div class="weather" v-for="(item, index) in items"  v-show="index === selectedWeather">
		  	<div class="content-wrapper">
				<div v-for="weather in item.weather">
					<img :src="`http://openweathermap.org/img/wn/${weather.icon}@2x.png`" alt="" />
				</div>
				<div>
					{{returnDay(date)}}
					<h4 class="temp">{{Math.round(parseFloat(item.main.temp))}} <small>ºC</small><br/></h4>
					<h3 v-for="weather in item.weather">
						{{weather.description}} 
					</h3>				
					<small class="hour">{{dateTime(item.dt_txt)}}</small>
					<p>
						<b>Vento:</b> {{item.wind.speed}}km/h<br/>
						<b>Humidade:</b> {{item.main.humidity}}%<br/>
						<b>Pressão:</b> {{item.main.pressure}}hPA						
					</p>
				</div>					  		
		  	</div>
		  </div>					  	
	  </div>
	  <button @click="tick('next')"><i class="fas fa-angle-right"></i></button>	
	    <v-style v-if="$store.state.thumbnailUrl">
	      .weather-0 {
			background: linear-gradient(-115deg, {{ ($store.state.temp <= 15) ? 'rgba(7,185,177,.3)' : ( ($store.state.temp >= 35) ? 'rgba(185,7,7,.6)' : 'rgba(255,157,8,.6)') }} 0%, {{ ($store.state.temp <= 15) ? 'rgba(7,185,177,.6)' : ( ($store.state.temp >= 35) ? 'rgba(185,7,7,.6)' : 'rgba(255,157,8,.6)') }} 100%);
			background: -moz-linear-gradient(-115deg, {{ ($store.state.temp <= 15) ? 'rgba(7,185,177,.6)' : ( ($store.state.temp >= 35) ? 'rgba(185,7,7,.6)' : 'rgba(255,157,8,.6)') }} 0%, {{ ($store.state.temp <= 15) ? 'rgba(7,185,177,.6)' : ( ($store.state.temp >= 35) ? 'rgba(185,7,7,.6)' : 'rgba(255,157,8,.6)') }} 100%);
			background: -webkit-linear-gradient(-115deg, {{ ($store.state.temp <= 15) ? 'rgba(7,185,177,.6)' : ( ($store.state.temp >= 35) ? 'rgba(185,7,7,.6)' : 'rgba(255,157,8,.6)') }} 0%, {{ ($store.state.temp <= 15) ? 'rgba(7,185,177,.6)' : ( ($store.state.temp >= 35) ? 'rgba(185,7,7,.6)' : 'rgba(255,157,8,.6)') }} 100%);				
	  	  }
	      .weather-1 {
			background: linear-gradient(-115deg, {{ ($store.state.temp <= 15) ? 'rgba(7,185,177,1)' : ( ($store.state.temp >= 35) ? 'rgba(185,7,7,1)' : 'rgba(255,157,8,1)') }} 0%, {{ ($store.state.temp <= 15) ? 'rgba(7,185,177,1)' : ( ($store.state.temp >= 35) ? 'rgba(185,7,7,1)' : 'rgba(255,157,8,1)') }} 100%);
			background: -moz-linear-gradient(-115deg, {{ ($store.state.temp <= 15) ? 'rgba(7,185,177,1)' : ( ($store.state.temp >= 35) ? 'rgba(185,7,7,1)' : 'rgba(255,157,8,1)') }} 0%, {{ ($store.state.temp <= 15) ? 'rgba(7,185,177,1)' : ( ($store.state.temp >= 35) ? 'rgba(185,7,7,1)' : 'rgba(255,157,8,1)') }} 100%);
			background: -webkit-linear-gradient(-115deg, {{ ($store.state.temp <= 15) ? 'rgba(7,185,177,1)' : ( ($store.state.temp >= 35) ? 'rgba(185,7,7,1)' : 'rgba(255,157,8,1)') }} 0%, {{ ($store.state.temp <= 15) ? 'rgba(7,185,177,1)' : ( ($store.state.temp >= 35) ? 'rgba(185,7,7,1)' : 'rgba(255,157,8,1)') }} 100%);				
	  	  }	  
	      .weather-2 {
			background: linear-gradient(-115deg, {{ ($store.state.temp <= 15) ? 'rgba(7,185,177,1)' : ( ($store.state.temp >= 35) ? 'rgba(165,7,7,1)' : 'rgba(255,130,8,1)') }} 0%, {{ ($store.state.temp <= 15) ? 'rgba(7,165,177,1)' : ( ($store.state.temp >= 35) ? 'rgba(165,7,7,1)' : 'rgba(255,130,8,1)') }} 100%);
			background: -moz-linear-gradient(-115deg, {{ ($store.state.temp <= 15) ? 'rgba(7,165,177,1)' : ( ($store.state.temp >= 35) ? 'rgba(165,7,7,1)' : 'rgba(255,130,8,1)') }} 0%, {{ ($store.state.temp <= 15) ? 'rgba(7,165,177,1)' : ( ($store.state.temp >= 35) ? 'rgba(165,7,7,1)' : 'rgba(255,130,8,1)') }} 100%);
			background: -webkit-linear-gradient(-115deg, {{ ($store.state.temp <= 15) ? 'rgba(7,165,177,1)' : ( ($store.state.temp >= 35) ? 'rgba(165,7,7,1)' : 'rgba(255,130,8,1)') }} 0%, {{ ($store.state.temp <= 15) ? 'rgba(7,165,177,1)' : ( ($store.state.temp >= 35) ? 'rgba(185,7,7,1)' : 'rgba(255,130,8,1)') }} 100%);				
	  	  }	  	  	  	  
	    </v-style>	  
	</div>	
</template>

<script>
import Vue from "vue";

const moment = require('moment');

Vue.component('v-style', {
  render: function(createElement) {
    return createElement('style', this.$slots.default)
  }
})

export default {

  name: 'weatherList',
  props: ['items','day','date'],
  methods: {		
  	returnDay(str) {
  		if(moment(str, 'DD-MM-YYYY').isBefore(moment(new Date(), 'YYYY-MM-DD'))) {
  			str = 'Hoje'
  		} else if(moment(str, 'DD-MM-YYYY').isAfter(moment(new Date(), 'YYYY-MM-DD')) && moment(str, 'DD-MM-YYYY').isBefore(moment(new Date(), 'YYYY-MM-DD').add(1,'days'))) {
  			str = 'Amanhã'
  		} else {
  			str = 'Depois de Amanhã'
  		}   		

  		return str
  	},
  	tick(str) {
  		var self = this;

		document.querySelectorAll('.day').forEach(function(day,index) { 
		   if(index!==self.day) {
		   	document.querySelectorAll('.day')[index].classList.remove('toggle')
		   } else {
		   	document.querySelectorAll('.day')[index].classList.add('toggle')
		   }
		}) 

  		if(str === 'next' && this.selectedWeather < this.$store.state.calendar[this.day].weather.length - 1) {
  			this.selectedWeather+=1
  		} else if(str === 'prev' && this.selectedWeather > 0) {
  			this.selectedWeather-=1
  		}

		this.$store.state.temp = Math.round(this.items[this.selectedWeather].main.temp);

		this.$store.dispatch('doGetThumbnailUrl', this.items[this.selectedWeather].weather[0].description)  
  	},
  	dateTime(string) {
		return moment(string).format("HH:mm");
  	},
  },
  data () {
    return {
    	selectedWeather: 0
    }
  }
}
</script>

<style lang="css" scoped>
</style>