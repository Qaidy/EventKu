// home.js - Logic untuk halaman beranda
document.addEventListener('DOMContentLoaded', function() {
  loadLatestEvents();
});

function loadLatestEvents() {
  const container = document.getElementById('latestEventsContainer');
  const events = EventStorage.getAllEvents();
  
  // Ambil 3 event terbaru berdasarkan tanggal terdekat
  const sortedEvents = events
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);
  
  if (sortedEvents.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info text-center">
          <i class="fas fa-info-circle me-2"></i>Belum ada event tersedia
        </div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = sortedEvents.map(event => createEventCard(event)).join('');
}

function createEventCard(event) {
  const formattedDate = formatDate(event.date);
  const formattedPrice = formatPrice(event.price);
  const isRegistered = EventStorage.isRegistered(event.id);
  
  return `
    <div class="col-md-6 col-lg-4">
      <div class="card event-card shadow-sm h-100" data-aos="fade-up" data-aos-delay="100">
        <img src="${event.image}" class="card-img-top" alt="${event.title}" style="height: 200px; object-fit: cover;">
        <div class="card-body event-card-body">
          <span class="badge bg-primary mb-2">${event.category}</span>
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
          <a href="pages/detail.html?id=${event.id}" class="btn btn-outline-primary btn-sm flex-fill">
            <i class="fas fa-info-circle me-1"></i>Detail
          </a>
          <button 
            onclick="quickRegister(${event.id}, this)" 
            class="btn ${isRegistered ? 'btn-success' : 'btn-primary'} btn-sm flex-fill"
            ${isRegistered ? 'disabled' : ''}
            id="quickRegisterBtn-${event.id}">
            <i class="fas fa-check-circle me-1"></i>${isRegistered ? 'Terdaftar' : 'Daftar'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function quickRegister(eventId, buttonElement) {
  const event = EventStorage.getEventById(eventId);
  if (!event) {
    showNotification('Event tidak ditemukan!', 'error');
    return;
  }
  
  if (EventStorage.isRegistered(eventId)) {
    showNotification('Anda sudah terdaftar untuk event ini!', 'info');
    return;
  }
  
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
    
    // Reload events untuk update badge
    loadLatestEvents();
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
      notification.remove();
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