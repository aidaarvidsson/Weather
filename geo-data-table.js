const weatherStatus = ['error', 'Clear sky', 'Nearly clear sky', 'Variable cloudiness', 'Halfclear sky', 'Cloudy sky', 'Overcast', 'Fog',
'Light rain showers', 'Moderate rain showers', 'Heavy rain showers', 'Thunderstorm', 'Light sleet showers', 'Moderate sleet showers', 'Heavy sleet showers',
'Light snow showers', 'Moderate snow showers', 'Heavy snow showers', 'Light rain', 'Moderate rain', 'Heavy rain', 'Thunder', 'Light sleet', 'Moderate sleet', 
'Heavy sleet', 'Light snowfall', 'Moderate snowfall', 'Heavy snowfall'];

function makeDataTable(forecast){
    var table = [];
    if(forecast.timeSeries == null){
        return [];
    }
    
    for (var i = 0; i < 12; i++){
        var timeSeries = forecast.timeSeries[i];
        var vTime = timeSeries.validTime;
        var parameter = timeSeries.parameters[18];
        var statusValue = parameter.values[0];

        //UTC time
        var utcTime = new Date(vTime);

        //CEST = UTC + 2 h
        utcTime.setHours(utcTime.getHours() + 2);
        var validTime = utcTime.toISOString().replace(/[a-zA-Z]/g, ' ').substr(0, 16);

        var status = weatherStatus[statusValue];


        let wthitem = {
            validTime: validTime,
            status: status
        }
        table.push(wthitem);
    }
    console.log(table);
    return table;
};

function getForcast(lat, lon){
    //const temp_url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/14/lat/56/data.json'
    const latitude = Math.floor(lat * 1000000) / 1000000;
    const longitude = Math.floor(lon * 1000000) / 1000000;
    var url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/' + longitude +'/lat/' + latitude +'/data.json';
    return fetch(url).then(response => response.json());
}