import { API_URL, esc, formatTime } from "./config.js";

let id = new URLSearchParams(window.location.search).get("id");

async function getEvent(id) {
    let eventDetails = document.getElementById("eventDetails");
    try {
        let res = await fetch(`${API_URL}/Events/${id}`);
        if (!res.ok) {
            throw new Error("Failed to fetch event");
        }
        let data = await res.json();
        let soldOut = Number(data.availableSeats) <= 0;

        eventDetails.innerHTML = `
        <div class="event-card">
            <img src="${esc(data.image)}" alt="${esc(data.title)}">
            <div class="details">
                <h1>${esc(data.title)}</h1>
                <p><strong>Category:</strong> ${esc(data.category)}</p>
                <p><strong>Date:</strong> ${esc(data.date)}</p>
                <p><strong>Time:</strong> ${esc(formatTime(data.time))}</p>
                <p><strong>Location:</strong> ${esc(data.location)}</p>
                <p><strong>Organizer:</strong> ${esc(data.organizer)}</p>
                <p><strong>Available Seats:</strong> ${soldOut ? "Sold out" : esc(data.availableSeats)}</p>
                <p>${esc(data.description)}</p>
                <h2>₹${esc(data.price)}</h2>
                <button onclick="goToBooking(${Number(data.id)})" ${soldOut ? "disabled" : ""}>
                    ${soldOut ? "Sold Out" : "Book Ticket"}
                </button>
            </div>
        </div>`;
    } catch (error) {
        console.log(error);
        eventDetails.innerHTML = `<p>Event not found. <a href="index.html">Back to home</a></p>`;
    }
}

function goToBooking(id) {
    window.location.href = `book.html?id=${id}`;
}

window.goToBooking = goToBooking;
getEvent(id);
