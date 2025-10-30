// Handle Stall Registration Form
document.getElementById('stallForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const fileInput = document.getElementById('photo');
  const reader = new FileReader();

  // When file is read (converted to Base64)
  reader.onload = function () {
    const imageUrl = reader.result || ''; // base64 string or empty if no image

    // Collect form data
    const stall = {
      name: document.getElementById('stallName').value,
      owner: document.getElementById('ownerName').value,
      type: document.getElementById('foodType').value,
      location: document.getElementById('location').value,
      contact: document.getElementById('contact').value,
      photo: imageUrl // base64 string
    };

    // Retrieve existing stalls (if any)
    let stalls = JSON.parse(localStorage.getItem('stalls')) || [];
    stalls.push(stall);

    // Save back to localStorage
    localStorage.setItem('stalls', JSON.stringify(stalls));

    // Confirmation alert
    alert('✅ Stall added successfully!');

    // Reset form
    document.getElementById('stallForm').reset();

    // Redirect to Explore page
    window.location.href = 'explore.html';
  };

  // Read the image file if selected
  if (fileInput.files.length > 0) {
    reader.readAsDataURL(fileInput.files[0]); // ✅ Convert image to Base64
  } else {
    // If no file uploaded, still proceed
    reader.onload();
  }
});
