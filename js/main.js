import {  getGeoLocation, getCurrentWeather } from './utils.js';
import {  loadTasks, saveTasks,  getTasks} from './tasks.js';

addEventListener('load', () => {
    var tasks = JSON.parse(localStorage.getItem("tasks")) ?? 0;
    var tasksCount  = JSON.parse(localStorage.getItem("tasksCount")) ?? 0;
    var username = JSON.parse(localStorage.getItem("username")) ?? '';
    const posts = document.getElementById("posts");
    const submitForm = document.getElementById("post-form");
    const postTitle = document.getElementById("title");
    const postBody = document.getElementById("body");
    const weatherInfo = document.getElementById("weather");
    const slider = document.querySelector(".slider");
    const label = document.querySelector(".slide-label");
    const container = document.querySelector(".app");
    const input = document.getElementById("title");
    const body = document.querySelector("body");
    const completed = document.querySelector(".completed");
    const checkbox = document.querySelector("tasks");
    const post = document.querySelector(".post");
    const filter = document.getElementById('filter');
    const date = new Date();
    const category = document.querySelector(".category-input");
    const user =document.querySelector(".username");
    user.innerText = username;
    getGeoLocation();
   function completedTaskCount(tasksCount) {
    tasks = loadTasks()
    if(tasks.length === 0 ) 
    tasksCount = 0;
    localStorage.setItem("tasksCount", JSON.stringify(tasksCount));
    document.querySelector(".tasks-count b").textContent = tasksCount;
    }

    
   
   
      
      submitForm.addEventListener("submit", (e)=> {   
        e.preventDefault();
           const task = {
            id: tasks.length + 1,
            title: postTitle.value,
            completed: false,
            category: category.value,
            createdAt: new Date().toISOString(),
                }
         tasks.push(task);
         saveTasks(tasks);
         tasksCount += 1;
         completedTaskCount(tasksCount);
         filter.style.visibility = 'visible';
          getTasks();
        e.target.reset();
        document.location = "index.html";
    });

    

    const updateCompleted = (event) => {
        const currentElement = event.target;
        const taskId = parseInt((currentElement.id).split("-")[1]);
         let  updatedtasks = loadTasks();
        const index = updatedtasks.findIndex(task => task.id === taskId);
          if(index !== -1) {
            updatedtasks[index].completed = currentElement.checked; 
           saveTasks(updatedtasks);
           if(currentElement.checked) {
            currentElement.nextElementSibling.classList.add("done");
            if(updatedtasks.length != 0)  {
                tasksCount -=1;
                completedTaskCount(tasksCount);
             } else if(tasksCount === 0) tasksCount = 0;
 
         } else {
            currentElement.nextElementSibling.classList.remove("done");
            tasksCount +=1;
            completedTaskCount(tasksCount);
            }
          }
       }
  
    posts.addEventListener('change', (event) => {
        if (event.target.classList.contains('completed')) {
            const currentElement = event.target;
             updateCompleted(event);      
   }
   getTasks();

});
    

posts.addEventListener('click', (event) => {
    const currentElement = event.target;
    if (currentElement.closest('.fa-pen-to-square')) {
        const taskId = parseInt(currentElement.closest('li').id);
        console.log(`Edit task with ID: ${taskId}`);
        const todo = currentElement.parentNode.previousElementSibling;
        const index = tasks.findIndex(item => item.id === taskId);
        if (index !== -1) {
            todo.removeAttribute("readonly");
            todo.focus();
            const updateTask = () => {
                tasks[index].title = todo.value;
                todo.setAttribute("readonly", true);
                saveTasks(tasks);
                todo.blur();
                todo.removeEventListener("blur", updateTask);
                todo.removeEventListener("keydown", updateTaskOnEnter);
            };

            const updateTaskOnEnter = (e) => {
                if (e.key === "Enter") {
                    updateTask();
                }
            };

            todo.addEventListener("blur", updateTask)
            todo.addEventListener("keydown", updateTaskOnEnter);
        }
    } else if (currentElement.closest('.icon-trash')) {
        const taskId = parseInt(currentElement.closest('li').id);
        let updatedtasks = loadTasks();
        if (updatedtasks.length != 0) 
            {
                updatedtasks = updatedtasks.filter(task => task.id != taskId);
                saveTasks(updatedtasks);
            }
            if(tasksCount <= 0) tasksCount = 0;
            else tasksCount -= 1;
            completedTaskCount(tasksCount);
            document.querySelector(".tasks-count b").textContent = tasksCount
             getTasks();
    }
});
 


       function setMode(status) {
        if(status){
            label.lastChild.textContent ="☀";
            document.documentElement.style.backgroundColor = "#000";
            body.style.backgroundColor = 'inherit';
            container.classList.add("mode");
            document.querySelector(".city").style.color ="#F9C23C"
            document.querySelector(".salutation").style.color ="#F9C23C"
            
            } 
        if(!status){
            label.lastChild.textContent ="🌙";
            label.style.color = "#F9C23C";
            document.documentElement.style.backgroundColor = "initial";
            body.style.backgroundColor = '#F7CB18';
            container.classList.remove("mode");
            document.querySelector(".city").style.color ="#0073E5"
            document.querySelector(".salutation").style.color = "#0073E5";

        } 

    }

   

    
 slider.addEventListener('change', (e) => {
    let {checked} = e.target;
    setMode(checked);
})  
 filter.addEventListener('change', (e) => {
      const filterName = e.target.value;
      getTasks(filterName.trim().toLowerCase());
 })

 completedTaskCount(tasksCount);

 getTasks();

});
