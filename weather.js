

var app = new Vue({
    el: '#app',
    data() {
        return {
            city: "",
            submitted: false,
            weather: {}
          };
        
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
    
      }
      // other methods...
    }
  });