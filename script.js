/* ===========================================================
   TRAVEL CONNECT
   SCRIPT.JS
   PART 1
=========================================================== */

let destinations = [];
let filteredDestinations = [];

const placesContainer = document.getElementById("places");

const searchInput = document.getElementById("search");

const budgetFilter = document.getElementById("budgetFilter");

const seasonFilter = document.getElementById("seasonFilter");

const durationFilter = document.getElementById("durationFilter");

const loader = document.getElementById("loader");

let currentCategory = "All";

/* --------------------------
   Initialize
-------------------------- */

window.addEventListener("DOMContentLoaded", () => {

    loadDestinations();

});

/* --------------------------
   Load JSON
-------------------------- */

async function loadDestinations(){

    try{

        const response = await fetch("destinations.json");

        destinations = await response.json();

        filteredDestinations = [...destinations];

        renderDestinations(filteredDestinations);

        setupCategoryButtons();

        setupFilters();

        hideLoader();

    }

    catch(error){

        console.error(error);

        placesContainer.innerHTML =

        "<h2>Unable to load destinations.</h2>";

    }

}

/* --------------------------
   Loader
-------------------------- */

function hideLoader(){

    loader.style.opacity="0";

    setTimeout(()=>{

        loader.style.display="none";

    },600);

}

/* --------------------------
   Search
-------------------------- */

searchInput.addEventListener("keyup",()=>{

    filterDestinations();

});

/* --------------------------
   Filters
-------------------------- */

function setupFilters(){

    budgetFilter.addEventListener("change",filterDestinations);

    seasonFilter.addEventListener("change",filterDestinations);

    durationFilter.addEventListener("change",filterDestinations);

}

/* --------------------------
   Categories
-------------------------- */

function setupCategoryButtons(){

    const buttons=document.querySelectorAll(".category");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            buttons.forEach(btn=>btn.classList.remove("active"));

            button.classList.add("active");

            currentCategory=button.dataset.category;

            filterDestinations();

        });

    });

}

/* --------------------------
   Main Filter
-------------------------- */

function filterDestinations(){

    const search=

    searchInput.value.toLowerCase();

    const budget=

    budgetFilter.value;

    const season=

    seasonFilter.value;

    const duration=

    durationFilter.value;

    filteredDestinations=

    destinations.filter(place=>{

        const matchesSearch=

        place.name.toLowerCase().includes(search)

        ||

        place.state.toLowerCase().includes(search)

        ||

        place.tags.join(" ").toLowerCase().includes(search);

        const matchesCategory=

        currentCategory==="All"

        ||

        place.category===currentCategory;

        const matchesBudget=

        budget===""

        ||

        place.budget===budget;

        const matchesSeason=

        season===""

        ||

        place.bestSeason===season;

        const matchesDuration=

        duration===""

        ||

        place.duration===duration;

        return(

            matchesSearch

            &&

            matchesCategory

            &&

            matchesBudget

            &&

            matchesSeason

            &&

            matchesDuration

        );

    });

    renderDestinations(filteredDestinations);

}

/* --------------------------
   Render Cards
-------------------------- */

function renderDestinations(data){

    if(data.length===0){

        placesContainer.innerHTML=

        `
        <div class="empty-state">

            <h2>No destinations found 😔</h2>

            <p>

            Try changing the search or filters.

            </p>

        </div>
        `;

        return;

    }

    placesContainer.innerHTML=data.map(place=>`

<div class="destination-card fade-up">

<div class="card-image">

<img src="${place.image}" alt="${place.name}">

<div class="card-rating">

⭐ ${place.rating}

</div>

<div class="card-duration">

${place.duration}

</div>

</div>

<div class="card-body">

<h2>${place.name}</h2>

<p class="location">

📍 ${place.state}

</p>

<p class="description">

${place.description}

</p>

<div class="tags">

${place.tags.map(tag=>`

<span class="tag">

${tag}

</span>

`).join("")}

</div>

<div class="card-footer">

<div class="price">

${place.budget}

</div>

<div class="card-buttons">

<button

class="like-btn"

data-id="${place.id}">

❤️

</button>

<button

class="explore-btn"

data-id="${place.id}">

Explore →

</button>

</div>

</div>

</div>

</div>

`).join("");

}

/* ===========================================================
   SCRIPT.JS
   PART 2
=========================================================== */

const modal = document.getElementById("destinationModal");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.querySelector(".close");

let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

/* -----------------------------
   Event Delegation
----------------------------- */

placesContainer.addEventListener("click", (e) => {

    const id = Number(e.target.dataset.id);

    if (e.target.classList.contains("explore-btn")) {

        const destination =
            destinations.find(place => place.id === id);

        openModal(destination);

    }

    if (e.target.classList.contains("like-btn")) {

        toggleWishlist(id);

    }

});

/* -----------------------------
   Modal
----------------------------- */

function openModal(place) {

    if (!place) return;

    modalBody.innerHTML = `

<img src="${place.image}" alt="${place.name}">

<div class="modal-details">

<h2>${place.name}</h2>

<p>

📍 <strong>${place.state}</strong>

</p>

<p>

⭐ ${place.rating}

</p>

<p>

💰 Budget: ${place.budget}

</p>

<p>

🗓 Best Season:
<strong>${place.bestSeason}</strong>

</p>

<p>

⏳ Duration:
<strong>${place.duration}</strong>

</p>

<p>

${place.description}

</p>

<h3>Things To Do</h3>

<ul>

${place.activities.map(item =>

`<li>${item}</li>`

).join("")}

</ul>

<br>

<a

href="${place.maps}"

target="_blank"

class="explore-btn"

>

Open in Google Maps

</a>

</div>

`;

    modal.classList.add("active");

}

/* -----------------------------
   Close Modal
----------------------------- */

closeModalBtn.addEventListener("click", () => {

    modal.classList.remove("active");

});

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.classList.remove("active");

    }

});

/* -----------------------------
   Wishlist
----------------------------- */

function toggleWishlist(id) {

    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(item => item !== id);

    } else {

        wishlist.push(id);

    }

    localStorage.setItem(

        "wishlist",

        JSON.stringify(wishlist)

    );

    updateWishlistIcons();

}

/* -----------------------------
   Update Hearts
----------------------------- */

function updateWishlistIcons() {

    document

    .querySelectorAll(".like-btn")

    .forEach(button => {

        const id =
            Number(button.dataset.id);

        if (wishlist.includes(id)) {

            button.innerHTML = "❤️";

            button.style.background =
                "#FECACA";

        } else {

            button.innerHTML = "🤍";

            button.style.background =
                "#F3F4F6";

        }

    });

}

/* -----------------------------
   Dark Mode
----------------------------- */

const darkButton =
    document.getElementById("darkMode");

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

}

darkButton.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (

        document.body.classList.contains("dark")

    ) {

        localStorage.setItem(

            "theme",

            "dark"

        );

    } else {

        localStorage.setItem(

            "theme",

            "light"

        );

    }

});

/* -----------------------------
   Scroll Animation
----------------------------- */

const observer =
new IntersectionObserver(

entries => {

entries.forEach(entry => {

if (entry.isIntersecting) {

entry.target.classList.add("show");

}

});

},

{

threshold:0.15

}

);

function observeCards(){

document

.querySelectorAll(".fade-up")

.forEach(card=>{

observer.observe(card);

});

}

const oldRender =
renderDestinations;

renderDestinations = function(data){

oldRender(data);

observeCards();

updateWishlistIcons();

};

/* ===========================================================
END PART 2
=========================================================== */