const logoutBtn = document.getElementById("logoutBtn");
const content = document.getElementById("content");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Logout function
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

// Function to render a section (reports, letters, meetings, performance)
function renderSection(section) {
  content.innerHTML = "";

  if (!currentUser[section] || currentUser[section].length === 0) {
    content.innerHTML = "<p>No entries yet.</p>";
    return;
  }

  currentUser[section].forEach((item) => {
    // Only show posts for this parent's children
    const childIds = currentUser.children.map(c => c.id);
    if (childIds.includes(item.childId)) {
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
        <h4>${item.title} (Child ID: ${item.childId})</h4>
        <p>${item.desc}</p>
        <a href="#" onclick='downloadItem("${item.title}", "${item.desc}", "${item.file || ''}", "${item.fileName || ''}")'>Download</a>
      `;
      content.appendChild(div);
    }
  });
}

// Function to download a post (PDF or text)
function downloadItem(title, desc, file, fileName) {
  if (file) {
    const link = document.createElement("a");
    link.href = file;
    link.download = fileName;
    link.click();
  } else {
    const blob = new Blob([title + "\n\n" + desc], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = title + ".txt";
    link.click();
  }
}

// Navigation buttons
document.getElementById("viewReports").addEventListener("click", () => renderSection("reports"));
document.getElementById("viewLetters").addEventListener("click", () => renderSection("letters"));
document.getElementById("viewMeetings").addEventListener("click", () => renderSection("meetings"));
document.getElementById("viewPerformance").addEventListener("click", () => renderSection("performance"));

// Show reports by default
renderSection("reports");