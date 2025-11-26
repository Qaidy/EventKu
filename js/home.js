// Home Page Script
document.addEventListener("DOMContentLoaded", () => {
  displayLatestEvents()
})

function displayLatestEvents() {
  const events = StorageManager.getAll()
  const latestEvents = events.slice(0, 3)
  const container = document.getElementById("latestEventsContainer")

  container.innerHTML = latestEvents.map((event) => createEventCard(event)).join("")
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
        <div class="col-md-6 col-lg-4">
            <div class="card event-card shadow-sm">
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
                    <a href="pages/detail.html?id=${event.id}" class="btn btn-primary btn-sm flex-grow-1">
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
  displayLatestEvents()
}
