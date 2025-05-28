import { displayPrayerTimes } from "./displayPrayerTimes.js";

document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("change", (event) => {
        if (event.target.id === "toggle-extras") {
            if (window.cachedPrayerData) {
                displayPrayerTimes(window.cachedPrayerData);
            }
        }
    });
});
