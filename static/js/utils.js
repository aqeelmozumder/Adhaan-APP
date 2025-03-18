// utils.js - General helper functions used across the app

export function getFormattedDate() {
    let today = new Date();
    return today.toLocaleDateString("en-US", { 
        weekday: "long", year: "numeric", month: "long", day: "numeric" 
    });
}

export function getPrayerEmoji(prayer) {
    const prayerEmojis = {
        "Fajr": "🌅",
        "Sunrise": "🌄",
        "Dhuhr": "☀️",
        "Asr": "🌇",
        "Maghrib": "🌆",
        "Isha": "🌙"
    };
    return prayerEmojis[prayer] || "";
}

export function getClosestPrayer(prayerTimes, exclude = []) {
    let now = new Date();
    let closestPrayer = null;
    let closestPrayerTime = null;

    Object.entries(prayerTimes).forEach(([prayer, time]) => {
        if (exclude.includes(prayer)) return;

        let [hour, minute] = time.split(":").map(Number);
        let prayerTime = new Date();
        prayerTime.setHours(hour);
        prayerTime.setMinutes(minute);
        prayerTime.setSeconds(0);

        if (closestPrayerTime === null || Math.abs(prayerTime - now) < Math.abs(closestPrayerTime - now)) {
            closestPrayer = prayer;
            closestPrayerTime = prayerTime;
        }
    });

    return closestPrayer;
}
