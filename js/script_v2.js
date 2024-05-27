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
    var tasksCount  = JSON.parse(localStorage.getItem("tasksCount")) ?? 0;
            function loadTasks() {
                return JSON.parse(localStorage.getItem("tasks")) ?? [];
            }
            function saveTasks(tasks) {
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }

            function completedTaskCount(tasksCount) {
                localStorage.setItem("tasksCount", JSON.stringify(tasksCount));
                document.querySelector(".tasks-count b").textContent = tasksCount;
              }

     function getTasks() {
        try {
             tasks = loadTasks();
             if(tasks.length === 0) {
                setTimeout(() => {
                    posts.innerHTML = `<span class="empty"><i class="fa-solid fa-plus"></i></span>`;
                }, 200);
             } else {
                posts.innerHTML = "";
                tasks.map(todo =>  {
                const liTask = document.createElement("li");
                liTask.classList.add("post");
                liTask.setAttribute("id", `${todo.id}`);
                const completedTask = document.createElement("input");
                completedTask.type = "checkbox";
                completedTask.checked = todo.completed;
                completedTask.setAttribute("id", `check-${todo.id}`);
                completedTask.classList.add("completed");
                completedTask.addEventListener('change', (event) => {
                    if (event.target.classList.contains('completed')) {
                        //debugger;
                        const currentElement = event.target;
                         const taskId = parseInt((currentElement.id).split("-")[1]);
                         const index = tasks.findIndex(task => task.id === taskId);
                         if (index !== -1) {
                            const updateCompleted = () => {
                             tasks[index].completed = currentElement.checked;
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
                                saveTasks(tasks);
                            }
                              updateCompleted();
                              completedTask.removeEventListener('change', updateCompleted)
                              console.log(obj)
                         }
                         else  console.error('Task not found', currentElement);
                         getTasks();
               }
                })
                liTask.appendChild(completedTask);
   
                const task = document.createElement("input");
                task.type = "text";
                task.value = `${todo.title}`;
                task.setAttribute("id", `text-${todo.id}`);
                task.setAttribute("readonly", true)
                task.classList.add("post-title");
                (todo.completed) 
                 ? task.classList.add("done")
                 :  task.classList.remove("done");
                
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
                editBtn.addEventListener("click", (e) => {
                    //debugger;
                    task.removeAttribute("readonly");
                    task.focus();
                    const taskId = parseInt(task.closest('li').id);
                    const index = tasks.findIndex(item => item.id === taskId);
                    if (index !== -1) {
                           const updateTask = () => {
                            tasks[index].title = task.value;
                            task.setAttribute("readonly", true);
                            saveTasks(tasks);
                            task.blur();
                            task.removeEventListener("blur", updateTask);
                            task.removeEventListener("keydown", updateTaskOnEnter);
                        };
            
                        const updateTaskOnEnter = (e) => {
                            if (e.key === "Enter") {
                                updateTask();
                            }
                        };
            
                        task.addEventListener("blur", updateTask)
                        task.addEventListener("keydown", updateTaskOnEnter);
                }
                })

              
            
                liTask.appendChild(editBtn);   
                const deleteBtn = document.createElement("span");
                deleteBtn.classList.add("icon");
                deleteBtn.classList.add("icon-trash");
                const deleteElement = document.createElement('i');
                deleteBtn.setAttribute("data-tooltip", "Delete");
                deleteElement.classList.add('fa-solid', 'fa-trash');
                deleteBtn.appendChild(deleteElement);
                deleteBtn.addEventListener("click", (e) => {
                   const currentElement = e.target;
                   const taskId = parseInt(currentElement.closest('li').id);
                   tasks = tasks.filter(task => task.id != taskId);
                   if(tasksCount <= 0) tasksCount = 0;
                   else tasksCount -= 1;
                   saveTasks(tasks)
                   completedTaskCount(tasksCount);
                    getTasks();
                    
                })
                liTask.appendChild(deleteBtn);
                posts.appendChild(liTask)
             });
             }
              
        }catch(error) {
            console.log(error);
        }
    
    }

    getTasks();
   

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
            tasks.push(task)
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
completedTaskCount(tasksCount);
});
