import { API_URL } from "./config.js";

async function signup(e) {
    if (e) e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim().toLowerCase();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (name === "") {
        alert("Name is required");
        return;
    }
    if (name.length < 3) {
        alert("Name must contain at least 3 characters");
        return;
    }
    if (email === "") {
        alert("Email is required");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Enter a valid email");
        return;
    }
    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        let res = await fetch(`${API_URL}/Users`);
        if (!res.ok) throw new Error("Failed to fetch users");
        let users = await res.json();

        if (users.some(u => String(u.email).toLowerCase() === email)) {
            alert("Email already registered");
            return;
        }

        let created = await fetch(`${API_URL}/Users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        if (!created.ok) throw new Error("Signup failed");

        alert("Account Created Successfully");
        window.location.href = "./login.html";
    } catch (error) {
        console.log(error);
        alert("Unable to create account. Please try again.");
    }
}

window.signup = signup;
