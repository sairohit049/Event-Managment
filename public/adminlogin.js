import { API_URL } from "./config.js";

async function che(e) {
    if (e) e.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        alert("Please fill all fields");
        return;
    }

    try {
        let res = await fetch(`${API_URL}/admin`);
        if (!res.ok) {
            throw new Error("Failed to fetch admin data");
        }
        let data = await res.json();

        let admin = data.find(a => a.email === email && a.password === password);

        if (admin) {
            localStorage.setItem("admin", JSON.stringify(admin));
            alert("Admin Login Successful");
            window.location.href = "admin.html";
        } else {
            alert("Invalid Email or Password");
        }
    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

window.che = che;
