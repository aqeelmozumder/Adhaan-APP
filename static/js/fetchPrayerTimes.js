import { displayPrayerTimes } from "./displayPrayerTimes.js";

// ✅ Instead of exporting a primitive value, use an object
export const cache = { data: null };

export async function getPrayerTimes() {
    const outputElem = document.getElementById("output");
    const loadingSpinner = document.getElementById("loading-spinner");
    const loadingMessage = document.getElementById("loading-message");
    const fetchButton = document.getElementById("fetch-button");

    let today = new Date();
    let formattedDate = today.toLocaleDateString("en-US", { 
        weekday: "long", year: "numeric", month: "long", day: "numeric" 
    });

    loadingMessage.innerText = `Fetching today's (${formattedDate}) prayer times...`;
    fetchButton.innerText = "Reload Today's Prayer Times";

    // ✅ Show loading spinner & disable button
    loadingSpinner.classList.remove("hidden");
    outputElem.innerHTML = "";
    fetchButton.disabled = true;
    fetchButton.classList.add("opacity-50", "cursor-not-allowed");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            try {
                let response = await fetch(`/prayer-times/?latitude=${lat}&longitude=${lon}`);
                let data = await response.json();
                
                if (!response.ok || data.error) {
                    throw new Error("Invalid response from API");
                }

                cache.data = data; // ✅ Updates the exported object
                displayPrayerTimes(data);
            } catch (error) {
                outputElem.innerHTML = `<p class="text-red-400">Error fetching prayer times.</p>`;
            } finally {
                loadingSpinner.classList.add("hidden");
                fetchButton.disabled = false;
                fetchButton.classList.remove("opacity-50", "cursor-not-allowed");
            }
        }, function(error) {
            fetchPrayerTimesByIP();
        });
    } else {
        fetchPrayerTimesByIP();
    }
}

export async function fetchPrayerTimesByIP() {
    const outputElem = document.getElementById("output");
    const loadingSpinner = document.getElementById("loading-spinner");
    const fetchButton = document.getElementById("fetch-button");

    try {
        let response = await fetch(`/prayer-times/`);
        let data = await response.json();

        cache.data = data; // ✅ Updates the exported object
        displayPrayerTimes(data);
    } catch (error) {
        outputElem.innerHTML = `<p class="text-red-400">Error fetching prayer times.</p>`;
    } finally {
        loadingSpinner.classList.add("hidden");
        fetchButton.disabled = false;
        fetchButton.classList.remove("opacity-50", "cursor-not-allowed");
    }
}
