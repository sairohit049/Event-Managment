import { API_URL, esc, formatTime } from "./config.js";

let con = document.getElementById("content");
let allEvents = [];

async function get() {
    try {
        let res = await fetch(`${API_URL}/Events`);
        if (!res.ok) {
            throw new Error("Failed to fetch events");
        }
        allEvents = await res.json();
        displayEvents(allEvents);
    } catch (err) {
        console.log(err);
        con.innerHTML = `<p class="text-center">Unable to load events. Is the server running?</p>`;
    }
}

function searchEvents(e) {
    e.preventDefault();
    let text = document.getElementById("searchBox").value.trim().toLowerCase();
    let filtered = allEvents.filter(event =>
        [event.title, event.location, event.category]
            .some(v => String(v ?? "").toLowerCase().includes(text))
    );
    displayEvents(filtered);
}

function showAll() {
    displayEvents(allEvents);
}

function fetchFilteredData(category) {
    displayEvents(allEvents.filter(event => event.category === category));
    scrollToEvents();
}

function openEvent(id) {
    window.location.href = `event.html?id=${id}`;
}

function scrollToEvents() {
    document.querySelector(".section-title").scrollIntoView({ behavior: "smooth" });
}

function displayEvents(events) {
    con.innerHTML = "";

    if (events.length === 0) {
        con.innerHTML = `<p class="text-center">No events found.</p>`;
        return;
    }

    events.forEach((element) => {
        let card = document.createElement("div");
        card.innerHTML = `
            <img src="${esc(element.image)}" alt="${esc(element.title)}">
            <div class="card-body">
                <h3>${esc(element.title)}</h3>
                <p>📍 ${esc(element.location)}</p>
                <p>📅 ${esc(element.date)} • ${esc(formatTime(element.time))}</p>
                <p>🎵 ${esc(element.category)}</p>
                <p>📝 ${esc(element.description)}</p>
                <div class="price">₹${esc(element.price)}</div>
                <button class="book-btn" onclick="openEvent(${Number(element.id)})">Book Now</button>
            </div>`;
        con.append(card);
    });
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

let user = JSON.parse(localStorage.getItem("user"));
if (user) {
    document.getElementById("authButtons").innerHTML = `
        <span class="me-3 fw-bold">👋 Hi, ${esc(user.name)}</span>
        <button class="btn btn-danger" onclick="logout()">Logout</button>
    `;
}

// Inline onclick handlers need these on window because this file is an ES module
Object.assign(window, { searchEvents, showAll, fetchFilteredData, openEvent, scrollToEvents, logout });

get();
