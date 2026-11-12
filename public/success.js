import { esc } from "./config.js";

let booking = JSON.parse(localStorage.getItem("lastBooking"));
let successContainer = document.getElementById("successContainer");

function goHome() {
    window.location.href = "index.html";
}

function myBookings() {
    window.location.href = "bookings.html";
}

if (!booking) {
    alert("No booking found.");
    window.location.href = "index.html";
} else {
    successContainer.innerHTML = `
<div class="success-card">
    <div class="success-icon">✅</div>
    <h1>Booking Successful!</h1>
    <p>Your ticket has been booked successfully.</p>

    <div class="details">
        <p><strong>Name :</strong> ${esc(booking.userName)}</p>
        <p><strong>Email :</strong> ${esc(booking.email)}</p>
        <p><strong>Event :</strong> ${esc(booking.eventName)}</p>
        <p><strong>Tickets :</strong> ${esc(booking.tickets)}</p>
        <p><strong>Payment :</strong> ${esc(booking.payment)}</p>
        <p><strong>Total Amount :</strong> ₹${esc(booking.total)}</p>
    </div>

    <div class="btns">
        <button class="home" onclick="goHome()">Home</button>
        <button class="booking" onclick="myBookings()">My Bookings</button>
    </div>
</div>`;
}

Object.assign(window, { goHome, myBookings });
