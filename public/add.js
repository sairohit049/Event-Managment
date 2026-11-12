import { API_URL } from "./config.js";

if (!localStorage.getItem("admin")) {
    alert("Please login as Admin");
    window.location.href = "adminlogin.html";
}

const FIELDS = ["title", "image", "category", "date", "time", "location",
                "organizer", "availableSeats", "price", "description"];

function addevent() {
    let v = {};
    FIELDS.forEach(f => v[f] = document.getElementById(f).value.trim());

    if (FIELDS.some(f => !v[f])) {
        alert("Please fill all the fields.");
        return;
    }

    let seats = Number(v.availableSeats);
    let price = Number(v.price);

    if (!Number.isInteger(seats) || seats < 1) {
        alert("Seats must be a whole number of at least 1.");
        return;
    }
    if (!(price >= 0)) {
        alert("Price cannot be negative.");
        return;
    }

    adding({ ...v, availableSeats: seats, price });
}

async function adding(obj) {
    try {
        let res = await fetch(`${API_URL}/Events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj)
        });

        if (!res.ok) {
            throw new Error("Failed to add event");
        }

        alert("✅ Event Added Successfully");
        window.location.href = "admin.html";
    } catch (error) {
        console.error(error);
        alert("❌ Unable to add event. Please try again.");
    }
}

window.addevent = addevent;
