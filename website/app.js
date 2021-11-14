/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth() + 1)+'.'+ d.getDate()+'.'+ d.getFullYear();

const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = ',&appid=72ae9e382324d9bc05f5d65883f669c8&units=metric';
const server = 'http://127.0.0.1:3000';

function weather(){
    const zip = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    getWeatherData(zip).then((data)=>{
        if(data.cod != 200){
            alert('Wrong Zip Code Entered');
        }
        if(data){
            const allData = {
                city : data.name,
                temp : data.main.temp,
                newDate : newDate,
                feelings: feelings,
                desc : data.weather[0].description,
            };
            postWeatherData(server + '/postWeatherData', allData)
            .then(() => updateUI());
        }
    })
}

const getWeatherData = async(zip) => {
    try{
        const res = await fetch(baseURL + zip + apiKey);
        const weather = await res.json();
        return weather;
    }
    catch(error){
        console.log('error', error);
    }
}

const postWeatherData = async(serverURL = '', allData={}) => {
    const res = await fetch(serverURL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(allData),
    });
    try {
        const weather = await res.json();
        return weather; 
    } catch (error) {
        console.log('error', error);
    }
}

const updateUI = async() => {
    const req = await fetch(server + '/all');
    try {
        const newWeather = await req.json();

        document.getElementById('city').innerHTML = newWeather.city;
        document.getElementById('date').innerHTML = newWeather.newDate;
        document.getElementById('description').innerHTML = newWeather.desc;
        document.getElementById('temp').innerHTML = newWeather.temp + '&degC';
        document.getElementById('content').innerHTML = 'I am ' + newWeather.feelings;
    } catch (error) {
        console.log('error',error);
    }
}

let generateButton = document.getElementById('generate');
generateButton.addEventListener('click', weather);