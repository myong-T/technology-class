document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("todo-input");
    const addButton = document.getElementById("add-btn");
    const todoList = document.getElementById("todo-list");
    const calendar = document.getElementById("calendar");

    let selectedDate = new Date().toISOString().split("T")[0]; // 기본 날짜: 오늘

    // 🟢 날짜 변경 시 할 일 업데이트
    calendar.addEventListener("change", () => {
        selectedDate = calendar.value;
        loadTodos();
    });

    // 🟢 할 일 불러오기 (선택한 날짜 기준)
    const loadTodos = () => {
        const savedTodos = JSON.parse(localStorage.getItem("todos")) || {};
        todoList.innerHTML = ""; // 기존 목록 초기화
        (savedTodos[selectedDate] || []).forEach(todo => addTodo(todo.text, todo.completed));
    };

    // 🟢 할 일 추가 함수
    const addTodo = (text, completed = false) => {
        if (!text.trim()) return;

        const li = document.createElement("li");
        li.classList.add("todo-item");
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed;
        checkbox.addEventListener("change", () => {
            saveTodos();
            li.classList.toggle("completed", checkbox.checked);
        });

        const span = document.createElement("span");
        span.textContent = text;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            li.remove();
            saveTodos();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);

        saveTodos();
    };

    // 🟢 할 일 저장 (날짜별 저장)
    const saveTodos = () => {
        const savedTodos = JSON.parse(localStorage.getItem("todos")) || {};
        savedTodos[selectedDate] = [];

        document.querySelectorAll(".todo-item").forEach(li => {
            savedTodos[selectedDate].push({
                text: li.querySelector("span").textContent,
                completed: li.querySelector("input").checked
            });
        });

        localStorage.setItem("todos", JSON.stringify(savedTodos));
    };

    // 🟢 추가 버튼 클릭 시 할 일 추가
    addButton.addEventListener("click", () => {
        addTodo(inputField.value);
        inputField.value = "";
    });

    // 🟢 Enter 키 입력 시 할 일 추가
    inputField.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addTodo(inputField.value);
            inputField.value = "";
        }
    });

    // 🟢 페이지 로드 시 기본 날짜 설정 및 할 일 불러오기
    calendar.value = selectedDate;
    loadTodos();
});
