// Event List Page Script
let allEvents = []
let filteredEvents = []

document.addEventListener("DOMContentLoaded", () => {
  allEvents = StorageManager.getAll() || []
  filteredEvents = [...allEvents]

  displayEvents()
  setupEventListeners()
})

function setupEventListeners() {
  const searchInput = document.getElementById("searchInput")
  const categoryFilter = document.getElementById("categoryFilter")
  const sortFilter = document.getElementById("sortFilter")
  const resetButton = document.getElementById("resetFilters")

  searchInput.addEventListener("input", filterEvents)
  categoryFilter.addEventListener("change", filterEvents)
  sortFilter.addEventListener("change", filterEvents)
  resetButton.addEventListener("click", resetFilters)
}

function filterEvents() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()
  const category = document.getElementById("categoryFilter").value
  const sortOption = document.getElementById("sortFilter").value

  filteredEvents = allEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm)
    const matchesCategory = category === "" || event.category === category
    return matchesSearch && matchesCategory
  })

  sortEvents(sortOption)
  displayEvents()
}

function sortEvents(sortOption) {
  switch (sortOption) {
    case "date-asc":
      filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date))
      break
    case "date-desc":
      filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date))
      break
    case "price-asc":
      filteredEvents.sort((a, b) => a.price - b.price)
      break
    case "price-desc":
      filteredEvents.sort((a, b) => b.price - a.price)
      break
  }
}

function displayEvents() {
  const container = document.getElementById("eventsContainer")
  const emptyMessage = document.getElementById("emptyMessage")

  if (filteredEvents.length === 0) {
    container.innerHTML = ""
    emptyMessage.style.display = "block"
    return
  }

  emptyMessage.style.display = "none"
  container.innerHTML = filteredEvents.map((event) => createEventCard(event)).join("")
}

function createEventCard(event) {
  const categoryColor = {
    Workshop: "#6c757d",
    Seminar: "#0dcaf0",
    Konferensi: "#dc3545",
    Meetup: "#198754",
    Festival: "#ffc107",
  }

  const isFavorite = StorageManager.isFavorite(event.id)
  const image = event.image || `/placeholder.svg?height=300&width=400&query=event`

  return `
        <div class="col-sm-6 col-lg-4">
            <div class="card event-card shadow-sm h-100">
                <img src="${image}" alt="${event.title}" class="card-img-top" onerror="this.src='/community-event.png'">
                <div class="card-body event-card-body">
                    <div class="mb-2">
                        <span class="badge" style="background-color: ${categoryColor[event.category] || "#0d6efd"}">${event.category}</span>
                    </div>
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
                    <a href="detail.html?id=${event.id}" class="btn btn-primary btn-sm flex-grow-1">
                        <i class="fas fa-eye me-1"></i>Detail
                    </a>
                    <button class="btn btn-outline-danger btn-sm" onclick="toggleFavorite(${event.id})">
                        <i class="fas fa-heart${isFavorite ? " fa-solid" : ""}"></i>
                    </button>
                </div>
            </div>
        </div>
    `
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("id-ID", options)
}

function toggleFavorite(eventId) {
  if (StorageManager.isFavorite(eventId)) {
    StorageManager.removeFavorite(eventId)
  } else {
    StorageManager.addFavorite(eventId)
  }
  displayEvents()
}

function resetFilters() {
  document.getElementById("searchInput").value = ""
  document.getElementById("categoryFilter").value = ""
  document.getElementById("sortFilter").value = "date-asc"
  filteredEvents = [...allEvents]
  displayEvents()
}
