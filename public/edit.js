import { API_URL, to24h } from "./config.js";

if (!localStorage.getItem("admin")) {
    alert("Please login as Admin");
    window.location.href = "adminlogin.html";
}

let params = new URLSearchParams(window.location.search);
let id = params.get("id");

async function loadEvent() {
    try {
        let res = await fetch(`${API_URL}/Events/${id}`);
        if (!res.ok) {
            throw new Error("Failed to fetch event");
        }
        let data = await res.json();

        document.getElementById("title").value = data.title;
        document.getElementById("image").value = data.image;
        document.getElementById("category").value = data.category;
        document.getElementById("date").value = data.date;
        document.getElementById("time").value = to24h(data.time);
        document.getElementById("location").value = data.location;
        document.getElementById("organizer").value = data.organizer;
        document.getElementById("availableSeats").value = data.availableSeats;
        document.getElementById("price").value = data.price;
        document.getElementById("description").value = data.description;
    } catch (error) {
        console.log(error);
        alert("Event not found");
        window.location.href = "admin.html";
    }
}

if (id) {
    loadEvent();
} else {
    window.location.href = "admin.html";
}

async function updateEvent() {
    const get = f => document.getElementById(f).value.trim();

    let event = {
        title: get("title"),
        image: get("image"),
        category: get("category"),
        date: get("date"),
        time: get("time"),
        location: get("location"),
        organizer: get("organizer"),
        availableSeats: Number(get("availableSeats")),
        price: Number(get("price")),
        description: get("description")
    };

    if (Object.values(event).some(v => v === "" || Number.isNaN(v))) {
        alert("Please fill all the fields.");
        return;
    }
    if (!Number.isInteger(event.availableSeats) || event.availableSeats < 0 || event.price < 0) {
        alert("Seats and price must be valid, non-negative numbers.");
        return;
    }

    try {
        let res = await fetch(`${API_URL}/Events/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event)
        });

        if (res.ok) {
            alert("Event Updated Successfully");
            window.location.href = "admin.html";
        } else {
            alert("Update Failed");
        }
    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

window.updateEvent = updateEvent;
