import { API_URL, esc, formatTime } from "./config.js";

let id = new URLSearchParams(window.location.search).get("id");
let user = JSON.parse(localStorage.getItem("user"));
let currentEvent = null;

async function book(id) {
    if (!user) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    let cen = document.getElementById("cen");
    try {
        let res = await fetch(`${API_URL}/Events/${id}`);
        if (!res.ok) {
            throw new Error("Failed to fetch event");
        }
        currentEvent = await res.json();
        let data = currentEvent;

        cen.innerHTML = `
        <div class="booking-card">
            <img src="${esc(data.image)}" alt="${esc(data.title)}">
            <div class="details">
                <h1>${esc(data.title)}</h1>
                <p><strong>Category :</strong> ${esc(data.category)}</p>
                <p><strong>Date :</strong> ${esc(data.date)}</p>
                <p><strong>Time :</strong> ${esc(formatTime(data.time))}</p>
                <p><strong>Location :</strong> ${esc(data.location)}</p>
                <p><strong>Price :</strong> ₹${esc(data.price)}</p>
                <p><strong>Seats left :</strong> ${esc(data.availableSeats)}</p>
                <hr>
                <h2>Book Ticket</h2>

                <label>Name</label>
                <input type="text" id="name" value="${esc(user.name)}" readonly>

                <label>Email</label>
                <input type="email" id="email" value="${esc(user.email)}" readonly>

                <label>Phone Number</label>
                <input type="tel" id="phone" placeholder="Enter 10-digit Phone Number" maxlength="10">

                <label>Number of Tickets</label>
                <input type="number" id="tickets" min="1" max="${Number(data.availableSeats)}" value="1">

                <label>Payment Method</label>
                <select id="payment">
                    <option>UPI</option>
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>Cash</option>
                </select>

                <button onclick="confirmBooking()">Confirm Booking</button>
            </div>
        </div>`;
    } catch (error) {
        console.log(error);
        cen.innerHTML = `<p>Event not found. <a href="index.html">Back to home</a></p>`;
    }
}

async function confirmBooking() {
    let phone = document.getElementById("phone").value.trim();
    let tickets = Number(document.getElementById("tickets").value);
    let payment = document.getElementById("payment").value;

    if (!/^\d{10}$/.test(phone)) {
        alert("Enter a valid 10-digit phone number");
        return;
    }
    if (!Number.isInteger(tickets) || tickets < 1) {
        alert("Enter a valid number of tickets");
        return;
    }

    try {
        // Re-read the event so the seat count is current
        let evRes = await fetch(`${API_URL}/Events/${currentEvent.id}`);
        if (!evRes.ok) throw new Error("Event no longer exists");
        let ev = await evRes.json();

        if (tickets > ev.availableSeats) {
            alert(`Only ${ev.availableSeats} seat(s) left`);
            return;
        }

        let booking = {
            userId: user.id,
            userName: user.name,
            email: user.email,
            eventName: ev.title,
            eventId: ev.id,
            tickets,
            phone,
            payment,
            total: tickets * ev.price
        };

        let res = await fetch(`${API_URL}/Bookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(booking)
        });

        if (!res.ok) {
            alert("Booking Failed");
            return;
        }

        // Reduce available seats
        await fetch(`${API_URL}/Events/${ev.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ availableSeats: ev.availableSeats - tickets })
        });

        localStorage.setItem("lastBooking", JSON.stringify(booking));
        window.location.href = "success.html";
    } catch (error) {
        console.log(error);
        alert("Booking Failed. Please try again.");
    }
}

window.confirmBooking = confirmBooking;
book(id);
