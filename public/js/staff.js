
import { googleSignOut } from "./googleSignout.js";


document.getElementById("reportBtn").addEventListener("click", () => {
    window.location.href = "./staff_admin_issues.html";
  });
  document.getElementById("userImgBtn").addEventListener('click',() => {
      googleSignOut();
      window.location.href = "./login_page.html"; 
    })
  document.getElementById("bookingsBtn").addEventListener("click", () => {
    window.location.href = "./staff_admin_booking.html"; 
  });

  document.getElementById("usersbtn").addEventListener("click", () => {
   
  window.location.href="./list_residents.html";
  });

  document.getElementById("dashboardBtn").addEventListener("click", () => {
    window.location.href = "./reports_dashboard.html"; 
  });
 