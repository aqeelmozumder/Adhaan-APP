import { cache } from "./fetchPrayerTimes.js";
import { displayPrayerTimes } from "./displayPrayerTimes.js";

document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("change", (event) => {
        if (event.target.id === "toggle-extras") {
            if (cache.data) {
                displayPrayerTimes(cache.data);
            }
        }
    });
});
