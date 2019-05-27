var app = new Vue({
    el: "#app",
    data() {
        return {
            city: "",
            submitted: false,
            weather: {}
        };
    },
    methods: {
        getWeather() {
            fetch(
                `http://api.openweathermap.org/data/2.5/find?q=${
                this.city
                }&units=imperial&appid=65fcf98fbc9de34df59bc914235fe27f`
     )
            }}
});
