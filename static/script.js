async function getPrayerTimes() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            let response = await fetch(`http://127.0.0.1:8000/prayer-times/?latitude=${lat}&longitude=${lon}`);
            let data = await response.json();
            document.getElementById("output").innerText = JSON.stringify(data, null, 2);
        }, function(error) {
            document.getElementById("output").innerText = "Error getting location: " + error.message;
        });
    } else {
        document.getElementById("output").innerText = "Geolocation is not supported by this browser.";
    }
}
