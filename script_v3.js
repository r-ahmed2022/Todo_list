addEventListener('load', () => {
   
    let tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
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
    var tasksCount  = JSON.parse(localStorage.getItem("tasksCount")) ?? 0;
    const date = new Date();
    const apiKey = 'cf6967fd1784732aebe4bdb9186f3879';
    const baseURL = `https://api.openweathermap.org/`;
    const urlByGeoCode = 'geo/1.0/reverse'
    const urlByCity = 'data/2.5/weather';
    const salutation = document.querySelector('.salutation');
    salutation.innerText = `${date.getHours() < 12 ? 'Morning' : date.getHours() > 12 && date.getHours() < 17 ? "Afternoon" : 'Evening'}`;
    let filterName = '';
            function loadTasks() {
                return JSON.parse(localStorage.getItem("tasks")) ?? [];
            }
            function saveTasks(tasks) {
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }
    function getFilteredTasks(filter) {
        if(filter === 'complete')
            return tasks.filter(item => item.completed);
        else if(filter === 'incomplete')
        return tasks.filter(item => !item.completed);
         else
          return tasks;
    }
      function completedTaskCount(tasksCount) {
         tasks = loadTasks();
        if(tasks.length === 0 ) 
            tasksCount = 0;
          localStorage.setItem("tasksCount", JSON.stringify(tasksCount));
           document.querySelector(".tasks-count b").textContent = tasksCount;
      }

        
      function sortTasks(tasks) {
       return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      }

      function composeTasks(...args) {
        return function(data) {
           return  args.reduceRight((val, func) => func(val), data);
        }
       }
      let coords = {}
         const getGeoLocation = () => {
                if(navigator.geolocation) {
                 navigator.geolocation.getCurrentPosition(getCurrentWeather
                  , (error) => { console.log(error)})
             }
    }
       const getCurrentWeather =  async (position) => {
          const {latitude: lat, longitude: lon} = position.coords;
         await fetch(`${baseURL}/${urlByGeoCode}?lat=${lat}&lon=${lon}&appid=${apiKey}`)
          .then(response=> response.json())
          .then(data => {
             fetch(`${baseURL}/${urlByCity}?q=${data[0].name}&appid=${apiKey}&units=metric`)
             .then(response => response.json())
             .then(result => {
                console.log(result)
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
       getGeoLocation();
       const observer = new IntersectionObserver((entries) => {
             entries.forEach(entry => {
                   if(entry.isIntersecting) {
                    posts.style.height = posts.scrollHeight + 200 + 'px';
                   }
             })
       }, {
        root: document.querySelector('.app'), 
        threshold: 0.5
      })

      submitForm.addEventListener("submit", (e)=> {   
        e.preventDefault();
           const task = {
            id: tasks.length + 1,
            title: postTitle.value,
            completed: false,
            createdAt: new Date().toISOString(),
                }
         tasks.push(task);
         saveTasks(tasks);
         tasksCount += 1;
         completedTaskCount(tasksCount);
          getTasks();
        e.target.reset();
    });

     function getTasks(todoArray = "all") {
        try {
               tasks = loadTasks();
            if(tasks.length === 0) {
                setTimeout(() => {
                    posts.innerHTML = ``;
                }, 100);
             } else {
                posts.innerHTML = "";
                composeTasks(sortTasks, getFilteredTasks)(todoArray).map(todo => {
                const liTask = document.createElement("li")
                liTask.classList.add("post");
                liTask.setAttribute("id", `${todo.id}`);
                const completedTask = document.createElement("input");
                completedTask.type = "checkbox";
                completedTask.checked = todo.completed;
                completedTask.setAttribute("id", `check-${todo.id}`);
                completedTask.classList.add("completed");
                liTask.appendChild(completedTask);
   
                const task = document.createElement("input");
                task.type = "text";
                task.value = `${todo.title}`;
                task.setAttribute("id", `text-${todo.id}`);
                task.setAttribute("readonly", true)
                task.classList.add("post-title");
                if(todo.completed) 
                task.classList.add("done");
                liTask.appendChild(task);
                const div = document.createElement("div");
                div.classList.add("edit-div");
                const editBtn = document.createElement("span");
                editBtn.classList.add("icon");
                editBtn.classList.add("icon-pencil");
                editBtn.setAttribute("data-tooltip", "Edit");
                const editElement = document.createElement('i');
                editElement.classList.add('fa-solid', 'fa-pen-to-square');
                editBtn.appendChild(editElement);
                liTask.appendChild(editBtn);
                const deleteBtn = document.createElement("span");
                deleteBtn.classList.add("icon");
                deleteBtn.classList.add("icon-trash");
                deleteBtn.setAttribute("data-tooltip", "Delete");
                const deleteElement = document.createElement('i');
                deleteElement.classList.add('fa-solid', 'fa-trash');
                deleteBtn.appendChild(deleteElement);
                liTask.appendChild(deleteBtn);
                posts.appendChild(liTask)
               });
             }
        }catch(error) {
            console.log(error);
        }

    }

    const updateCompleted = (event) => {
        const currentElement = event.target;
        const taskId = parseInt((currentElement.id).split("-")[1]);
        tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
        const index = tasks.findIndex(task => task.id === taskId);
          if(index !== -1) {
           tasks[index].completed = currentElement.checked; 
           saveTasks(tasks);
           if(currentElement.checked) {
            currentElement.nextElementSibling.classList.add("done");
            if(tasks.length != 0)  {
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
             //posts.removeEventListener('change', updateCompleted)
             
            // console.error('Task not found', currentElement        
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
        const markTasks = loadTasks();
        if (markTasks.length != 0) 
            {
                let updatedTasks = markTasks.filter(task => task.id != taskId);
                saveTasks(updatedTasks);
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
