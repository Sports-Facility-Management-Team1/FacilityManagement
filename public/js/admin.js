
// admin.js

import { googleSignOut } from "./googleSignout.js";
const managebtn=document.getElementById('usersBtn');

managebtn.addEventListener('click',async(e)=>{

    e.preventDefault();
    window.location.href="./list_users.html";


});
document.getElementById("userImgBtn").addEventListener('click',() => {
    googleSignOut();
    window.location.href = "./login_page.html"; 
  })
  

document.getElementById("reportBtn").addEventListener("click", () => {
    window.location.href = "./staff_admin_issues.html"; 
  });
  document.getElementById("bookingsBtn").addEventListener("click", () => {
    window.location.href = "./staff_admin_booking.html"; 
  });
  document.getElementById("dashboardBtn").addEventListener("click", () => {
    window.location.href = "./reports_dashboard.html"; 
  });



//---------------------------------------------------------------------------------------------------------------// 



