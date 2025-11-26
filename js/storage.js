// Storage Management System
const StorageManager = {
  KEYS: {
    EVENTS: "events",
    FAVORITES: "favorites",
    USER_EVENTS: "userEvents",
  },

  // Initialize with sample data
  init() {
    if (!this.getAll()) {
      const sampleEvents = [
        {
          id: 1,
          title: "Belajar Web Dasar",
          date: "2025-01-22",
          location: "Jakarta",
          price: 0,
          category: "Workshop",
          description:
            "Pelatihan dasar HTML CSS untuk pemula. Belajar membuat website pertama Anda dengan HTML dan CSS.",
          image: "/web-development-workshop.png",
          organizer: "Tech Academy",
        },
        {
          id: 2,
          title: "JavaScript Advanced Concepts",
          date: "2025-02-15",
          location: "Bandung",
          price: 150000,
          category: "Seminar",
          description:
            "Pelajari konsep-konsep lanjutan JavaScript seperti async/await, promises, dan closure. Event ini cocok untuk developer yang ingin meningkatkan skill.",
          image: "/javascript-programming.png",
          organizer: "Dev Community",
        },
        {
          id: 3,
          title: "React Conference 2025",
          date: "2025-03-10",
          location: "Surabaya",
          price: 250000,
          category: "Konferensi",
          description:
            "Konferensi React terbesar di Indonesia dengan pembicara internasional. Pelajari best practices, tips, dan tricks dalam mengembangkan aplikasi React.",
          image: "/react-conference.png",
          organizer: "React Indonesia",
        },
        {
          id: 4,
          title: "Startup Meetup Monthly",
          date: "2025-02-08",
          location: "Medan",
          price: 0,
          category: "Meetup",
          description:
            "Berkumpul dengan entrepreneur dan startup founders. Berbagi pengalaman, networking, dan berdiskusi tentang startup ecosystem.",
          image: "/startup-networking-meetup.jpg",
          organizer: "Startup Hub",
        },
        {
          id: 5,
          title: "Music Festival 2025",
          date: "2025-04-20",
          location: "Yogyakarta",
          price: 500000,
          category: "Festival",
          description:
            "Festival musik terbesar tahun ini dengan artis-artis ternama. Nikmati pertunjukan live, interactive booth, dan banyak surprise yang menarik.",
          image: "/music-festival-concert.jpg",
          organizer: "Music Events Pro",
        },
      ]
      localStorage.setItem(this.KEYS.EVENTS, JSON.stringify(sampleEvents))
      localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify([]))
      localStorage.setItem(this.KEYS.USER_EVENTS, JSON.stringify([]))
    }
  },

  // Get all events
  getAll() {
    const data = localStorage.getItem(this.KEYS.EVENTS)
    return data ? JSON.parse(data) : null
  },

  // Get event by ID
  getById(id) {
    const events = this.getAll()
    return events.find((event) => event.id === Number.parseInt(id))
  },

  // Add new event
  add(event) {
    const events = this.getAll() || []
    // Fixed: Handle empty array case properly
    const maxId = events.length > 0 ? Math.max(...events.map((e) => e.id)) : 0
    event.id = maxId + 1
    events.push(event)
    localStorage.setItem(this.KEYS.EVENTS, JSON.stringify(events))
    return event
  },

  // Update event
  update(id, updatedEvent) {
    const events = this.getAll()
    const index = events.findIndex((event) => event.id === Number.parseInt(id))
    if (index !== -1) {
      events[index] = { ...events[index], ...updatedEvent }
      localStorage.setItem(this.KEYS.EVENTS, JSON.stringify(events))
      return events[index]
    }
    return null
  },

  // Delete event
  delete(id) {
    const events = this.getAll()
    const filteredEvents = events.filter((event) => event.id !== Number.parseInt(id))
    localStorage.setItem(this.KEYS.EVENTS, JSON.stringify(filteredEvents))
  },

  // Favorites Management
  addFavorite(eventId) {
    const favorites = this.getFavorites()
    if (!favorites.includes(eventId)) {
      favorites.push(eventId)
      localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(favorites))
    }
  },

  removeFavorite(eventId) {
    const favorites = this.getFavorites()
    const filtered = favorites.filter((id) => id !== eventId)
    localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(filtered))
  },

  getFavorites() {
    const data = localStorage.getItem(this.KEYS.FAVORITES)
    return data ? JSON.parse(data) : []
  },

  isFavorite(eventId) {
    return this.getFavorites().includes(eventId)
  },

  // User Events Management
  addUserEvent(event) {
    return this.add(event)
  },

  getUserEvents() {
    const events = this.getAll()
    const userEventIds = JSON.parse(localStorage.getItem(this.KEYS.USER_EVENTS) || "[]")
    return events.filter((event) => userEventIds.includes(event.id))
  },

  markAsUserEvent(eventId) {
    const userEvents = JSON.parse(localStorage.getItem(this.KEYS.USER_EVENTS) || "[]")
    if (!userEvents.includes(eventId)) {
      userEvents.push(eventId)
      localStorage.setItem(this.KEYS.USER_EVENTS, JSON.stringify(userEvents))
    }
  },

  unmarkUserEvent(eventId) {
    const userEvents = JSON.parse(localStorage.getItem(this.KEYS.USER_EVENTS) || "[]")
    const filtered = userEvents.filter((id) => id !== eventId)
    localStorage.setItem(this.KEYS.USER_EVENTS, JSON.stringify(filtered))
  },

  isUserEvent(eventId) {
    const userEvents = JSON.parse(localStorage.getItem(this.KEYS.USER_EVENTS) || "[]")
    return userEvents.includes(eventId)
  },
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  StorageManager.init()
})