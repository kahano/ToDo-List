

// Retrieve stored todos and sorting order
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let IsLatestFirst = JSON.parse(localStorage.getItem("IsLatestFirst")) || true;

$(document).ready(function () {
    // Attach event listeners
    $("#add-btn").on("click", behandleAddToDoTasks);
    $("#sort-btn").on("click", toggleSort);

    // Toggle sections on click (Fixed issue with immediate execution)
    $(".section-header").on("click", function () {
        $(this).next(".section-contents").toggleClass("extends");
        $(this).toggleClass("active");
    });

    // Render the tasks initially
    renderToDoTasks();
});

// Save todos to localStorage
function saveToDoToLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("IsLatestFirst", JSON.stringify(IsLatestFirst));
}

// Function to add a new todo task
function behandleAddToDoTasks() {
    let input = $("#todo");
    let text = input.val().trim();

    if (text !== "") {
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            timestamp: Date.now(), // Store timestamp as a number
        };

        todos.push(task);
        saveToDoToLocalStorage();
        alert("Task added!");
        console.log("Task added:", task);

        input.val(""); // Clear input field
        renderToDoTasks(); // Re-render tasks
    } else {
        alert("Task couldn't be added, please try again!");
    }
}

// Function to toggle task completion
function toggleComplete(id) {
    todos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveToDoToLocalStorage();
    renderToDoTasks();
}

// Function to sort tasks by date
function toggleSort() {
    IsLatestFirst = !IsLatestFirst;
    saveToDoToLocalStorage();
    $("#sort-btn").html(
        IsLatestFirst
            ? "Sort by Oldest <i class='bx bx-sort'></i>"
            : "Sort by Latest <i class='bx bx-sort'></i>"
    );
    renderToDoTasks();
}

// Function to create a todo list item
function createTodoElement(todo) {
    const li = $("<li>").addClass("todo-item");

    // Create checkbox
    const checkbox = $("<input>", {
        type: "checkbox",
        class: "checkbox",
        checked: todo.completed,
    }).on("change", () => toggleComplete(todo.id));

    // Create text span
    const span = $("<span>").addClass("todo-text").text(todo.text);

    // Create delete button
    const deleteBtn = $("<button>")
        .addClass("delete-btn")
        .html("<i class='bx bx-trash'></i>")
        .on("click", () => deleteTask(todo.id));

    li.append(checkbox, span, deleteBtn);
    return li;
}

// Function to render todo tasks
function renderToDoTasks() {
    const uncompletedList = $("#uncompleted-list");
    const completedList = $("#completedList");
    uncompletedList.html("");
    completedList.html("");

    // Sort todos based on timestamp
    const sortedTODOS = [...todos].sort((a, b) =>
        IsLatestFirst ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
    );

    let completedCount = 0;
    let uncompletedCount = 0;

    sortedTODOS.forEach((todo) => {
        const li = createTodoElement(todo);
        if (todo.completed) {
            completedList.append(li);
            completedCount++;
        } else {
            uncompletedList.append(li);
            uncompletedCount++;
        }
    });

    // Update counters
    $("#completed-count").text(completedCount);
    $("#uncompleted-count").text(uncompletedCount);

    // Update sort button text
    $("#sort-btn").html(
        IsLatestFirst
            ? "Sort by Oldest <i class='bx bx-sort'></i>"
            : "Sort by Latest <i class='bx bx-sort'></i>"
    );
}

// Function to delete a task
function deleteTask(id) {
    todos = todos.filter((todo) => todo.id !== id);
    saveToDoToLocalStorage();
    renderToDoTasks();
}
