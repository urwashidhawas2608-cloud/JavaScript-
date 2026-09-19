/* =====================================================
   JAVASCRIPT LAB - EXPERIMENT 7
   DOM TRAVERSAL AND UPDATES
   ===================================================== */


/* =====================================================
   EXPERIMENT DATA
   ===================================================== */

let tasks = [
    {
        id: 1,
        name: "Demonstrate inline, internal, and external JavaScript; use console methods; create a webpage showing user info and a welcome message.",
        completed: false
    },

    {
        id: 2,
        name: "Use var, let, const, template literals and destructuring; build a billing calculator with user input.",
        completed: false
    },

    {
        id: 3,
        name: "Implement control structures and form validation; create a grading system based on user-entered marks.",
        completed: false
    },

    {
        id: 4,
        name: "Use function types, scope, closures and try-catch; build a palindrome checker.",
        completed: false
    },

    {
        id: 5,
        name: "Apply array methods and object handling; create a cart total calculator with discount logic.",
        completed: false
    },

    {
        id: 6,
        name: "Use string functions and regex for email validation, data extraction and text analysis.",
        completed: false
    },

    {
        id: 7,
        name: "Perform DOM traversal and updates; develop a to-do list app with add, edit and delete features.",
        completed: false
    }
];


/* =====================================================
   GET DOM ELEMENTS
   ===================================================== */

const todoForm = document.getElementById("todoForm");

const todoInput = document.getElementById("todoInput");

const todoList = document.getElementById("todoList");

const taskCount = document.getElementById("taskCount");

const progressText = document.getElementById("progressText");

const progressPercent = document.getElementById("progressPercent");

const progressFill = document.getElementById("progressFill");

const emptyMessage = document.getElementById("emptyMessage");


/* =====================================================
   CONSOLE METHODS
   ===================================================== */

console.log("Experiment 7 JavaScript started.");

console.info("DOM elements successfully selected.");

console.table(tasks);


/* =====================================================
   DISPLAY TASKS
   ===================================================== */

function displayTasks() {

    /* Remove old list items */

    todoList.innerHTML = "";


    /* Check for empty list */

    if (tasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";
    }


    /* Create each task */

    tasks.forEach(function(task, index) {

        /* Create list item */

        const listItem = document.createElement("li");

        listItem.className = "todo-item";


        /* Add completed class */

        if (task.completed) {

            listItem.classList.add("completed");
        }


        /* Create check button */

        const checkButton = document.createElement("button");

        checkButton.className = "check-button";

        checkButton.type = "button";

        checkButton.textContent = task.completed ? "✓" : "";


        checkButton.addEventListener("click", function() {

            toggleTask(task.id);

        });


        /* Create content */

        const content = document.createElement("div");

        content.className = "todo-content";


        const experimentNumber = document.createElement("div");

        experimentNumber.className = "experiment-number";

        experimentNumber.textContent =
            "EXPERIMENT " + (index + 1);


        const title = document.createElement("div");

        title.className = "todo-title";

        title.textContent = task.name;


        /* Add content */

        content.appendChild(experimentNumber);

        content.appendChild(title);


        /* Create action area */

        const actions = document.createElement("div");

        actions.className = "actions";


        /* Edit button */

        const editButton = document.createElement("button");

        editButton.className = "action-button";

        editButton.type = "button";

        editButton.textContent = "✎";

        editButton.title = "Edit";


        editButton.addEventListener("click", function() {

            editTask(task.id);

        });


        /* Delete button */

        const deleteButton = document.createElement("button");

        deleteButton.className =
            "action-button delete-button";

        deleteButton.type = "button";

        deleteButton.textContent = "×";

        deleteButton.title = "Delete";


        deleteButton.addEventListener("click", function() {

            deleteTask(task.id);

        });


        /* Add buttons */

        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        /* Build list item */

        listItem.appendChild(checkButton);

        listItem.appendChild(content);

        listItem.appendChild(actions);


        /* Add list item to page */

        todoList.appendChild(listItem);

    });


    /* Update progress */

    updateProgress();


    console.log("DOM updated successfully.");
}


/* =====================================================
   ADD TASK
   ===================================================== */

todoForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name = todoInput.value.trim();


    /* Validate input */

    if (name === "") {

        alert("Please enter an experiment name.");

        todoInput.focus();

        return;
    }


    /* Create new task */

    const newTask = {

        id: Date.now(),

        name: name,

        completed: false
    };


    /* Add task */

    tasks.push(newTask);


    console.log("New experiment added:", newTask);


    /* Refresh list */

    displayTasks();


    /* Clear input */

    todoInput.value = "";

    todoInput.focus();

});


/* =====================================================
   EDIT TASK
   ===================================================== */

function editTask(id) {

    let task = null;


    /* Find task */

    tasks.forEach(function(item) {

        if (item.id === id) {

            task = item;
        }

    });


    if (task === null) {

        console.error("Experiment not found.");

        return;
    }


    /* Ask for new name */

    const newName = prompt(
        "Enter the new experiment name:",
        task.name
    );


    /* Cancel */

    if (newName === null) {

        return;
    }


    const cleanName = newName.trim();


    /* Validate */

    if (cleanName === "") {

        alert("Experiment name cannot be empty.");

        return;
    }


    /* Update task */

    task.name = cleanName;


    console.log("Experiment edited:", task);


    /* Refresh list */

    displayTasks();
}


/* =====================================================
   DELETE TASK
   ===================================================== */

function deleteTask(id) {

    let taskName = "";


    /* Find task name */

    tasks.forEach(function(item) {

        if (item.id === id) {

            taskName = item.name;
        }

    });


    if (taskName === "") {

        return;
    }


    /* Confirmation */

    const answer = confirm(
        "Delete this experiment?\n\n" + taskName
    );


    if (!answer) {

        return;
    }


    /* Remove task */

    tasks = tasks.filter(function(item) {

        return item.id !== id;

    });


    console.log(
        "Experiment deleted:",
        taskName
    );


    /* Refresh list */

    displayTasks();
}


/* =====================================================
   MARK COMPLETE
   ===================================================== */

function toggleTask(id) {

    tasks.forEach(function(task) {

        if (task.id === id) {

            task.completed = !task.completed;

            console.log(
                "Experiment completion changed:",
                task.completed
            );
        }

    });


    /* Refresh page */

    displayTasks();
}


/* =====================================================
   UPDATE PROGRESS
   ===================================================== */

function updateProgress() {

    const total = tasks.length;

    let completed = 0;


    /* Count completed experiments */

    tasks.forEach(function(task) {

        if (task.completed) {

            completed++;
        }

    });


    /* Calculate percentage */

    let percentage = 0;


    if (total > 0) {

        percentage = Math.round(
            (completed / total) * 100
        );
    }


    /* Update DOM */

    progressText.textContent =
        completed + " of " + total + " completed";


    progressPercent.textContent =
        percentage + "%";


    progressFill.style.width =
        percentage + "%";


    /* Update task count */

    if (total === 1) {

        taskCount.textContent = "1 Task";

    } else {

        taskCount.textContent =
            total + " Tasks";
    }


    /* Empty message */

    if (total === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";
    }
}


/* =====================================================
   DOM TRAVERSAL DEMONSTRATION
   ===================================================== */

console.log("Todo List:", todoList);

console.log(
    "Parent Element:",
    todoList.parentElement
);

console.log(
    "Child Elements:",
    todoList.children
);

console.log(
    "Number of Children:",
    todoList.children.length
);

console.log(
    "First Child:",
    todoList.firstElementChild
);


/* =====================================================
   START APPLICATION
   ===================================================== */

displayTasks();

console.log(
    "Experiment 7 is ready."
);