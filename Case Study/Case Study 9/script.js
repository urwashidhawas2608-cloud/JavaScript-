let students = [];

// ========================================
// LOAD DATA FROM JSON
// ========================================
fetch("students.json")
    .then(response => response.json())
    .then(data => {
        students = data.students;
        displayStudents();
        updateDashboard();
    })
    .catch(error => {
        console.log("Error loading JSON:", error);
        // If JSON cannot be loaded, try localStorage
        const savedStudents =
            localStorage.getItem("students");
        if (savedStudents) {
            students = JSON.parse(savedStudents);
            displayStudents();
            updateDashboard();
        }
    });
// ========================================
// DISPLAY STUDENTS
// ========================================
function displayStudents() {
    const table =
        document.getElementById("studentTable");
    table.innerHTML = "";
    const searchValue =
        document
            .getElementById("search")
            .value
            .toLowerCase();
    const filterValue =
        document
            .getElementById("statusFilter")
            .value;
    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.id.toLowerCase().includes(searchValue) ||
            student.name.toLowerCase().includes(searchValue);
        const matchesStatus =
            filterValue === "All" ||
            student.status === filterValue;
        return matchesSearch && matchesStatus;
    });
    filteredStudents.forEach(student => {
        const row =
            document.createElement("tr");
        let statusClass = "";
        if (student.status === "Done") {
            statusClass = "status-done";
        }
        else if (student.status === "Pending") {
            statusClass = "status-pending";
        }
        else if (student.status === "Cancelled") {
            statusClass = "status-cancelled";
        }
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.email}</td>
            <td>${student.date}</td>
            <td>${student.payment}</td>
            <td>
                <span class="status ${statusClass}">
                    ${student.status}
                </span>
            </td>
            <td>
                <button
                    class="update-btn"
                    onclick="updateStatus('${student.id}')"
                >
                    Update
                </button>
                <button
                    class="delete-btn"
                    onclick="deleteStudent('${student.id}')"
                >
                    Delete
                </button>
            </td>
        `;
        table.appendChild(row);
    });
}
// ========================================
// ADD STUDENT
// ========================================
document
    .getElementById("studentForm")
    .addEventListener("submit", function(event) {
        event.preventDefault();
        const id =
            document.getElementById("studentId").value;
        const name =
            document.getElementById("studentName").value;
        const course =
            document.getElementById("course").value;
        const email =
            document.getElementById("email").value;
        const date =
            document.getElementById("date").value;
        const payment =
            document.getElementById("payment").value;
        const status =
            document.getElementById("status").value;
        // Check duplicate ID
        const exists =
            students.some(student =>
                student.id === id
            );
        if (exists) {
            alert("Student ID already exists!");
            return;
        }
        const newStudent = {
            id: id,
            name: name,
            course: course,
            email: email,
            date: date,
            status: status,
            payment: payment
        };
        students.push(newStudent);
        // Save to browser storage
        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );
        displayStudents();
        updateDashboard();
        alert(
            "Student registration added successfully!"
        );
        document
            .getElementById("studentForm")
            .reset();
    });
// ========================================
// UPDATE STATUS
// ========================================
function updateStatus(id) {
    const student =
        students.find(student =>
            student.id === id
        );
    if (!student) {
        return;
    }
    const newStatus =
        prompt(
            "Enter status:\nDone\nPending\nCancelled",
            student.status
        );
    if (!newStatus) {
        return;
    }
    const formattedStatus =
        newStatus.charAt(0).toUpperCase() +
        newStatus.slice(1).toLowerCase();
    if (
        formattedStatus !== "Done" &&
        formattedStatus !== "Pending" &&
        formattedStatus !== "Cancelled"
    ) {
        alert(
            "Invalid status! Use Done, Pending or Cancelled."
        );
        return;
    }
    student.status = formattedStatus;
    // Update payment automatically
    if (formattedStatus === "Done") {
        student.payment = "Paid";
    }
    else if (formattedStatus === "Cancelled") {
        student.payment = "Refunded";
    }
    else {
        student.payment = "Pending";
    }
    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
    displayStudents();
    updateDashboard();
    alert("Status updated successfully!");
}
// ========================================
// DELETE STUDENT
// ========================================
function deleteStudent(id) {
    const confirmation =
        confirm(
            "Are you sure you want to delete this registration?"
        );
    if (!confirmation) {
        return;
    }
    students =
        students.filter(student =>
            student.id !== id
        );
    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
    displayStudents();
    updateDashboard();
}
// ========================================
// DASHBOARD COUNTS
// ========================================
function updateDashboard() {
    const total =
        students.length;
    const done =
        students.filter(student =>
            student.status === "Done"
        ).length;
    const pending =
        students.filter(student =>
            student.status === "Pending"
        ).length;
    const cancelled =
        students.filter(student =>
            student.status === "Cancelled"
        ).length;
    document.getElementById("totalCount")
        .textContent = total;
    document.getElementById("doneCount")
        .textContent = done;
    document.getElementById("pendingCount")
        .textContent = pending;
    document.getElementById("cancelledCount")
        .textContent = cancelled;
}
// ========================================
// SEARCH
// ========================================
document
    .getElementById("search")
    .addEventListener(
        "input",
        displayStudents
    );
// ========================================
// FILTER
// ========================================
document
    .getElementById("statusFilter")
    .addEventListener(
        "change",
        displayStudents
    );
