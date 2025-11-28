// storage.js - Mengelola data event menggunakan localStorage
const EventStorage = {
  // Key untuk localStorage
  STORAGE_KEY: 'eventku_events',
  REGISTRATIONS_KEY: 'eventku_registrations',
  
  // Get events from localStorage
  get events() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : this.getDefaultEvents();
  },
  
  // Set events to localStorage
  set events(events) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
  },
  
  // Get registrations from localStorage
  get registrations() {
    const stored = localStorage.getItem(this.REGISTRATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  },
  
  // Set registrations to localStorage
  set registrations(registrations) {
    localStorage.setItem(this.REGISTRATIONS_KEY, JSON.stringify(registrations));
  },
  
  // Default events jika belum ada data
  getDefaultEvents() {
    const defaultEvents = [
      {
        id: 1,
        title: "Workshop Web Development",
        description: "Belajar membuat website modern dengan HTML, CSS, dan JavaScript dari dasar hingga mahir.",
        date: "2025-12-15",
        location: "Jakarta Convention Center",
        price: 150000,
        category: "Workshop",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
        organizer: "Tech Academy",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: "Seminar Digital Marketing",
        description: "Strategi pemasaran digital terkini untuk meningkatkan bisnis Anda di era digital.",
        date: "2025-12-20",
        location: "Surabaya Business Center",
        price: 200000,
        category: "Seminar",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
        organizer: "Marketing Pro",
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: "Music Festival 2025",
        description: "Festival musik terbesar tahun ini dengan lineup artis internasional dan lokal terbaik.",
        date: "2026-01-10",
        location: "Gelora Bung Karno",
        price: 500000,
        category: "Festival",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
        organizer: "Music Events ID",
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        title: "Startup Meetup",
        description: "Networking session untuk founder, investor, dan entrepreneur di ekosistem startup.",
        date: "2025-12-18",
        location: "Bandung Creative Hub",
        price: 0,
        category: "Meetup",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
        organizer: "Startup Community",
        createdAt: new Date().toISOString()
      }
    ];
    
    // Save default events to localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultEvents));
    return defaultEvents;
  },
  
  // Get all events
  getAllEvents() {
    return this.events;
  },
  
  // Get event by ID
  getEventById(id) {
    const events = this.events;
    return events.find(event => event.id === parseInt(id));
  },
  
  // Add new event
  addEvent(eventData) {
    const events = this.events;
    const newId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
    
    const newEvent = {
      id: newId,
      ...eventData,
      createdAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    this.events = events; // Save to localStorage
    
    return newEvent;
  },
  
  // Update event
  updateEvent(id, eventData) {
    const events = this.events;
    const index = events.findIndex(event => event.id === parseInt(id));
    
    if (index !== -1) {
      events[index] = {
        ...events[index],
        ...eventData
      };
      this.events = events; // Save to localStorage
      return events[index];
    }
    return null;
  },
  
  // Delete event
  deleteEvent(id) {
    const events = this.events;
    const index = events.findIndex(event => event.id === parseInt(id));
    
    if (index !== -1) {
      events.splice(index, 1);
      this.events = events; // Save to localStorage
      
      // Remove from registrations
      const registrations = this.registrations;
      this.registrations = registrations.filter(reg => reg !== parseInt(id));
      
      return true;
    }
    return false;
  },
  
  // Registration functions
  registerForEvent(eventId) {
    const registrations = this.registrations;
    const id = parseInt(eventId);
    
    if (!registrations.includes(id)) {
      registrations.push(id);
      this.registrations = registrations; // Save to localStorage
      return true;
    }
    return false;
  },
  
  isRegistered(eventId) {
    const registrations = this.registrations;
    return registrations.includes(parseInt(eventId));
  },
  
  // Filter and search functions (sama seperti sebelumnya)
  filterEvents(filters) {
    let filtered = [...this.events];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category);
    }
    
    if (filters.sort) {
      switch (filters.sort) {
        case 'date-asc':
          filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case 'date-desc':
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
      }
    }
    
    return filtered;
  }
};

// Make available globally
window.EventStorage = EventStorage;