import requests

def get_public_ip():
    """Fetches the public IP of the user."""
    try:
        response = requests.get("https://httpbin.org/ip")
        if response.status_code == 200:
            return response.json().get("origin")
    except:
        return None
    return None

def get_location_by_ip():
    """Fetches location details using ipinfo.io (no API key required)."""
    try:
        ip = get_public_ip()
        if not ip:
            return None, None, None, None

        geo_url = f"https://ipinfo.io/{ip}/json"
        response = requests.get(geo_url)

        if response.status_code == 200:
            data = response.json()
            lat, lon = map(float, data["loc"].split(","))
            city = data.get("city", "Unknown City")
            country = data.get("country", "Unknown Country")
            return lat, lon, city, country
    except Exception as e:
        print("Error fetching location:", e)

    return None, None, "Unknown City", "Unknown Country"  # Default case

def get_city_country_from_coordinates(latitude, longitude):
    """Uses Reverse Geocoding to get city & country from latitude & longitude."""
    try:
        geo_url = f"https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={latitude}&lon={longitude}"
        
        headers = {
            "User-Agent": "AdhaanApp/1.0 (contact@example.com)"  # Replace with your email
        }

        response = requests.get(geo_url, headers=headers)

        if response.status_code == 200:
            data = response.json()
            address = data.get("address", {})

            # Try multiple fields to get the best match
            city = address.get("city") or address.get("town") or address.get("village") or address.get("municipality") or "Unknown City"
            country = address.get("country", "Unknown Country")

            return city, country
    except Exception as e:
        print("Error fetching city and country from coordinates:", e)

    return "Unknown City", "Unknown Country"  # Default case
