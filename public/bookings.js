import { API_URL, esc } from "./config.js";

let container = document.getElementById("bookingContainer");
let user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    alert("Please login first");
    window.location.href = "login.html";
} else {
    loadBookings();
}

async function loadBookings() {
    try {
        let [bookingRes, eventRes] = await Promise.all([
            fetch(`${API_URL}/Bookings?userId=${encodeURIComponent(user.id)}`),
            fetch(`${API_URL}/Events`)
        ]);
        if (!bookingRes.ok || !eventRes.ok) throw new Error("Failed to load data");

        let myBookings = await bookingRes.json();
        let events = await eventRes.json();

        if (myBookings.length === 0) {
            container.innerHTML = `<h3 class="text-center">No bookings found.</h3>`;
            return;
        }

        myBookings.forEach(booking => {
            let event = events.find(e => e.id == booking.eventId);
            let card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
            ${event ? `<img src="${esc(event.image)}" class="card-img-top">` : ""}
            <div class="card-body">
                <h4>${esc(event ? event.title : booking.eventName)}${event ? "" : " (event removed)"}</h4>
                ${event ? `<p><b>Category :</b> ${esc(event.category)}</p>
                <p><b>Date :</b> ${esc(event.date)}</p>
                <p><b>Location :</b> ${esc(event.location)}</p>` : ""}
                <p><b>Tickets :</b> ${esc(booking.tickets)}</p>
                <p><b>Payment :</b> ${esc(booking.payment)}</p>
                <p class="total">₹${esc(booking.total)}</p>
                <button class="btn btn-danger" onclick="cancelBooking(${Number(booking.id)})">Cancel Booking</button>
            </div>`;
            container.append(card);
        });
    } catch (error) {
        console.log(error);
        container.innerHTML = `<h3 class="text-center">Unable to load bookings.</h3>`;
    }
}

async function cancelBooking(id) {
    if (!confirm("Cancel this booking?")) {
        return;
    }
    try {
        let bRes = await fetch(`${API_URL}/Bookings/${id}`);
        let booking = bRes.ok ? await bRes.json() : null;

        let res = await fetch(`${API_URL}/Bookings/${id}`, { method: "DELETE" });
        if (!res.ok) {
            alert("Could not cancel booking");
            return;
        }

        // Give the seats back
        if (booking) {
            let evRes = await fetch(`${API_URL}/Events/${booking.eventId}`);
            if (evRes.ok) {
                let ev = await evRes.json();
                await fetch(`${API_URL}/Events/${ev.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ availableSeats: ev.availableSeats + Number(booking.tickets || 0) })
                });
            }
        }

        alert("Booking Cancelled");
        location.reload();
    } catch (err) {
        console.log(err);
        alert("Server Error");
    }
}

window.cancelBooking = cancelBooking;
