import {  loadTasks, saveTasks} from './tasks.js';
import {  getGeoLocation, getCurrentWeather } from './utils.js';

const salutation = document.querySelector('.salutation');
const container = document.querySelector(".container");
container.addEventListener("click", (e) => {
    const currentElement = e.target;
    if (!currentElement.classList.contains('container')
      && !currentElement.classList.contains('screen')) {
        document.location = 'index.html';
    }
})
    
const date = new Date();

salutation.innerText = `${date.getHours() < 12 ? 'Morning' : date.getHours() > 12 && date.getHours() < 17 ? "Afternoon" : 'Evening'}`;
let filterName = '';

const totalTasks = document.querySelector("#totaltasks b");
const username = document.querySelector(".username");
let user = JSON.parse(localStorage.getItem("username")) ?? '';
if(localStorage.getItem("tasksCount"))  updateCount(localStorage.getItem('tasksCount'));
var tasks = loadTasks();
getGeoLocation();
function updateCount(newValue) {
     totalTasks.innerText = newValue;
}

if(user === '' && username) {
    username.focus();
   
} else if(username) {
    username.value = user;
}
username.addEventListener("input", (e) => {
    localStorage.setItem("username", JSON.stringify(e.target.value))
})
window.addEventListener('storage', (e) => {
    if(e.key === 'tasksCount') {
        updateCount(e.newValue);
        tasks = loadTasks();
    }
} )

