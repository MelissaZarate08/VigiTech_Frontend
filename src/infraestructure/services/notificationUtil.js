export function showToast(message, options = {}) {
  Toastify({
    text: message,
    duration: options.duration || 5000,
    close: options.close !== undefined ? options.close : true,
    gravity: options.gravity || "top",       
    position: options.position || "right",
    style: {
      background: options.background || "linear-gradient(to right, #00b09b, #96c93d)",
      ...options.style,
    },
    stopOnFocus: options.stopOnFocus !== undefined ? options.stopOnFocus : true,
  }).showToast();
}
