// utils.js

function getPrayerEmoji(prayerName) {
    const emojis = {
        Fajr: "🌅",
        Sunrise: "🌄",
        Dhuhr: "☀️",
        Asr: "🌇",
        Maghrib: "🌆",
        Isha: "🌙",
        Imsak: "🕓",
        Midnight: "🌃",
        Firstthird: "🌌",
        Lastthird: "🌠"
    };
    return emojis[prayerName] || "🕒";
}

function getClosestPrayer(prayerTimes) {
    const now = new Date();
    let closest = null;
    let minDiff = Infinity;

    for (let [name, time] of Object.entries(prayerTimes)) {
        if (["Sunrise", "Imsak", "Midnight", "Firstthird", "Lastthird"].includes(name)) continue;

        let [hour, minute] = time.split(":").map(Number);
        let prayerTime = new Date();
        prayerTime.setHours(hour, minute, 0);

        let diff = Math.abs(prayerTime - now);
        if (diff < minDiff) {
            minDiff = diff;
            closest = { name, time };
        }
    }

    return closest;
}

function formatHijriDate(hijriObj) {
    return `${hijriObj.day} ${hijriObj.month.en} ${hijriObj.year} AH`;
}

function formatGregorianDate(dateObj) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Date(dateObj.gregorian).toLocaleDateString("en-US", options);
}

function isExtraPrayer(prayerName) {
    return ["Imsak", "Midnight", "Firstthird", "Lastthird"].includes(prayerName);
}

export {
    getPrayerEmoji,
    getClosestPrayer,
    formatHijriDate,
    formatGregorianDate,
    isExtraPrayer
};
