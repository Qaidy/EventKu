// detail.js - Logic untuk halaman detail event
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  
  if (!eventId) {
    showNotification('Event tidak ditemukan!', 'error');
    setTimeout(() => {
      window.location.href = 'event-list.html';
    }, 1500);
    return;
  }
  
  loadEventDetail(eventId);
  setupButtons(eventId);
});

function loadEventDetail(eventId) {
  const event = EventStorage.getEventById(parseInt(eventId));
  
  if (!event) {
    showNotification('Event tidak ditemukan!', 'error');
    setTimeout(() => {
      window.location.href = 'event-list.html';
    }, 1500);
    return;
  }
  
  // Update page elements
  document.getElementById('eventImage').src = event.image;
  document.getElementById('eventImage').alt = event.title;
  document.getElementById('eventTitle').textContent = event.title;
  document.getElementById('eventDate').textContent = formatDate(event.date);
  document.getElementById('eventLocation').textContent = event.location;
  document.getElementById('eventCategory').innerHTML = `<span class="badge bg-primary">${event.category}</span>`;
  document.getElementById('eventOrganizer').textContent = event.organizer;
  document.getElementById('eventDescription').textContent = event.description;
  document.getElementById('eventPrice').textContent = formatPrice(event.price);
  
  // Update page title
  document.title = `${event.title} - EventKu`;
}

function setupButtons(eventId) {
  const registerBtn = document.getElementById('registerBtn');
  const eventIdInt = parseInt(eventId);
  
  // Check if already registered
  if (EventStorage.isRegistered(eventIdInt)) {
    setRegisteredState(registerBtn);
  }
  
  // Register button handler
  registerBtn.addEventListener('click', function() {
    if (!EventStorage.isRegistered(eventIdInt)) {
      const event = EventStorage.getEventById(eventIdInt);
      
      // Tambahkan loading state
      registerBtn.disabled = true;
      registerBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Memproses...';
      
      // Simulasi proses (bisa dihapus jika tidak perlu delay)
      setTimeout(() => {
        EventStorage.registerForEvent(eventIdInt);
        
        // Ubah tampilan tombol
        setRegisteredState(registerBtn);
        
        // Tampilkan notifikasi sukses
        showNotification(
          `Berhasil mendaftar untuk event "${event.title}"!`, 
          'success'
        );
      }, 500);
    }
  });
}

function setRegisteredState(button) {
  button.innerHTML = '<i class="fas fa-check-circle me-2"></i>Sudah Terdaftar';
  button.disabled = true;
  button.classList.remove('btn-primary');
  button.classList.add('btn-success');
  button.style.color = 'white'; // ← TAMBAH INI
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
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

function formatPrice(price) {
  if (price === 0) return 'Gratis';
  return 'Rp ' + price.toLocaleString('id-ID');
}