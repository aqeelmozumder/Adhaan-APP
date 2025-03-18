import requests
from services.method_selection import get_calculation_method

def get_prayer_times(latitude, longitude, city, country):
    """Fetches prayer times based on location and calculation method."""
    method_id, method_name = get_calculation_method(latitude, longitude)

    url = f"https://api.aladhan.com/v1/timings?latitude={latitude}&longitude={longitude}&method={method_id}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return {
            "location": f"{city}, {country}",
            "coordinates": {"latitude": latitude, "longitude": longitude},
            "calculation_method_id": method_id,
            "calculation_method": method_name,
            "prayer_times": data["data"]["timings"]
        }
    else:
        return {"error": "Failed to fetch prayer times"}
