// Add Event Page Script
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addEventForm").addEventListener("submit", handleSubmit)
})

function handleSubmit(e) {
  e.preventDefault()

  // Clear previous errors
  clearErrors()

  // Get form data
  const formData = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    date: document.getElementById("date").value,
    location: document.getElementById("location").value.trim(),
    price: Number.parseInt(document.getElementById("price").value) || 0,
    category: document.getElementById("category").value,
    image: document.getElementById("image").value.trim(),
    organizer: document.getElementById("organizer").value.trim(),
  }

  // Validate form
  if (!validateForm(formData)) {
    return
  }

  // Add event to storage and get the new event with ID
  const newEvent = StorageManager.addUserEvent(formData)
  // Mark using the actual ID of the newly created event
  StorageManager.markAsUserEvent(newEvent.id)

  // Show success message
  alert("Event berhasil dibuat! Silakan lihat di dashboard Anda.")

  // Reset form
  document.getElementById("addEventForm").reset()

  // Redirect to dashboard
  setTimeout(() => {
    window.location.href = "dashboard.html"
  }, 1000)
}

function validateForm(data) {
  let isValid = true

  // Title validation
  if (!data.title || data.title.length < 3) {
    showError("titleError", "Judul harus minimal 3 karakter")
    isValid = false
  }

  // Description validation
  if (!data.description || data.description.length < 10) {
    showError("descriptionError", "Deskripsi harus minimal 10 karakter")
    isValid = false
  }

  // Date validation
  if (!data.date || new Date(data.date) < new Date()) {
    showError("dateError", "Tanggal harus di masa depan")
    isValid = false
  }

  // Location validation
  if (!data.location) {
    showError("locationError", "Lokasi harus diisi")
    isValid = false
  }

  // Price validation
  if (data.price < 0) {
    showError("priceError", "Harga tidak boleh negatif")
    isValid = false
  }

  // Category validation
  if (!data.category) {
    showError("categoryError", "Kategori harus dipilih")
    isValid = false
  }

  // Organizer validation
  if (!data.organizer) {
    showError("organizerError", "Nama penyelenggara harus diisi")
    isValid = false
  }

  return isValid
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId)
  if (errorElement) {
    errorElement.textContent = message
    errorElement.style.display = "block"
  }
}

function clearErrors() {
  document.querySelectorAll(".text-danger").forEach((el) => {
    el.textContent = ""
    el.style.display = "none"
  })
}