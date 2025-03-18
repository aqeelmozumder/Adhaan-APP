// script.js - Main script that connects all modules

import { getPrayerTimes } from "./js/fetchPrayerTimes.js";

// ✅ Attach the function to the `window` object so it works in `onclick`
window.getPrayerTimes = getPrayerTimes;
