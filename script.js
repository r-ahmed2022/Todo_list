
document.addEventListener('DOMContentLoaded', () => {
    const posts = document.querySelector(".posts");
    getTasks();

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

    var tasks;
    let completedTasks = [];
    var tasksCount  = 0;
    let formData = {
        id: null,
        title: "",
        completed: false,
            }

    
    function getTasks() {
        try {
             tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
             tasksCount = tasks.length ;
             posts.innerHTML = tasks.length === 0 ? `` : tasks.map(task => `
                 <li class="post" id="${task.id}">
                 <input type="checkbox" class="completed" id="check-${task.id}" />
                 <input type=text class="post-title" readonly value="${task.title}" id="text-${task.id}" />
                 <div class="edit-div">
                 <span class="icon icon-pencil"><i class="fa-solid fa-pen-to-square"></i></span>
                  <span class="icon icon-trash"><i class="fa-solid fa-trash"></i></span>
                    </div>
                </li>
             ` );
           
        }catch(error) {
            console.log(error);
        }
        document.querySelector(".tasks-count").lastChild.textContent = tasksCount;
    }

  
    const checkboxes = document.querySelectorAll(".completed");
    console.log(checkboxes)
    checkboxes.forEach(checkbox => checkbox.addEventListener('change', (e) => {
         console.log(e.target)
    }))
    
    posts.addEventListener("click", (event) => {
        if(event.target.classList.contains('fa-trash')) {
            const parentElement = event.target.closest(".post");
            let taskId = parentElement.id;
            let updatedTasks;
            const markTasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
            if (markTasks.length != 0) 
                updatedTasks = markTasks.filter(task => task.id != taskId);
            localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        }
        getTasks();
    });
    
  
   /* posts.addEventListener('change', (event) => {
        if (event.target.classList.contains('completed')) {
       const parentElement = event.target.closest(".post");
       const currentElement = event.target;
        const taskId = Number(parentElement.id)
        const markTasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
        const index = markTasks.findIndex(task => task.id === taskId);
        console.log(index);
        if (index != -1) {
            markTasks[index].completed = currentElement.checked;
            localStorage.setItem("tasks", JSON.stringify(markTasks));
        }
   }
   getTasks();
});
    
*/

 
    posts.addEventListener('click', (event) => {
        if (event.target.classList.contains('fa-pen-to-square')) {
            const parentElement = event.target.closest(".post");
            const taskId = parentElement.id;
            const markTasks = JSON.parse(localStorage.getItem("tasks")) ?? [];    
            const index = markTasks.findIndex(item => item.id.toString() === taskId);
            console.log(index)
            if (index != -1) {
                const currentTask = markTasks[index];  
                const children = Array.from(parentElement.childNodes).filter(node => node.nodeType === 1); 

              const titleSpan = children[1];
              console.log(titleSpan)
              if(titleSpan)
                titleSpan.removeAttribute("readonly");
                titleSpan.focus();
                const checkbox = document.querySelector(".completed");
                const editdiv= document.querySelector(".edit-div");
              //  checkbox.style.display = "none";
               editdiv.style.display = "none";
                // Save the new title on blur or Enter key press
                const saveTitle = () => {
                    currentTask.title = titleSpan.value;
                    localStorage.setItem("tasks", JSON.stringify(markTasks));
                };
    
                titleSpan.addEventListener("blur", saveTitle);
                titleSpan.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        saveTitle();
                    }
                });
            }
            getTasks();
        }
        
    })


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
  
    function submitData() {
        //tasks = [...tasks, formData];
        tasks.push(formData);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        getTasks();
    }
    submitForm.addEventListener("submit", (e)=> {
        e.preventDefault();
        formData = {...formData,
            id: Math.floor(Math.random() * 1000),
            title: postTitle.value }
        submitData();
        postTitle.value = "";
    });

    
 /* slider.addEventListener('change', (e) => {
    let {checked} = e.target;
    setMode(checked);
}) */
})
