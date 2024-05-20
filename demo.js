    posts.innerHTML = tasks.map(task => `
                 <li class="post" id="${task.id}">
                 <input type="checkbox" class="completed"  id="check-${task.id}" />
                 <input type=text class="post-title" readonly value="${task.title}" id="text-${task.id}" />
                 <div class="edit-div">
                 <span class="icon icon-pencil"><i class="fa-solid fa-pen-to-square"></i></span>
                  <span class="icon icon-trash"><i class="fa-solid fa-trash"></i></span>
                    </div>
                </li>
             ` ).join('');

             posts.innerHTML = "";
             const liTask = document.createElement("li");
             liTask.classList.add("post");
             liTask.setAttribute("id", `${task.id}`);
             const completedTask = document.createElement("input");
             completedTask.type = "checkbox";
             completedTask.setAttribute("id", `check-${task.id}`);
             completedTask.classList.add("completed");
             liTask.appendChild(completedTask);

             const task = document.createElement("input");
             task.type = "text";
             task.setAttribute("id", `text-${task.id}`);
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
                 task.removeAttribute("readonly");
                 task.focus();
                 const markTasks = loadTasks();
                 const taskId = parseInt(task.closest('li').id);
                 const index = markTasks.findIndex(item => item.id === taskId);
                 markTasks[index].title = task.value;
                 task.addEventListener("blur", () => {
                  task.setAttribute("readonly", true)
                  saveTask();
                 });
                 task.addEventListener("keydown", (e) => {
                        if (e.key === "Enter") {
                           task.setAttribute("readonly", true)
                            saveTask();
                        }
                    });
                    
             })
            
             liTask.appendChild(editBtn);

             // delete event handling

             const deleteBtn = document.createElement("span");
             deleteBtn.classList.add("icon");
             deleteBtn.classList.add("icon-trash");
             const deleteElement = document.createElement('i');
             deleteElement.classList.add('fa-solid', 'fa-trash');
             deleteBtn.appendChild(deleteElement);
             deleteBtn.addEventListener("click", (e) => {
                const currentElement = e.target
                const markTasks = loadTasks();
                const taskId = parseInt(currentElement.closest('li').id);
                if (markTasks.length != 0) 
                  {
                      let updatedTasks = markTasks.filter(task => task.id != taskId);
                      saveTasks(updatedTasks);
                  }
               
             })
             liTask.appendChild(deleteBtn);
             posts.appendChild(liTask);





