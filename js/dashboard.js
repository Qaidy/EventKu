// dashboard.js - Logic untuk dashboard user dengan CRUD functionality
let editModal;

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Bootstrap modal
  editModal = new bootstrap.Modal(document.getElementById('editEventModal'));
  
  // Load initial data
  loadMyEvents();
  
  // Setup edit form handler
  document.getElementById('editEventForm').addEventListener('submit', handleEditSubmit);
});

function loadMyEvents() {
  const container = document.getElementById('myEventsContainer');
  const emptyMessage = document.getElementById('myEventsEmpty');
  
  // Get all events (in real app, filter by user)
  const events = EventStorage.getAllEvents();
  
  if (events.length === 0) {
    container.innerHTML = '';
    emptyMessage.style.display = 'block';
    return;
  }
  
  emptyMessage.style.display = 'none';
  container.innerHTML = events.map(event => createMyEventCard(event)).join('');
}

function createMyEventCard(event) {
  const formattedDate = formatDate(event.date);
  const formattedPrice = formatPrice(event.price);
  
  return `
    <div class="col-md-6 col-lg-4">
      <div class="card event-card shadow-sm h-100">
        <img src="${event.image}" class="card-img-top" alt="${event.title}" style="height: 200px; object-fit: cover;">
        <div class="card-body event-card-body">
          <span class="badge bg-primary mb-2">${event.category}</span>
          <h5 class="card-title">${event.title}</h5>
          <p class="card-text text-muted small">${truncateText(event.description, 80)}</p>
          <div class="mb-2">
            <small class="text-muted">
              <i class="fas fa-calendar me-1"></i>${formattedDate}
            </small>
          </div>
          <div class="mb-2">
            <small class="text-muted">
              <i class="fas fa-map-marker-alt me-1"></i>${event.location}
            </small>
          </div>
          <div class="mt-3">
            <strong class="text-dark">${formattedPrice}</strong>
          </div>
        </div>
        <div class="card-footer bg-white border-0">
          <div class="d-grid gap-2">
            <a href="detail.html?id=${event.id}" class="btn btn-outline-primary btn-sm">
              <i class="fas fa-eye me-1"></i>Lihat Detail
            </a>
            <button onclick="editEvent(${event.id})" class="btn btn-warning btn-sm">
              <i class="fas fa-edit me-1"></i>Edit
            </button>
            <button onclick="deleteEvent(${event.id})" class="btn btn-danger btn-sm">
              <i class="fas fa-trash me-1"></i>Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function editEvent(eventId) {
  const event = EventStorage.getEventById(eventId);
  
  if (!event) {
    alert('Event tidak ditemukan!');
    return;
  }
  
  // Fill form with event data
  document.getElementById('editEventId').value = event.id;
  document.getElementById('editTitle').value = event.title;
  document.getElementById('editDescription').value = event.description;
  document.getElementById('editDate').value = event.date;
  document.getElementById('editLocation').value = event.location;
  document.getElementById('editPrice').value = event.price;
  document.getElementById('editCategory').value = event.category;
  
  // Show modal
  editModal.show();
}

function handleEditSubmit(e) {
  e.preventDefault();
  
  const eventId = parseInt(document.getElementById('editEventId').value);
  const title = document.getElementById('editTitle').value.trim();
  const description = document.getElementById('editDescription').value.trim();
  const date = document.getElementById('editDate').value;
  const location = document.getElementById('editLocation').value.trim();
  const price = parseInt(document.getElementById('editPrice').value);
  const category = document.getElementById('editCategory').value;
  
  const updatedData = {
    title,
    description,
    date,
    location,
    price,
    category
  };
  
  const result = EventStorage.updateEvent(eventId, updatedData);
  
  if (result) {
    alert('Event berhasil diupdate!');
    editModal.hide();
    loadMyEvents();
  } else {
    alert('Gagal mengupdate event!');
  }
}

function deleteEvent(eventId) {
  const event = EventStorage.getEventById(eventId);
  
  if (!event) {
    alert('Event tidak ditemukan!');
    return;
  }
  
  if (confirm(`Yakin ingin menghapus event "${event.title}"?\n\nTindakan ini tidak dapat dibatalkan.`)) {
    const result = EventStorage.deleteEvent(eventId);
    
    if (result) {
      alert('Event berhasil dihapus!');
      loadMyEvents();
    } else {
      alert('Gagal menghapus event!');
    }
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

function formatPrice(price) {
  if (price === 0) return 'Gratis';
  return 'Rp ' + price.toLocaleString('id-ID');
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}