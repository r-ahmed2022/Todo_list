addEventListener('load', () => {
   
    let tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

    const posts = document.getElementById("posts");
    const submitForm = document.getElementById("post-form");
    const postTitle = document.getElementById("title");
    const postBody = document.getElementById("body");
    
    const slider = document.querySelector(".slider");
    const label = document.querySelector(".slide-label");
    const container = document.querySelector(".app");
    const input = document.getElementById("title");
    const body = document.querySelector("body");
    const completed = document.querySelector(".completed");
    const checkbox = document.querySelector("tasks");
    const post = document.querySelector(".post");
    const filter = document.getElementById('filter');
    tasksCount  = 0;
    var completedTask = 0;
    let filterName = '';
            function loadTasks() {
                return JSON.parse(localStorage.getItem("tasks")) ?? [];
            }
            function saveTasks(tasks) {
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }
    function getFilteredTasks(filter) {
        if(filter.toLowerCase() === 'complete')
            return tasks.filter(item => item.completed);
        else
        return tasks.filter(item => !item.completed);
    }
      function completedTaskCount(tasksCount) {
        document.querySelector(".tasks-count b").textContent = tasksCount;
      }
        
     function getTasks(todoArray = "All") {
        try {
            tasks = loadTasks();
            if(tasks.length === 0) {
                tasksCount = 0;
                setTimeout(() => {
                    posts.innerHTML = `<span class="empty"><i class="fa-solid fa-plus"></i></span>`;
                }, 100);
             } else {
                posts.innerHTML = "";
                const filteredtasks = todoArray === 'All' ? tasks :
                todoArray === 'completed' ? getFilteredTasks(todoArray) : getFilteredTasks(todoArray);
                filteredtasks.map(todo => {
                const liTask = document.createElement("li");
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
                todo.completed ?
                task.classList.add("done") : task.classList.remove("done");
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

    getTasks();

  
    posts.addEventListener('change', (event) => {
        if (event.target.classList.contains('completed')) {
            const currentElement = event.target;
             const taskId = parseInt((currentElement.id).split("-")[1]);
             let markTasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
             const index = markTasks.findIndex(task => task.id === taskId);
             if (index !== -1) {
               markTasks[index].completed = currentElement.checked;
              
                 if(event.target.checked) {
                    const sibling = currentElement.nextElementSibling;
                    sibling.classList.add("done");
                    if(tasks.length != 0)  {
                       tasksCount -=1;
                       completedTaskCount(tasksCount);
                    } else if(tasks.length <= 0) tasksCount = 0;

                 } else {
                    currentElement.nextElementSibling.classList.remove("done");
                    tasksCount +=1;
                    completedTaskCount(tasksCount);
                }
                 saveTasks(markTasks);
                 console.log(obj)
             }
             else  console.error('Task not found', currentElement);

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
            completed.style.border = '1px solid #fff';
        } 
        if(!status){
            label.lastChild.textContent ="🌙";
            label.style.color = "#F9C23C";
            document.documentElement.style.backgroundColor = "initial";
            body.style.backgroundColor = '#F7CB18';
            container.classList.remove("mode");
            completed.style.borderColor = "initial"
        } 

    }

    submitForm.addEventListener("submit", (e)=> {   
        e.preventDefault();
           const task = {
            id: tasks.length + 1,
            title: postTitle.value,
            completed: false,
                }
         tasks.push(task);
         saveTasks(tasks);
         tasksCount += 1;
         completedTaskCount(tasksCount);
          getTasks();
        e.target.reset();
    });

    
 slider.addEventListener('change', (e) => {
    let {checked} = e.target;
    setMode(checked);
})  
 filter.addEventListener('change', (e) => {
      getTasks(e.target.value);
 })
 completedTaskCount(tasksCount);
});
