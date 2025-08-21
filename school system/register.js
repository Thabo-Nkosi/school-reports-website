let users = JSON.parse(localStorage.getItem("users")) || [];
if(!users.some(u => u.role === "admin")){
    users.push({
        role: "admin",
        firstName: "Admin",
        lastName: "User",
        email: "admin@school.com",
        password: "AdminSecret123!"
    });
    localStorage.setItem("users", JSON.stringify(users));
}

const registerForm = document.getElementById("registerForm");
const childrenContainer = document.getElementById("childrenContainer");
const addChildBtn = document.getElementById("addChildBtn");
const message = document.getElementById("message");

addChildBtn.addEventListener("click", function(){
  const div = document.createElement("div");
  div.classList.add("child");
  div.innerHTML = `
    <input type="text" class="childId" placeholder="Child ID" required>
    <input type="text" class="childGrade" placeholder="Grade" required>
  `;
  childrenContainer.appendChild(div);
});

registerForm.addEventListener("submit", function(e){
  e.preventDefault();
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const parentId = document.getElementById("parentId").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if(password !== confirmPassword){
    message.textContent = "Passwords do not match!";
    message.style.color = "red";
    return;
  }

  const children = [];
  const childIds = document.querySelectorAll(".childId");
  const childGrades = document.querySelectorAll(".childGrade");
  for(let i=0;i<childIds.length;i++){
    children.push({ id: childIds[i].value.trim(), grade: childGrades[i].value.trim() });
  }

  users = JSON.parse(localStorage.getItem("users")) || [];
  if(users.some(u => u.email === email)){
    message.textContent = "Email already registered!";
    message.style.color = "red";
    return;
  }

  const newUser = { 
    role: "parent",
    firstName, lastName, email, parentId, children, 
    password, reports:[], letters:[], meetings:[], performance:[]
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  message.textContent = "Registration successful! Redirecting to login...";
  message.style.color = "green";

  setTimeout(()=> window.location.href = "index.html", 1500);
});