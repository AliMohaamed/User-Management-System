var btnGetAllUser = document.getElementById("get");
var tbody = document.querySelector("tbody");
var btnDelete = document.querySelector(".btn-delete");
var btnView = document.querySelector(".btn-view");
var modal = document.querySelector(".modal-overlay");
var modalBody = document.querySelector(".modal-body");
var deleteModal = document.getElementById("deleteModal");
var deleteUserNameSpan = document.getElementById("deleteUserName");
var users = [];
var requestCount = 0;
var userToDelete = null;

btnGetAllUser.addEventListener("click", function () {
  try {
    if (!requestCount) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "https://jsonplaceholder.typicode.com/users");
      xhr.send();
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          requestCount++;
          users = JSON.parse(xhr.response);
          // Create Table row
          updateUI(users);
        }
      };
    }
  } catch (error) {
    alert("Error: ", error);
  }
});

function updateUI(users) {
  tbody.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    var tableRow = `
            <tr>
              <td>${users[i].id}</td>
              <td>${users[i].name}</td>
              <td>${users[i].email}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-view">View Details</button>
                  <button class="btn btn-delete">Delete</button>
                </div>
              </td>
            </tr>
            `;
    tbody.insertAdjacentHTML("beforeend", tableRow);
  }
}

tbody.addEventListener("click", function (e) {
  var row = e.target.closest("tr");
  var id = Number(row.children[0].textContent);

  if (e.target.classList.contains("btn-delete")) {
    // Find the user to delete
    let user = users.find((user) => user.id === id);
    if (user) {
      userToDelete = { id: id, index: users.findIndex((u) => u.id === id) };
      deleteUserNameSpan.textContent = user.name;
      deleteModal.classList.add("active");
    }
  }

  if (e.target.classList.contains("btn-view")) {
    modalBody.innerHTML = "";
    modal.classList.add("active");
    users.forEach(function (user, index) {
      if (user.id === id) {
        printInnerObject(user);
      }
    });
  }
});

// Handle delete confirmation
deleteModal.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-confirm-delete") && userToDelete) {
    users.splice(userToDelete.index, 1);
    updateUI(users);
    closeDeleteModal();
  } else if (
    e.target.classList.contains("btn-cancel") ||
    e.target.classList.contains("modal-close") ||
    !e.target.closest(".modal")
  ) {
    closeDeleteModal();
  }
});

// Close delete modal on Escape key
deleteModal.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeDeleteModal();
  }
});

function closeDeleteModal() {
  deleteModal.classList.remove("active");
  userToDelete = null;
}

modal.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("btn-primary") ||
    e.target.classList.contains("modal-close") ||
    !e.target.closest(".modal")
  ) {
    closeModal();
  }
});
modal.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

function closeModal() {
  modal.classList.remove("active");
}

function printInnerObject(obj, level = 0) {
  var indent = " ".repeat(level * 4);
  Object.keys(obj).forEach(function (key) {
    if (Array.isArray(obj[key])) {
      detailRow(key, `${indent}${obj[key].join(" - ")}`);
    } else if (typeof obj[key] === "object") {
      var createElement = document.createElement("h4");
      createElement.classList.add("title-row");
      createElement.textContent = key.toLocaleUpperCase();
      modalBody.appendChild(createElement);
      printInnerObject(obj[key], level + 1);
    } else {
      detailRow(key, `${indent}${obj[key]}`);
    }
  });
}

function detailRow(key, value) {
  var html = `
    <div class="detail-row">
          <div class="detail-label">${key}:</div>
          <div class="detail-value">${value}</div>
    </div>
  `;
  modalBody.insertAdjacentHTML("beforeend", html);
}
