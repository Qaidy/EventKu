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
  
  // Clear container dan buat cards dengan AOS
  container.innerHTML = '';
  events.forEach((event, index) => {
    const eventCard = createEventCard(event, index);
    container.appendChild(eventCard);
  });
  
  // Refresh AOS setelah events dimuat
  setTimeout(() => {
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }, 100);
}

function createEventCard(event, index) {
  const formattedDate = formatDate(event.date);
  const formattedPrice = formatPrice(event.price);
  const isFavorite = EventStorage.isFavorite(event.id);
  const isRegistered = EventStorage.isRegistered(event.id);
  
  const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4';
  
  // Tambahkan AOS attribute dengan delay bertahap
  col.setAttribute('data-aos', 'fade-up');
  col.setAttribute('data-aos-delay', (index % 6) * 100); // Max delay 500ms
  col.setAttribute('data-aos-duration', '600');
  
  col.innerHTML = `
    <div class="card event-card shadow-sm h-100">
      <div class="position-relative">
        <img src="${event.image}" class="card-img-top" alt="${event.title}" style="height: 200px; object-fit: cover;">
        <button 
          onclick="toggleFavorite(${event.id})" 
          class="btn btn-sm position-absolute top-0 end-0 m-2 ${isFavorite ? 'btn-danger' : 'btn-light'}"
          style="border-radius: 50%; width: 40px; height: 40px;"
          data-aos="zoom-in" data-aos-delay="${(index % 6) * 100 + 200}">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="card-body event-card-body">
        <div data-aos="fade-up" data-aos-delay="${(index % 6) * 100 + 100}">
          <span class="badge bg-primary mb-2">${event.category}</span>
          ${isRegistered ? '<span class="badge bg-success mb-2 ms-1">Terdaftar</span>' : ''}
        </div>
        <h5 class="card-title" data-aos="fade-up" data-aos-delay="${(index % 6) * 100 + 150}">${event.title}</h5>
        <p class="card-text text-muted small" data-aos="fade-up" data-aos-delay="${(index % 6) * 100 + 200}">${truncateText(event.description, 100)}</p>
        <div class="mb-2" data-aos="fade-up" data-aos-delay="${(index % 6) * 100 + 250}">
          <small class="text-muted">
            <i class="fas fa-calendar me-1"></i>${formattedDate}
          </small>
        </div>
        <div class="mb-2" data-aos="fade-up" data-aos-delay="${(index % 6) * 100 + 300}">
          <small class="text-muted">
            <i class="fas fa-map-marker-alt me-1"></i>${event.location}
          </small>
        </div>
        <div class="mt-3" data-aos="fade-up" data-aos-delay="${(index % 6) * 100 + 350}">
          <strong class="text-primary">${formattedPrice}</strong>
        </div>
      </div>
      <div class="card-footer bg-white border-0 event-card-footer">
        <a href="detail.html?id=${event.id}" 
           class="btn btn-outline-primary btn-sm flex-fill"
           data-aos="zoom-in" 
           data-aos-delay="${(index % 6) * 100 + 400}">
          <i class="fas fa-info-circle me-1"></i>Detail
        </a>
        <button 
          onclick="registerEvent(${event.id}, this)" 
          class="btn ${isRegistered ? 'btn-success' : 'btn-primary'} btn-sm flex-fill"
          data-aos="zoom-in" 
          data-aos-delay="${(index % 6) * 100 + 450}"
          ${isRegistered ? 'disabled' : ''}
          id="registerBtn-${event.id}">
          <i class="fas fa-check-circle me-1"></i>${isRegistered ? 'Terdaftar' : 'Daftar'}
        </button>
      </div>
    </div>
  `;
  
  return col;
}

function toggleFavorite(eventId) {
  if (EventStorage.isFavorite(eventId)) {
    EventStorage.removeFromFavorites(eventId);
    showNotification('Dihapus dari favorit', 'info');
  } else {
    EventStorage.addToFavorites(eventId);
    showNotification('Ditambahkan ke favorit!', 'success');
  }
  loadEvents();
}

function registerEvent(eventId, buttonElement) {
  if (EventStorage.isRegistered(eventId)) {
    return;
  }
  
  const event = EventStorage.getEventById(eventId);
  
  // Tambahkan loading state dengan animasi
  buttonElement.disabled = true;
  buttonElement.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Memproses...';
  buttonElement.setAttribute('data-aos', 'pulse');
  
  // Simulasi proses pendaftaran
  setTimeout(() => {
    EventStorage.registerForEvent(eventId);
    
    // Update tombol jadi hijau dan disabled
    buttonElement.classList.remove('btn-primary');
    buttonElement.classList.add('btn-success');
    buttonElement.innerHTML = '<i class="fas fa-check-circle me-1"></i>Terdaftar';
    buttonElement.removeAttribute('data-aos');
    
    // Tampilkan notifikasi sukses
    showNotification(
      `Berhasil mendaftar untuk event "${event.title}"!`,
      'success'
    );
    
    // Refresh AOS untuk update animasi
    setTimeout(() => {
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }, 100);
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
  
  // Tambahkan AOS untuk notifikasi
  notification.setAttribute('data-aos', 'fade-left');
  notification.setAttribute('data-aos-duration', '500');
  
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
    // Refresh AOS untuk notifikasi
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
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

// Refresh AOS ketika filter berubah
function refreshAnimations() {
  setTimeout(() => {
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }, 150);
}

// Panggil refreshAnimations di setiap filter change
document.addEventListener('DOMContentLoaded', function() {
  // Refresh AOS setelah semua konten dimuat
  setTimeout(() => {
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }, 500);
});