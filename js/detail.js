// Event Detail Page Script
let eventId

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search)
  eventId = Number.parseInt(urlParams.get("id"))

  if (eventId) {
    displayEventDetail(eventId)
  } else {
    window.location.href = "../pages/event-list.html"
  }

  setupButtonListeners()
})

function displayEventDetail(id) {
  const event = StorageManager.getById(id)

  if (!event) {
    alert("Event tidak ditemukan")
    window.location.href = "../pages/event-list.html"
    return
  }

  const image = event.image || `/placeholder.svg?height=400&width=800&query=event`

  document.getElementById("eventImage").src = image
  document.getElementById("eventImage").onerror = function () {
    this.src = "/community-event.png"
  }
  document.getElementById("eventTitle").textContent = event.title
  document.getElementById("eventDate").textContent = formatDate(event.date)
  document.getElementById("eventLocation").textContent = event.location
  document.getElementById("eventCategory").innerHTML = `<span class="badge bg-primary">${event.category}</span>`
  document.getElementById("eventOrganizer").textContent = event.organizer
  document.getElementById("eventDescription").textContent = event.description
  document.getElementById("eventPrice").textContent =
    event.price === 0 ? "Gratis" : `Rp ${event.price.toLocaleString("id-ID")}`

  updateFavoriteButton()
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("id-ID", options)
}

function setupButtonListeners() {
  document.getElementById("registerBtn").addEventListener("click", registerEvent)
  document.getElementById("favoriteBtn").addEventListener("click", toggleFavorite)
}

function registerEvent() {
  alert("Terima kasih telah mendaftar untuk event ini! Kami akan menghubungi Anda segera.")
}

function toggleFavorite() {
  if (StorageManager.isFavorite(eventId)) {
    StorageManager.removeFavorite(eventId)
  } else {
    StorageManager.addFavorite(eventId)
  }
  updateFavoriteButton()
}

function updateFavoriteButton() {
  const btn = document.getElementById("favoriteBtn")
  const isFavorite = StorageManager.isFavorite(eventId)

  if (isFavorite) {
    btn.classList.remove("btn-outline-danger")
    btn.classList.add("btn-danger")
    btn.innerHTML = '<i class="fas fa-heart fa-solid me-2"></i>Hapus dari Favorit'
  } else {
    btn.classList.remove("btn-danger")
    btn.classList.add("btn-outline-danger")
    btn.innerHTML = '<i class="fas fa-heart me-2"></i>Tambah ke Favorit'
  }
}
