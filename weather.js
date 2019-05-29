Vue.component('weather-item', {
  props: {
    item:{
      type: Object,
      required: true
    }
  },
  template: `
  <div class="row">
    <div class="col-12">
      <span>{{item.validTime}}</span>
      <span>{{item.status}}</span>
    </div>
  </div>
  `
});
Vue.component('weather-table', {
  props: {
    witems: {
      type: Array,
      required: true
    }
  },
  template: `
  <div class="container">
    <weather-item
    v-for="wthitem in witems"
    :key="wthitem.validTime"
    :item="wthitem"
    />
  </div>
  `
});
Vue.component('city-item', {
  props: {
    item:{
      type: Object,
      required: true
    },
    deleteitem: {
      type: Function,
      required: true
    },
    searchname: {
      type: Function,
      required: true
    }
  },
  template: `
  <li class="list-group-item" v-on:click="searchname(item.name)">
    {{item.name}}
    <button class="float-right" v-on:click="deleteitem(item.id)">X</button>
  </li>
  `
});
Vue.component('city-list', {
  props: {
    cities: {
    type: Array,
    required: true
    },
    deleteitem: {
      type: Function,
      required: true
    },
    searchname: {
      type: Function,
      required: true
    }
  },
  template: `
  <ul class="list-group">
  <city-item
  v-for="city in cities"
  :key="city.id"
  :item="city"
  :deleteitem="deleteitem"
  :searchname="searchname"
  />
  </ul>
  `
});

var app = new Vue({
    el: '#app',
    data() {
        return {
            city: "",
            submitted: false,
            weather: {},
            wItems: [],
            cities: [],
            highestId: 0
          };
        
    },
    //Detta körs i början när man laddar in sidan
    mounted(){
      //hämtar alla localstorage
      var loadCities = localStorage.getItem("citiesWeather");
      var loadCitiesId = localStorage.getItem("citiesId");
      if(loadCities == "[]"){
        localStorage.setItem("citiesWeather", JSON.stringify([]));
        localStorage.setItem("citiesId", "0");
        this.cities = [];
        //reset id
        this.highestId = 0;
      }
      else{
        this.cities = JSON.parse(loadCities);
        //bug fix, duplicate id on refresh
        this.highestId = JSON.parse(loadCitiesId);
      }
    },
    methods: {
      getWeather() {
        this.weather = {};
        this.submitted = false;
        fetch(
          `http://api.openweathermap.org/data/2.5/find?q=${this.city}&units=metric&appid=6d0764dc7dc8c6506fd486e2719a6ef6`
        )
          .then(response => response.json())
          .then(response => {
            let data = response.list[0];
            this.submitted = true;
            this.weather.name = data.name;
            this.weather.description = data.weather[0].main;
            this.weather.temp = Math.round(data.main.temp);
            this.weather.pressure = Math.round(data.main.pressure);
            this.weather.humidity = Math.round(data.main.humidity);
            this.weather.high = Math.round(data.main.temp_max);
            this.weather.low = Math.round(data.main.temp_min);
          })
          .catch(error => console.log(error));
        this.city = "";
    
      },
      //lägger till stad till favoriter
      addCityToFav(){
        var name = this.weather.name;

        //bara giltiga namn läggs till listan
        if(name == undefined) return;
        let city = {
          name: name,
          id: ++this.highestId
        };
        this.cities.push(city);
      },
      //tar bort standen från listan
      deleteItem(id) {
        this.cities = this.cities.filter(city => city.id != id);
      },
      //Sök efter favorit staden när man klickar på den
      searchName(name){
        this.city = name;
        this.getWeather();
      },
      generateTable(lat, lon){
        getForcast(lat, lon).then(result => {
          console.log(result);
          this.wItems = makeDataTable(result);
        });
      },
      getGeolocation(){
        navigator.geolocation.getCurrentPosition(this.onSuccess, this.onFail);
        this.submitted = false;
      },
      onSuccess(position){
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        this.generateTable(lat, lon);
      },
      onFail(){
        console.log('failed geolocation');
      }
      // other methods...
    },
    watch: {
      //kollar efter ändringar i cities array (listan), om den ändras så sparas det på localstorage
      cities: function(){
        var JSONcities = JSON.stringify(this.cities);
        localStorage.setItem("citiesWeather", JSONcities);
        var JSONcitiesId = JSON.stringify(this.highestId);
        localStorage.setItem("citiesId", JSONcitiesId);
      }
    }
  });