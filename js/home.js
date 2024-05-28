import {  loadTasks, saveTasks} from './tasks.js';
import {  getGeoLocation, getCurrentWeather } from './utils.js';

const salutation = document.querySelector('.salutation');
const container = document.querySelector(".container");
var countCategory = 0;
container.addEventListener("click", (e) => {
    const currentElement = e.target;
    if (!currentElement.classList.contains('container')
      && !currentElement.classList.contains('screen') &&
    !currentElement.classList.contains('username')) {
        const categoryId = currentElement.getAttribute('id');
        if (categoryId) {
            const targetURL = `home.html?categoryId=${encodeURIComponent(categoryId)}`;
            document.location = targetURL;
        }
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

function createCategory(task) {
    if(!task) {
         task = {item: "Personal", count: 0};
        } 
     const {item, count} = task ;
     const category = document.createElement("div");
     category.setAttribute("id", item);
     category.classList.add("category");
     const icon =  document.createElement("span");
     icon.classList.add("category-icon");
     const img =  document.createElement("img");
     img.classList.add("category-icon-img");
     img.src = `img/${item.toLowerCase() === 'personal' ? "boy.png" : item.toLowerCase()  === 'business' ? "briefcase.png" : item.toLowerCase()  === 'health' ? "healthcare.png" : "web-design.png"}`;
     icon.appendChild(img);
     category.appendChild(icon);
     const heading =  document.createElement("h4");
     heading.innerHTML = item.toUpperCase();
     heading.classList.add("category-heading");
     category.appendChild(heading)
     const categoryCount =  document.createElement("span");
     categoryCount.classList.add("count");
     categoryCount.innerText = 'Total Tasks#'
     categoryCount.innerText += `${count}`;
     category.appendChild(categoryCount);
     return category;
}

function renderCategories() {
    const categoriesCount = tasks.reduce((acc, todo) => {
         const category = todo.category;
         if(!acc[category]) acc[category] = 0;
          acc[category]++;
          return acc;
    }, {})

    const totalCategories = Object.keys(categoriesCount);
   

    if (totalCategories.length === 0)
        {
            container.appendChild(createCategory());
            setTimeout(() => {
                document.location = "home.html";
            }, 2000);

        }
    else{
        for (const [item, count] of Object.entries(categoriesCount )) {
            const categoryElement = createCategory({item: item, count: count});
            container.appendChild(categoryElement);
        }
    }
  
}

 renderCategories();