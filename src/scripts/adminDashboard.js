async function fetchUsers() {
  const token = localStorage.getItem("vigitechToken");
  try {
    const response = await fetch("http://vigitech-auth.integrador.xyz/api/users", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (data.success) {
      populateTable(data.users);
    } else {
      Toastify({
        text: "Error al obtener usuarios",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)"
      }).showToast();
    }
  } catch (error) {
    console.error("Error en fetchUsers:", error);
  }
}

function populateTable(users) {
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";
  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.active ? 'Activo' : 'Inactivo'}</td>
      <td>
        <button data-id="${user.id}" data-active="${user.active}">
          ${user.active ? 'Desactivar' : 'Activar'}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  addButtonEvents();
}

function addButtonEvents() {
  const buttons = document.querySelectorAll("#usersTable tbody button");
  buttons.forEach(button => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      const currentActive = button.getAttribute("data-active") === 'true';
      const newActive = !currentActive;
      const token = localStorage.getItem("vigitechToken");
      try {
        const response = await fetch(`http://vigitech-auth.integrador.xyz/api/users/${id}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ active: newActive })
        });
        const data = await response.json();
        if (data.success) {
          Toastify({
            text: "Estado actualizado",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
          }).showToast();
          fetchUsers(); 
        } else {
          Toastify({
            text: "Error al actualizar estado",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)"
          }).showToast();
        }
      } catch (error) {
        console.error("Error actualizando estado:", error);
      }
    });
  });
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("vigitechToken");
  localStorage.removeItem("vigitechUserName");
  window.location.href = "./login.html";
});

window.addEventListener("load", () => {
  fetchUsers();
});

document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    Toastify({
      text: "Acceso denegado",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #e74c3c, #c0392b)"
    }).showToast();
    window.location.href = "login.html";
  }
});
