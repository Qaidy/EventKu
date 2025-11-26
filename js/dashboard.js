// Dashboard Page Script
let editModal
const bootstrap = window.bootstrap // Declare the bootstrap variable

document.addEventListener("DOMContentLoaded", () => {
  editModal = new bootstrap.Modal(document.getElementById("editEventModal"))

  displayMyEvents()
  displayFavorites()
  setupEventListeners()
})

function setupEventListeners() {
  document.getElementById("editEventForm").addEventListener("submit", handleEditSubmit)
}

function displayMyEvents() {
  const events = StorageManager.getAll() || []
  const userEventIds = JSON.parse(localStorage.getItem("userEvents") || "[]")
  
  // Fixed: Use actual userEvents array instead of hardcoded filter
  const userEvents = events.filter((event) => userEventIds.includes(event.id))

  const container = document.getElementById("myEventsContainer")
  const emptyMessage = document.getElementById("myEventsEmpty")

  if (userEvents.length === 0) {
    container.innerHTML = ""
    emptyMessage.style.display = "block"
    return
  }

  emptyMessage.style.display = "none"
  container.innerHTML = userEvents.map((event) => createDashboardCard(event, "user")).join("")
}

function displayFavorites() {
  const events = StorageManager.getAll() || []
  const favorites = StorageManager.getFavorites()
  const favoriteEvents = events.filter((event) => favorites.includes(event.id))

  const container = document.getElementById("favoritesContainer")
  const emptyMessage = document.getElementById("favoritesEmpty")

  if (favoriteEvents.length === 0) {
    container.innerHTML = ""
    emptyMessage.style.display = "block"
    return
  }

  emptyMessage.style.display = "none"
  container.innerHTML = favoriteEvents.map((event) => createDashboardCard(event, "favorite")).join("")
}

function createDashboardCard(event, type) {
  const image = event.image || `/placeholder.svg?height=250&width=350&query=event`

  let actionButtons = ""
  if (type === "user") {
    actionButtons = `
            <button class="btn btn-sm btn-warning" onclick="openEditModal(${event.id})">
                <i class="fas fa-edit me-1"></i>Edit
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteEvent(${event.id})">
                <i class="fas fa-trash me-1"></i>Hapus
            </button>
        `
  } else {
    actionButtons = `
            <a href="detail.html?id=${event.id}" class="btn btn-sm btn-primary">
                <i class="fas fa-eye me-1"></i>Lihat
            </a>
            <button class="btn btn-sm btn-danger" onclick="removeFavorite(${event.id})">
                <i class="fas fa-heart me-1"></i>Hapus
            </button>
        `
  }

  return `
        <div class="col-md-6 col-lg-4">
            <div class="card event-card shadow-sm h-100">
                <img src="${image}" alt="${event.title}" class="card-img-top" onerror="this.src='/community-event.png'">
                <div class="card-body event-card-body">
                    <h5 class="card-title">${event.title}</h5>
                    <p class="card-text small text-muted">
                        <i class="fas fa-calendar me-2"></i>${formatDate(event.date)}<br>
                        <i class="fas fa-map-marker-alt me-2"></i>${event.location}
                    </p>
                    <p class="card-text fw-bold text-primary">
                        ${event.price === 0 ? "Gratis" : `Rp ${event.price.toLocaleString("id-ID")}`}
                    </p>
                </div>
                <div class="card-footer bg-white border-top event-card-footer">
                    ${actionButtons}
                </div>
            </div>
        </div>
    `
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("id-ID", options)
}

function openEditModal(eventId) {
  const event = StorageManager.getById(eventId)

  document.getElementById("editEventId").value = eventId
  document.getElementById("editTitle").value = event.title
  document.getElementById("editDescription").value = event.description
  document.getElementById("editDate").value = event.date
  document.getElementById("editLocation").value = event.location
  document.getElementById("editPrice").value = event.price
  document.getElementById("editCategory").value = event.category

  editModal.show()
}

function handleEditSubmit(e) {
  e.preventDefault()

  const eventId = Number.parseInt(document.getElementById("editEventId").value)
  const updatedEvent = {
    title: document.getElementById("editTitle").value,
    description: document.getElementById("editDescription").value,
    date: document.getElementById("editDate").value,
    location: document.getElementById("editLocation").value,
    price: Number.parseInt(document.getElementById("editPrice").value),
    category: document.getElementById("editCategory").value,
  }

  StorageManager.update(eventId, updatedEvent)
  editModal.hide()
  displayMyEvents()
  alert("Event berhasil diperbarui!")
}

function deleteEvent(eventId) {
  if (confirm("Apakah Anda yakin ingin menghapus event ini?")) {
    StorageManager.delete(eventId)
    StorageManager.unmarkUserEvent(eventId)
    displayMyEvents()
    alert("Event berhasil dihapus!")
  }
}

function removeFavorite(eventId) {
  StorageManager.removeFavorite(eventId)
  displayFavorites()
}