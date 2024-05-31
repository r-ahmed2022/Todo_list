    const apiKey = 'cf6967fd1784732aebe4bdb9186f3879';
    const baseURL = `https://api.openweathermap.org/`;
    const urlByGeoCode = 'geo/1.0/reverse'
    const urlByCity = 'data/2.5/weather';
   

  export const getGeoLocation = () => {
        if(navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(getCurrentWeather
          , (error) => { console.log(error)})
     }
}
export const getCurrentWeather =  async (position) => {
  const {latitude: lat, longitude: lon} = position.coords;
 await fetch(`${baseURL}/${urlByGeoCode}?lat=${lat}&lon=${lon}&appid=${apiKey}`)
  .then(response=> response.json())
  .then(data => {
     fetch(`${baseURL}/${urlByCity}?q=${data[0].name}&appid=${apiKey}&units=metric`)
     .then(response => response.json())
     .then(result => {
        const { temp } = result.main;
        const place  = result.name;
        const {country} = result.sys;
        const { description, icon } = result.weather[0];
        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        const weather = document.querySelector(".weather");
        const weathericon = document.querySelector(".weather-icon");
        const city = document.querySelector(".city");
        const countryFlag = document.querySelector(".country-flag");
        countryFlag.src =  `https://catamphetamine.gitlab.io/country-flag-icons/3x2/${country}.svg`
        city.innerHTML = place
        weathericon.src = `${iconUrl}`
        const tempCity = document.querySelector(".temp");
        tempCity.innerHTML = temp;

     })
  })
  .catch(err=> console.log(err))
}

