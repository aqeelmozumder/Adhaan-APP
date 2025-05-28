// displayPrayerTimes.js
import { getPrayerEmoji, getClosestPrayer, isExtraPrayer } from './utils.js';

let extrasVisible = true;

export function displayPrayerTimes(data) {
    const outputElem = document.getElementById("output");
    const nextPrayerBox = document.getElementById("next-prayer-box");
    const nextPrayerLabel = document.getElementById("next-prayer-label");
    const toggleBtn = document.getElementById("toggle-extras");
    const calcMethodElem = document.getElementById("calculation-method");

    if (data.error) {
        outputElem.innerHTML = `<p class="text-red-400">${data.error}</p>`;
        return;
    }

    const { calculation_method, prayer_times, gregorian_date, hijri_date } = data;

    // Update dates
    document.getElementById("gregorian-date").innerText = gregorian_date || "";
    document.getElementById("hijri-date").innerText = hijri_date || "";

    // Update calculation method footer
    calcMethodElem.innerHTML = `Time Calculation Method: <strong class="text-white">${calculation_method}</strong>`;

    // Determine closest prayer
    const closest = getClosestPrayer(prayer_times);

    // Update next prayer box
    if (closest) {
        nextPrayerBox.classList.remove("hidden");
        nextPrayerLabel.innerText = `${closest.name} at ${closest.time}`;
    } else {
        nextPrayerBox.classList.add("hidden");
    }

    // Update toggle button text
    toggleBtn.innerText = extrasVisible ? "Hide Extra Prayers ←" : "Show Extra Prayers →";

    // Generate prayer table
    let html = `
        <table class="w-full mt-4 border-collapse border border-gray-500 shadow-md">
            <thead>
                <tr class="bg-emerald-700 text-white">
                    <th class="p-3 border text-left">Prayer</th>
                    <th class="p-3 border text-left">Time</th>
                </tr>
            </thead>
            <tbody class="bg-gray-800 text-gray-200">
    `;

    for (let [prayer, time] of Object.entries(prayer_times)) {
        if (!extrasVisible && isExtraPrayer(prayer)) continue;

        html += `
            <tr class="hover:bg-sky-600 transition">
                <td class="p-3 border font-semibold">${getPrayerEmoji(prayer)} ${prayer}</td>
                <td class="p-3 border">${time}</td>
            </tr>`;
    }

    html += `</tbody></table>`;
    outputElem.innerHTML = html;
}

// Toggle extra prayers and re-render
window.toggleExtras = function () {
    extrasVisible = !extrasVisible;
    if (window.cachedPrayerData) {
        displayPrayerTimes(window.cachedPrayerData);
    }
};
