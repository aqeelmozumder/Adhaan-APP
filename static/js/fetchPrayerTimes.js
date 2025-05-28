// fetchPrayerTimes.js
import { displayPrayerTimes } from './displayPrayerTimes.js';

export async function getPrayerTimes() {
    const outputElem = document.getElementById("output");
    const loadingSpinner = document.getElementById("loading-spinner");
    const loadingMessage = document.getElementById("loading-message");
    const fetchButton = document.getElementById("fetch-button");

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    loadingMessage.innerText = `Fetching today's (${formattedDate}) prayer times...`;

    loadingSpinner.classList.remove("hidden");
    outputElem.innerHTML = "";
    fetchButton.disabled = true;
    fetchButton.classList.add("opacity-50", "cursor-not-allowed");

    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const response = await fetch(`/prayer-times/?latitude=${lat}&longitude=${lon}`);
        const data = await response.json();

        window.cachedPrayerData = data;
        displayPrayerTimes(data);
    } catch (error) {
        console.error("❌ Error fetching prayer times:", error);
        outputElem.innerHTML = `<p class="text-red-400">Error fetching prayer times.</p>`;
    } finally {
        loadingSpinner.classList.add("hidden");
        fetchButton.disabled = false;
        fetchButton.classList.remove("opacity-50", "cursor-not-allowed");
    }
}

// Expose globally for onclick="getPrayerTimes()"
window.getPrayerTimes = getPrayerTimes;
