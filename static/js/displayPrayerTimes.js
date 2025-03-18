import { getPrayerEmoji, getClosestPrayer } from "./utils.js";

export function displayPrayerTimes(data) {
    const outputElem = document.getElementById("output");

    if (data.error) {
        outputElem.innerHTML = `<p class="text-red-400">${data.error}</p>`;
        return;
    }

    let calculationMethod = data.calculation_method || "Unknown Method";
    let prayerTimes = data.prayer_times;

    delete prayerTimes["Sunset"];

    let toggleExtras = document.getElementById("toggle-extras");
    let showExtras = toggleExtras ? toggleExtras.checked : true;

    const extraPrayers = ["Imsak", "Midnight", "Firstthird", "Lastthird"];

    let closestPrayer = getClosestPrayer(prayerTimes, extraPrayers);

    let html = `
        <p class="text-md text-gray-200">Time Calculation Method: <strong>${calculationMethod}</strong></p>

        <div class="mt-2 mb-4 text-center">
            <label class="text-gray-200 cursor-pointer">
                <input type="checkbox" id="toggle-extras" class="mr-2">
                Show Extra Prayers (Imsak, Midnight, First Third, Last Third)
            </label>
        </div>

        <table class="w-full mt-4 border-collapse border border-gray-500 shadow-md">
            <thead>
                <tr class="bg-emerald-700 text-white">
                    <th class="p-3 border">Prayer</th>
                    <th class="p-3 border">Time</th>
                </tr>
            </thead>
            <tbody class="bg-gray-800 text-gray-200">
    `;

    for (let [prayer, time] of Object.entries(prayerTimes)) {
        let shouldHide = extraPrayers.includes(prayer) && !showExtras;
        if (shouldHide) continue;

        let highlightClass = (prayer === closestPrayer) ? "bg-orange-600 text-white font-bold animate-pulse" : "hover:bg-sky-600 transition";
        let emoji = getPrayerEmoji(prayer);

        html += `
            <tr class="${highlightClass}">
                <td class="p-3 border font-semibold">${emoji} ${prayer}</td>
                <td class="p-3 border">${time}</td>
            </tr>`;
    }
    
    html += `</tbody></table>`;
    outputElem.innerHTML = html;

    document.getElementById("toggle-extras").checked = showExtras;
}
