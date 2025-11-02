console.log("✅ explore.js loaded");

// 🧭 Default Stalls (Static)
const defaultStalls = [
  {
    name: "Zatka Panipuri",
    foodType: "Street Snacks • Fast Food",
    location: "Panchavati, Nashik",
    contact: "—",
    image: "./assets/zatkapanipuri.jpg",
    mapsLink: "https://maps.app.goo.gl/JDo6YNduGAtKt1A77"
  },
  {
    name: "Om Bajrang Misal",
    foodType: "Snacks • Spicy Bites",
    location: "Dwarka, Nashik",
    contact: "—",
    image: "./assets/ombajrangmisal.jpg",
    mapsLink: "https://maps.app.goo.gl/RAvYjpbC7Le1u8Z2A"
  },
  {
    name: "Samarth Juice Centre",
    foodType: "Drinks & Refreshments",
    location: "Nashik Road",
    contact: "—",
    image: "./assets/samarthjuice.jpg",
    mapsLink: "https://maps.app.goo.gl/nqWVviVzunhGq9S78"
  },
  {
    name: "Bhole's Rock and Rolls",
    foodType: "Snacks • Rolls",
    location: "College Road",
    contact: "—",
    image: "./assets/rock&roll.jpg",
    mapsLink: "https://maps.app.goo.gl/u9BewnkUGcmuJpudA"
  },
  {
    name: "Mauli Kadhi Samosa",
    foodType: "Sweet • Spicy",
    location: "Gangapur Road",
    contact: "—",
    image: "./assets/maulisamosa.jpg",
    mapsLink: "https://maps.app.goo.gl/wbEY5YWFcoPojZgW6"
  },
  {
    name: "Sai Chinese Corner",
    foodType: "Chinese • Snacks",
    location: "Nashik Road",
    contact: "—",
    image: "./assets/saichines.jpg",
    mapsLink: "https://maps.app.goo.gl/CNgREbie6Mdpsbys8"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("vendorStalls");
  const user = SnackAuth.getCurrentUser();
  const isAdmin = user && user.role === "admin";

  // Load vendor stalls
  const vendorStalls = JSON.parse(localStorage.getItem("snackscout_stalls_v1")) || [];

  // Merge both
  let allStalls = [...defaultStalls, ...vendorStalls];
  renderStalls(allStalls);

  // 🧩 Search Functionality
  document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const query = document.getElementById("searchInput").value.trim().toLowerCase();

    const filtered = allStalls.filter((s) =>
      (s.name || "").toLowerCase().includes(query) ||
      (s.foodType || "").toLowerCase().includes(query) ||
      (s.location || "").toLowerCase().includes(query)
    );

    renderStalls(filtered);
  });

  // 🧱 Render Function
  function renderStalls(stalls) {
    container.innerHTML = "";

    if (stalls.length === 0) {
      container.innerHTML = `<p class="text-center text-muted">No stalls found.</p>`;
      return;
    }

    stalls.forEach((stall, index) => {
      const deleteBtn =
        isAdmin && vendorStalls.includes(stall)
          ? `<button class="btn btn-danger btn-sm mt-2 delete-btn" data-index="${index}">Delete</button>`
          : "";

      const mapButton = stall.mapsLink
        ? `<a href="${stall.mapsLink}" target="_blank" class="btn btn-primary w-100 rounded-pill">Get Directions</a>`
        : `<button class="btn btn-secondary w-100 rounded-pill" disabled>No Map Link</button>`;

      const card = `
        <div class="col-md-4">
          <div class="card explore-card shadow border-0 rounded-4">
            <div class="img-container">
              <img src="${stall.image || './assets/default.jpg'}" alt="${stall.name}" class="card-img-top">
            </div>
            <div class="card-body">
              <h5 class="fw-bold">${stall.name}</h5>
              <p class="text-muted mb-2">${stall.foodType}</p>
              <div class="mb-2"><strong>Location:</strong> ${stall.location}</div>
              <div class="mb-2"><strong>Contact:</strong> ${stall.contact}</div>
              ${mapButton}
              ${deleteBtn}
            </div>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });

    // Admin Delete
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        if (confirm("Are you sure you want to delete this stall?")) {
          vendorStalls.splice(index - defaultStalls.length, 1);
          localStorage.setItem("snackscout_stalls_v1", JSON.stringify(vendorStalls));
          alert("✅ Stall deleted successfully!");
          window.location.reload();
        }
      });
    });
  }
});
