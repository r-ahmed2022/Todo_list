var tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
const params = getQueryParams();
export function loadTasks() {
    return JSON.parse(localStorage.getItem("tasks")) ?? [];
}
export function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
const tasksByCategory = () => {
    return tasks.filter(task => task.category === params.categoryId).length;
};
function filterByCategory() {
 return tasks.filter(task => task.category === params.categoryId);
}
export function getFilteredTasks(filter) {
if(filter === 'complete')
return tasks.filter(item => item.completed);
else if(filter === 'incomplete')
return tasks.filter(item => !item.completed);
else
return tasks;
}



function sortTasks(tasks) {
return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

}

function composeTasks(...args) {
return function(data) {
return  args.reduceRight((val, func) => func(val), data);
}
}
 export function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const queryParams = {};
    for (const [key, value] of params.entries()) {
        queryParams[key] = value;
    }
    return queryParams;
}

export function getTasks(todoArray = "all") {
    try {
           tasks = loadTasks();
        if(tasks.length === 0) {
            setTimeout(() => {
                posts.innerHTML = ``;
            }, 100);
         } else {
            posts.innerHTML = "";
            posts.innerHTML = `<h3 class="taskheading">
           ${params.categoryId.toUpperCase()} <span><small>Total Tasks</small>
            # <i class="taskslength">${tasksByCategory()}</i></span>
            </h3>`
            composeTasks(sortTasks, filterByCategory, getFilteredTasks)(todoArray).map(todo => {
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