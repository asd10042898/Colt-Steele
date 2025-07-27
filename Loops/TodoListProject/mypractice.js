// "new" - Add A Todo
// "list" - List All Todos
// "delete" - Remove Specific Todo
// "quit" - Quit App

let action = prompt("What would you like to do?").toLowerCase() //要採取的行為 : new, list, delete, quit
const todoList = []
const actionList = ["new", "list", "delete"]
//new 的動作
while(action !== "quit") {
    while(!actionList.includes(action)) {
        action = prompt("Please enter the valid action.").toLowerCase()
    }
    if (action === "new") {
        const newTodo = prompt("Enter new todo.");
        todoList.push(newTodo);
        console.log(`${newTodo} added to list.`);
    } else if (action === "list") {
        console.log(`********`);
        for (let todos of todoList) {
            console.log(`${todoList.indexOf(todos)}: ${todos}`);
        }
        console.log(`********`);
    } else if (action === "delete") {
        deleteNum = parseInt(prompt("Enter index of todo to delete."));
        while (deleteNum >= todoList.length) {
            deleteNum = parseInt(prompt("Please enter valid index number."));
        }
        deleteTodo = todoList[deleteNum];
        todoList.splice(deleteNum, 1);
        console.log(`Todo : ${deleteTodo} removed.`);
    } 
    action = prompt("What would you like to do?").toLowerCase()
}

console.log("OK, You Quit The App!")
