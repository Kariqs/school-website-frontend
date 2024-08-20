function showForm() {
  document.getElementById("addUserForm").style.display = "block";
  document.getElementById("userTableContainer").style.display = "none";
  document.getElementById("findUserContainer").style.display = "none";
  document.getElementById("userInfo").style.display = "none";
  document.getElementById("intro").style.display = "none";
}

function showTeachers() {
  fetchAndShowTeachers();
}

function showStudents() {
  fetchAndShowStudents();
}

function findUser() {
  document.getElementById("findUserContainer").style.display = "flex";
  document.getElementById("addUserForm").style.display = "none";
  document.getElementById("userTableContainer").style.display = "none";
  document.getElementById("intro").style.display = "none";
}

async function addUser() {
  const firstname = document.getElementById("firstname").value;
  const middlename = document.getElementById("middlename").value;
  const surname = document.getElementById("surname").value;
  const usertype = document.getElementById("userType").value;
  const idnumber = document.getElementById("idNumber").value;

  const user = {
    firstname: firstname,
    middlename: middlename,
    surname: surname,
    usertype: usertype,
    idnumber: idnumber,
  };

  try {
    const response = await fetch(
      "https://school-website-api-one.vercel.app/admin/create-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );

    if (response.ok) {
      const result = await response.json();
      errorMessage(result.message, "success-display");
      clearInputs();
    } else if (response.status === 409) {
      errorMessage("User with this Id already exist", "error-display");
      console.error("Conflict error: User already exists.");
    } else {
      errorMessage("User was not created", "error-display");
      console.error("Error creating user:", response.statusText);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

//fetch students or teachers and show them on a table.
async function fetchAndShowTeachers() {
  try {
    const response = await fetch(
      "https://school-website-api-one.vercel.app/admin/get-teachers",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const teachers = await response.json();
      displayUsers(teachers.teachers, "Teachers");
    } else {
      console.error("Error fetching teachers:", response.statusText);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

async function fetchAndShowStudents() {
  try {
    const response = await fetch(
      "https://school-website-api-one.vercel.app/admin/get-students",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const students = await response.json();
      displayUsers(students.students, "Students");
    } else {
      console.error("Error fetching students:", response.statusText);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

function displayUsers(users, userType) {
  if (users.length === 0) {
    errorMessage(`No ${userType.toLowerCase()} found.`, "error-display");
    return;
  }

  let table = "<table>";
  table += `
      <tr>
          <th>First Name</th>
          <th>Middle Name</th>
          <th>Surname</th>
          <th>ID Number</th>
      </tr>
  `;

  users.forEach((user) => {
    table += `
          <tr>
              <td>${user.firstname}</td>
              <td>${user.middlename}</td>
              <td>${user.surname}</td>
              <td>${user.idnumber}</td>
          </tr>
      `;
  });

  table += "</table>";
  document.getElementById("userTableContainer").innerHTML = table;
  document.getElementById("userTableContainer").style.display = "block";
  document.getElementById("addUserForm").style.display = "none";
  document.getElementById("findUserContainer").style.display = "none";
  document.getElementById("userInfo").style.display = "none";
  document.getElementById("intro").style.display = "none";
}

//find one user
async function findUserById() {
  const userId = document.getElementById("findUserId").value;

  if (!userId) {
    alert("Please enter a User ID");
    return;
  }

  try {
    const response = await fetch(
      `https://school-website-api-one.vercel.app/admin/get-user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const user = await response.json();
      document.getElementById("userInfo").style.display = "block";
      const name = `${user.firstname} ${user.middlename} ${user.surname}`;
      document.getElementById("user-name").textContent = "NAME: " + name;
      document.getElementById("user-id").textContent =
        "ID NUMBER: " + user.idnumber;
      document.getElementById("user-type").textContent =
        "USER TYPE: " + user.usertype;
      document.getElementById("findUserId").value = "";
    } else {
      console.error("Error fetching user:", response.statusText);
      errorMessage("User with that ID not found", "error-display");
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Network error occurred");
  }
}

async function deleteUser() {
  try {
    const userId = document
      .getElementById("user-id")
      .textContent.split(":")[1]
      .trim();
    const response = await fetch(
      `https://school-website-api-one.vercel.app/admin/delete-user/${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      document.getElementById("userInfo").remove();
      errorMessage("User deleted.", "success-display");
    } else {
      errorMessage("User does not exist", "error-display");
    }
  } catch (err) {
    console.log("An error occured: " + err);
  }
}

function errorMessage(message, addClass) {
  document.getElementById("error").style.display = "block";
  document.getElementById("error").textContent = message;
  document.getElementById("error").classList.add(addClass);
  setTimeout(() => {
    document.getElementById("error").style.display = "none";
    document.getElementById("error").classList.remove(addClass);
  }, 5000);
}

function clearInputs() {
  document.getElementById("firstname").value = "";
  document.getElementById("middlename").value = "";
  document.getElementById("surname").value = "";
  document.getElementById("userType").value = "";
  document.getElementById("idNumber").value = "";
}
