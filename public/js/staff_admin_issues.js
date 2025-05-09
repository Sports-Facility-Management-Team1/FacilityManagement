// console.log("JS loaded successfully!");
// Firebase setup
import { db } from './firebase.js';
// import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { collection, getDocs, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// DOM references
const tableBody = document.querySelector("#issuesTable tbody");
const modal = document.getElementById("issueModal");
const statusSelect = document.getElementById("statusSelect");
const feedbackInput = document.getElementById("feedback");
const cancelBtn = document.getElementById("cancelBtn");
const updateForm = document.getElementById("updateForm");
const descriptionPara = document.getElementById("issueDescription");

let currentIssueId = null;

// Load issues and usernames
async function loadIssues() {
  const issuesSnapshot = await getDocs(collection(db, "Issues"));
  tableBody.innerHTML = "";

  for (const issueDoc of issuesSnapshot.docs) {
    const issueData = issueDoc.data();
    const issueId = issueDoc.id;
    const submittedBy = issueData.submittedBy;

    // Fetch the user's username
    const userDoc = await getDoc(doc(db, "users", submittedBy));
    const username = userDoc.exists() ? userDoc.data().username : "Unknown";

    // Create a new row
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${username}</td>
      <td>${issueData.title}</td>
      <td><button class="viewBtn" data-id="${issueId}">View</button></td>
    `;
    tableBody.appendChild(tr);
  }

  // Add event listeners to all view buttons
  document.querySelectorAll(".viewBtn").forEach(btn =>
    btn.addEventListener("click", handleView)
  );
}

// Open modal and show issue details
async function handleView(e) {
  const issueId = e.target.dataset.id;
  const issueRef = doc(db, "Issues", issueId);
  const issueSnap = await getDoc(issueRef);

  if (!issueSnap.exists()) return;

  const issue = issueSnap.data();

  currentIssueId = issueId;
  descriptionPara.textContent = issue.description || "No description.";
  statusSelect.value = issue.status || "Pending";
  feedbackInput.value = issue.feedback || "";

  modal.hidden = false;
}

// Submit updated status and feedback
updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentIssueId) return;

  await updateDoc(doc(db, "Issues", currentIssueId), {
    status: statusSelect.value,
    feedback: feedbackInput.value
  });

  modal.hidden = true;
  currentIssueId = null;
  loadIssues(); // Refresh table
});

// Cancel button hides modal
cancelBtn.addEventListener("click", () => {
  modal.hidden = true;
  currentIssueId = null;
});

loadIssues();