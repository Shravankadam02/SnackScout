const user = SnackAuth.getCurrentUser();

if (!user) {
  alert('Please login first.');
  window.location.href = 'login.html';
} else if (user.role !== 'vendor' && user.role !== 'admin') {
  alert('Only vendors or admins can access this page.');
  window.location.href = 'index.html';
}

// Handle Stall Registration Form
document.getElementById("stallForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Stop page reload

  const stallName = document.getElementById("stallName").value.trim();
  const ownerName = document.getElementById("ownerName").value.trim();
  const foodType = document.getElementById("foodType").value.trim();
  const location = document.getElementById("location").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const photoInput = document.getElementById("photo");

  // Validation
  if (!stallName || !ownerName || !foodType || !location || !contact) {
    alert("Please fill out all fields before submitting!");
    return;
  }

  // Convert image to Base64
  const file = photoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      saveStall(event.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    saveStall("");
  }

  // Save Stall
  function saveStall(imageData) {
    const stalls = JSON.parse(localStorage.getItem("snackscout_stalls_v1")) || [];
    const mapsLink = document.getElementById("mapsLink").value.trim();

    const newStall = {
      name: stallName,
      owner: ownerName,
      foodType,
      location,
      contact,
      image: imageData,
      mapsLink: mapsLink || "",
      addedBy: user.email,
    };

    stalls.push(newStall);
    localStorage.setItem("snackscout_stalls_v1", JSON.stringify(stalls));

    alert("✅ Stall registered successfully!");
    window.location.href = "explore.html";
  }
});
