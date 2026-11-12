import { API_URL, esc, formatTime } from "./config.js";

let admin = JSON.parse(localStorage.getItem("admin"));

if (!admin) {
    alert("Please login as Admin");
    window.location.href = "adminlogin.html";
} else {
    eve();
}

async function eve() {
    try {
        let res = await fetch(`${API_URL}/Events`);
        if (!res.ok) {
            throw new Error("Error fetching events");
        }
        let data = await res.json();
        let exist = document.getElementById("existing");

        data.forEach((element) => {
            let card = document.createElement("div");
            card.className = "event-card";
            card.innerHTML = `
    <img src="${esc(element.image)}" alt="${esc(element.title)}">
    <div class="card-body">
        <h3>${esc(element.title)}</h3>
        <p>📍 ${esc(element.location)}</p>
        <p>📅 ${esc(element.date)} • ${esc(formatTime(element.time))}</p>
        <p>🎵 ${esc(element.category)}</p>
        <p>🎟️ Seats left: ${esc(element.availableSeats)}</p>
        <p>📝 ${esc(element.description)}</p>
        <div class="price">₹${esc(element.price)}</div>
        <div class="buttons">
            <button onclick="editEvent(${Number(element.id)})">Edit</button>
            <button onclick="deleteEvent(${Number(element.id)})">Delete</button>
        </div>
    </div>`;
            exist.append(card);
        });
    } catch (error) {
        console.log(error);
    }
}

function editEvent(id) {
    window.location.href = `edit.html?id=${id}`;
}

async function deleteEvent(id) {
    if (!confirm("Are you sure you want to delete this event?")) {
        return;
    }

    try {
        let res = await fetch(`${API_URL}/Events/${id}`, { method: "DELETE" });

        if (res.ok) {
            alert("Event Deleted Successfully");
            location.reload();
        } else {
            alert("Delete Failed");
        }
    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

function logoutAdmin() {
    localStorage.removeItem("admin");
    window.location.href = "adminlogin.html";
}

Object.assign(window, { editEvent, deleteEvent, logoutAdmin });
