import { getTasks, loadTasks, saveTasks } from './tasks.js';
import { getGeoLocation, getCurrentWeather } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
    let tasks = loadTasks();
   
    const salutation = document.querySelector('.salutation');
    const container = document.querySelector(".container");
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');
    container.appendChild(categoryContainer);
    const submitForm = document.querySelector(".post-form");
    const indexBtn = document.querySelector(".indexBtn");
    const formBack = document.querySelector(".form-back");
    const postTitle = document.getElementById("title");
    const categoryInput = document.querySelector(".category-input");
    var tasksPerCategoryCount = 0;
    const category = document.querySelector(".category");
    let tasksCount = JSON.parse(localStorage.getItem("tasksCount")) ?? 0;

    function completedTaskCount(tasksCount) {
        if (tasks.length === 0) tasksCount = 0;
        localStorage.setItem("tasksCount", JSON.stringify(tasksCount));
    }

    const tasksByCategory = (id) => {
        return tasks.filter(task => task.category === id).length;
    };

    function showError(message) {
        const errorSpan = document.querySelector(".error");
        errorSpan.textContent = message;
        errorSpan.style.display = "inline";
        errorSpan.style.zIndex = "100"
        setTimeout(() => {
            errorSpan.textContent = "";
            errorSpan.style.display = "none "
        }, 2000);
    }

  
    container.addEventListener("click", (e) => {
        if (e.target.classList.contains('category')) {
            const currentElement = e.target;
            const categoryId = currentElement.getAttribute('id');
            if(tasksByCategory(categoryId) === 0) {
                showError(`${categoryId} has 0 tasks, Add task now` );
                 return;
            }
             if (categoryId) {
                        const targetURL = `home.html?categoryId=${encodeURIComponent(categoryId)}`;
                       document.location = targetURL;
                }
                
            }
       
    });

    const date = new Date();
    salutation.innerText = date.getHours() < 12 ? 'Morning' : date.getHours() < 17 ? 'Afternoon' : 'Evening';

    const totalTasks = document.querySelector("#totaltasks b");
    const username = document.querySelector(".username");
    let user = JSON.parse(localStorage.getItem("username")) ?? '';
    if (localStorage.getItem("tasksCount")) updateCount(localStorage.getItem('tasksCount'));

    getGeoLocation();

    function updateCount(newValue) {
        totalTasks.innerText = newValue;
    }

    if (user === '' && username) {
        username.focus();
    } else if (username) {
        username.value = user;
    }

    username.addEventListener("input", (e) => {
        localStorage.setItem("username", JSON.stringify(e.target.value));
    });

    window.addEventListener('storage', (e) => {
        if (e.key === 'tasksCount') {
            updateCount(e.newValue);
            tasks = loadTasks();
        }
    });

 /*   document.addEventListener("click", (e) => {
        if (!submitForm.contains(e.target) && e.target !== homeBtn) {
            submitForm.style.display = "none";
        }
    })
    */

    function createCategory(task = {item: "Personal", count: 0}) {

        const categoryIcon = {
            personal: "boy.png",
            business: "briefcase.png",
            coding: "web-design.png",
            health: "healthcare.png",
            education: "education.png",
            fitness: "dumbbell.png",
            finances: "saving.png",
            shopping: "shopping.png"
        };
        const { item, count } = task;
        const category = document.createElement("div");
        category.setAttribute("id", item);
        category.classList.add("category");

        const icon = document.createElement("span");
        icon.classList.add("category-icon");

        const img = document.createElement("img");
        img.classList.add("category-icon-img");
        img.src = `img/${categoryIcon[item.toLowerCase()] ?? "sun.png"}`;
        icon.appendChild(img);

        category.appendChild(icon);

        const heading = document.createElement("h4");
        heading.innerHTML = item.toUpperCase();
        heading.classList.add("category-heading");
        category.appendChild(heading);

        const categoryCount = document.createElement("span");
        categoryCount.classList.add("count");
        categoryCount.innerText = `Total Tasks# ${count}`;
        category.appendChild(categoryCount);

        return category;
    }

    function renderCategories() {
        categoryContainer.innerHTML = "";
        const categoriesCount = tasks.reduce((acc, todo) => {
            const category = todo.category;
            if (!acc[category]) acc[category] = 0;
            acc[category]++;
            return acc;
        }, {});

        const totalCategories = Object.keys(categoriesCount);
      
            if(!totalCategories.length) 
             categoryContainer.appendChild(createCategory());
           else
           {
            for (const [item, count] of Object.entries(categoriesCount)) {
                const categoryElement = createCategory({ item: item, count: count });
                categoryContainer.appendChild(categoryElement);
            }
           }
         
        
    }

    async function notifyUser(category, todo) {
        if (!('Notification' in window)) {
            console.log("This browser does not support notifications.");
            return;
        }
            const permission = await Notification.requestPermission();
            if(permission === 'granted') {
              new Notification(category, {body: todo });
               window.focus();
            } else console.log("Notification not enabled");
      
      }

    submitForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const task = {
            id: tasks.length + 1,
            title: postTitle.value,
            completed: false,
            category: categoryInput.value,
            createdAt: new Date().toISOString(),
        };
        tasks.push(task);
        saveTasks(tasks);
        toggleClasses();
        tasksCount += 1;
        completedTaskCount(tasksCount);
        getTasks();
       renderCategories();
        e.target.reset();
    });

const toggleClasses = () => {
       indexBtn.classList.toggle("active");
       formBack.classList.toggle("active");
       submitForm.classList.toggle("active");
     
    }
 
    indexBtn.addEventListener("click", toggleClasses);

   formBack.addEventListener("click", toggleClasses)

  renderCategories();
});

    
