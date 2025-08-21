const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", function(e){
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if(user){
    localStorage.setItem("currentUser", JSON.stringify(user));
    if(user.role === "admin"){
      window.location.href = "admin.html";
    } else {
      window.location.href = "dashboard.html";
    }
  } else {
    message.textContent = "Invalid email or password!";
    message.style.color = "red";
  }
});