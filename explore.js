document.addEventListener('DOMContentLoaded', () => {
  const vendorStalls = document.getElementById('vendorStalls');
  const stalls = JSON.parse(localStorage.getItem('stalls')) || [];

  if (!stalls.length) {
    vendorStalls.innerHTML = `
      <p class="text-center text-muted">No vendor stalls added yet.</p>
    `;
    return;
  }

  // Function to render all cards
  function renderStalls() {
    vendorStalls.innerHTML = '';

    stalls.forEach((stall, index) => {
      const col = document.createElement('div');
      col.className = 'col-md-4';
      col.innerHTML = `
        <div class="card explore-card shadow border-0 rounded-4 h-100">
          <div class="img-container">
            <img src="${stall.photo || './assets/default-stall.jpg'}" 
                 alt="${stall.name}" class="card-img-top">
          </div>
          <div class="card-body">
            <h5 class="fw-bold">${stall.name}</h5>
            <p class="text-muted mb-2">${stall.type || 'Street Snacks • Local Food'}</p>
            <div class="d-flex justify-content-between mb-3">
              <span class="badge bg-success">${(4 + Math.random() * 0.5).toFixed(1)} ★</span>
              <span class="text-muted">₹${stall.avgPrice || 80} for two</span>
              <span class="text-muted">${(1 + Math.random() * 3).toFixed(1)} km</span>
            </div>
            <p class="mb-1"><strong>Owner:</strong> ${stall.owner}</p>
            <p class="mb-1"><strong>Contact:</strong> ${stall.contact}</p>
            <a href="https://www.google.com/maps/search/${encodeURIComponent(stall.location)}"
               target="_blank"
               class="btn btn-primary w-100 rounded-pill direction-btn mb-2">Get Directions</a>

            <!-- Delete Button -->
            <button class="btn btn-outline-danger w-100 rounded-pill delete-btn" data-index="${index}">
              <i class="bi bi-trash"></i> Delete Stall
            </button>
          </div>
        </div>
      `;
      vendorStalls.appendChild(col);
    });

    // Attach delete handlers
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.closest('button').dataset.index;
        const confirmDelete = confirm('🗑️ Are you sure you want to delete this stall?');
        if (confirmDelete) {
          stalls.splice(index, 1); // remove from array
          localStorage.setItem('stalls', JSON.stringify(stalls)); // save updated list
          renderStalls(); // refresh UI
        }
      });
    });
  }

  renderStalls();
});
