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
    
    var tasksCount  = 0;
            function loadTasks() {
                return JSON.parse(localStorage.getItem("tasks")) ?? [];
            }
            function saveTasks(tasks) {
                localStorage.setItem("tasks", JSON.stringify(tasks));
                console.log(tasks)
            }

     function getTasks() {
        try {
             tasks = loadTasks();
             tasksCount = tasks.length ;
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
                completedTask.setAttribute("id", `check-${todo.id}`);
                completedTask.classList.add("completed");
                liTask.appendChild(completedTask);
   
                const task = document.createElement("input");
                task.type = "text";
                task.value = `${todo.title}`;
                task.setAttribute("id", `text-${todo.id}`);
                task.setAttribute("readonly", true)
                task.classList.add("post-title");
                liTask.appendChild(task);
               
                const div = document.createElement("div");
                div.classList.add("edit-div");
                const editBtn = document.createElement("span");
                editBtn.classList.add("icon");
                editBtn.classList.add("icon-pencil");
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
                deleteElement.classList.add('fa-solid', 'fa-trash');
                deleteBtn.appendChild(deleteElement);
                deleteBtn.addEventListener("click", (e) => {
                   const currentElement = e.target
                   const taskId = parseInt(currentElement.closest('li').id);
                   tasks = tasks.filter(task => task.id != taskId);
                         console.log(tasks)
                         saveTasks(tasks);
                         getTasks();
                    
                })
                liTask.appendChild(deleteBtn);
                posts.appendChild(liTask)
             });
             }
              
        }catch(error) {
            console.log(error);
        }
    
        document.querySelector(".tasks-count").lastChild.textContent = tasksCount;
    }

    getTasks();
    const completedTask = document.querySelector("hello");
   
    posts.addEventListener('change', (event) => {
        if (event.target.classList.contains('completed')) {
            const currentElement = event.target;
             const taskId = parseInt((currentElement.id).split("-")[1]);
             let markTasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
             const index = markTasks.findIndex(task => task.id === taskId);
             if (index !== -1) {
               markTasks[index].completed = event.target.checked;
                 if(event.target.checked) {
                    const sibling = currentElement.nextElementSibling;
                    sibling.classList.add("done");
                 } else currentElement.nextElementSibling.classList.remove("done");
                 saveTasks(markTasks);
                 console.log(index)
                 console.log(obj)
             }
             else  console.error('Task not found', currentElement);
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
         tasks.push(task)
         saveTasks(tasks);
        getTasks();
        e.target.reset();
    });

    
 slider.addEventListener('change', (e) => {
    let {checked} = e.target;
    setMode(checked);
})  
});
