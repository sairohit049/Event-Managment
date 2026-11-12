import { API_URL } from "./config.js";

async function checkuser(e) {
    if (e) e.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    try {
        let res = await fetch(`${API_URL}/Users`);
        if (!res.ok) throw new Error("Failed to fetch users");
        let users = await res.json();

        let found = users.find(u => u.email === email && u.password === password);
        if (!found) {
            alert("Invalid Email or Password");
            return;
        }

        localStorage.setItem("user", JSON.stringify(found));
        alert("Login Successful");
        window.location.href = "index.html";
    } catch (error) {
        console.log(error);
        alert("Server Error. Please try again.");
    }
}

window.checkuser = checkuser;
