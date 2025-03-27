// src/scripts/adminDashboard.js

// Función para obtener la lista de usuarios desde el backend
async function fetchUsers() {
    const token = localStorage.getItem("vigitechToken");
    try {
      const response = await fetch("http://192.168.2.187:8080/api/users", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        populateTable(data.users);
      } else {
        alert("Error al obtener usuarios");
      }
    } catch (error) {
      console.error("Error en fetchUsers:", error);
    }
  }
  
  // Función para llenar la tabla con los usuarios
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
  
  // Agrega eventos a los botones de cada fila para cambiar el estado
  function addButtonEvents() {
    const buttons = document.querySelectorAll("#usersTable tbody button");
    buttons.forEach(button => {
      button.addEventListener("click", async () => {
        const id = button.getAttribute("data-id");
        const currentActive = button.getAttribute("data-active") === 'true';
        const newActive = !currentActive;
        const token = localStorage.getItem("vigitechToken");
        try {
          const response = await fetch(`http://192.168.2.187:8080/api/users/${id}/status`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ active: newActive })
          });
          const data = await response.json();
          if (data.success) {
            fetchUsers(); // Refresca la lista de usuarios
          } else {
            alert("Error al actualizar estado");
          }
        } catch (error) {
          console.error("Error actualizando estado:", error);
        }
      });
    });
  }
  
  // Evento para cerrar sesión
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("vigitechToken");
    localStorage.removeItem("vigitechUserName");
    window.location.href = "./login.html";
  });
  
  // Al cargar la página, se obtiene la lista de usuarios
  window.addEventListener("load", () => {
    fetchUsers();
  });

  document.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
        alert("Acceso denegado");
        window.location.href = "login.html";
    }
});

  