// event-list.js - Logic untuk halaman daftar event dengan filter dan search
let currentFilters = {
  search: '',
  category: '',
  sort: 'date-asc'
};

document.addEventListener('DOMContentLoaded', function() {
  initializeFilters();
  loadEvents();
});

function initializeFilters() {
  // Search input
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', debounce(function(e) {
    currentFilters.search = e.target.value;
    loadEvents();
  }, 300));
  
  // Category filter
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.addEventListener('change', function(e) {
    currentFilters.category = e.target.value;
    loadEvents();
  });
  
  // Sort filter
  const sortFilter = document.getElementById('sortFilter');
  sortFilter.addEventListener('change', function(e) {
    currentFilters.sort = e.target.value;
    loadEvents();
  });
  
  // Reset button
  const resetBtn = document.getElementById('resetFilters');
  resetBtn.addEventListener('click', function() {
    searchInput.value = '';
    categoryFilter.value = '';
    sortFilter.value = 'date-asc';
    currentFilters = {
      search: '',
      category: '',
      sort: 'date-asc'
    };
    loadEvents();
  });
}

function loadEvents() {
  const container = document.getElementById('eventsContainer');
  const emptyMessage = document.getElementById('emptyMessage');
  
  const events = EventStorage.filterEvents(currentFilters);
  
  if (events.length === 0) {
    container.innerHTML = '';
    emptyMessage.style.display = 'block';
    return;
  }
  
  emptyMessage.style.display = 'none';
  
  // Clear container dan buat cards
  container.innerHTML = '';
  events.forEach((event, index) => {
    const eventCard = createEventCard(event);
    container.appendChild(eventCard);
  });
}

function createEventCard(event) {
  const formattedDate = formatDate(event.date);
  const formattedPrice = formatPrice(event.price);
  const isRegistered = EventStorage.isRegistered(event.id);
  
  const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4';
  
  col.innerHTML = `
    <div class="card event-card shadow-sm h-100">
      <div class="position-relative">
        <img src="${event.image}" class="card-img-top" alt="${event.title}" style="height: 200px; object-fit: cover;">
      </div>
      <div class="card-body event-card-body">
        <div>
          <span class="badge bg-primary mb-2">${event.category}</span>
        </div>
        <h5 class="card-title">${event.title}</h5>
        <p class="card-text text-muted small">${truncateText(event.description, 100)}</p>
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
          <strong class="text-purple">${formattedPrice}</strong>
        </div>
      </div>
      <div class="card-footer bg-white border-0 event-card-footer">
        <a href="detail.html?id=${event.id}" 
           class="btn btn-outline-primary btn-sm flex-fill">
          <i class="fas fa-info-circle me-1"></i>Detail
        </a>
        <button 
          onclick="registerEvent(${event.id}, this)" 
          class="btn ${isRegistered ? 'btn-success' : 'btn-primary'} btn-sm flex-fill"
          ${isRegistered ? 'disabled' : ''}
          id="registerBtn-${event.id}">
          <i class="fas fa-check-circle me-1"></i>${isRegistered ? 'Terdaftar' : 'Daftar'}
        </button>
      </div>
    </div>
  `;
  
  return col;
}

function registerEvent(eventId, buttonElement) {
  if (EventStorage.isRegistered(eventId)) {
    return;
  }
  
  const event = EventStorage.getEventById(eventId);
  
  // Tambahkan loading state
  buttonElement.disabled = true;
  buttonElement.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Memproses...';
  
  // Simulasi proses pendaftaran
  setTimeout(() => {
    EventStorage.registerForEvent(eventId);
    
    // Update tombol jadi hijau dan disabled
    buttonElement.classList.remove('btn-primary');
    buttonElement.classList.add('btn-success');
    buttonElement.innerHTML = '<i class="fas fa-check-circle me-1"></i>Terdaftar';
    
    // Tampilkan notifikasi sukses
    showNotification(
      `Berhasil mendaftar untuk event "${event.title}"!`,
      'success'
    );
  }, 500);
}

function showNotification(message, type = 'success') {
  // Hapus notifikasi lama jika ada
  const existingNotif = document.querySelector('.custom-notification');
  if (existingNotif) {
    existingNotif.remove();
  }
  
  // Buat elemen notifikasi
  const notification = document.createElement('div');
  notification.className = `custom-notification ${type}`;
  
  // Icon berdasarkan type
  let icon = '';
  if (type === 'success') {
    icon = '<i class="fas fa-check-circle"></i>';
  } else if (type === 'error') {
    icon = '<i class="fas fa-exclamation-circle"></i>';
  } else if (type === 'info') {
    icon = '<i class="fas fa-info-circle"></i>';
  }
  
  notification.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;
  
  // Tambahkan ke body
  document.body.appendChild(notification);
  
  // Trigger animasi masuk
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Hapus setelah 3 detik
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
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

// Debounce function untuk search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}