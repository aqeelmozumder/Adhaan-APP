from fastapi import FastAPI, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import requests

app = FastAPI()

# Serve static files (JS, CSS)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def serve_home():
    """Serves the frontend HTML page."""
    return FileResponse("templates/index.html")

def get_location_by_ip():
    """Fetches location details using ipinfo.io"""
    ip = requests.get("https://httpbin.org/ip").json()["origin"]
    geo_url = f"https://ipinfo.io/{ip}/json"
    response = requests.get(geo_url)

    if response.status_code == 200:
        try:
            data = response.json()
            lat, lon = map(float, data["loc"].split(","))
            city = data.get("city", "Unknown City")
            country = data.get("country", "Unknown City")
            return lat, lon, city, country

        except Exception as e:
            print("Error parsing IP geolocation response:", e)
    else:
        print("IP Geolocation API Error:", response.status_code, response.text)

    return None, None, None, None  # Default case

def get_city_country_from_coordinates(latitude, longitude):
    """Uses Reverse Geocoding to get city & country from latitude & longitude."""
    try:
        geo_url = f"https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={latitude}&lon={longitude}"
        
        headers = {
            "User-Agent": "AdhaanApp/1.0 (contact@example.com)" 
        }

        response = requests.get(geo_url, headers=headers)

        print("Reverse Geocoding Response:", response.status_code)  # Debugging

        if response.status_code == 200:
            data = response.json()
            address = data.get("address", {})

            # Try multiple fields to get the best match
            city = address.get("city") or address.get("town") or address.get("village") or address.get("municipality") or "Unknown City"
            country = address.get("country", "Unknown Country")

            return city, country
        else:
            print("Reverse Geocoding Failed:", response.text)
    except Exception as e:
        print("Error fetching city and country from coordinates:", e)

    return "Unknown City", "Unknown Country"  # Default case


def get_calculation_method(latitude, longitude):
    """Fetches the appropriate calculation method based on location."""
    method_url = f"https://api.aladhan.com/v1/methods"
    response = requests.get(method_url)

    if response.status_code == 200:
        methods_data = response.json()["data"]
        
        # Example: Assign a default method, then check the region-specific method
        default_method = 3  # Muslim World League (MWL)
        
        # Match the best method based on region
        for method_id, details in methods_data.items():
            if "latitude" in details and "longitude" in details:
                if abs(details["latitude"] - latitude) < 10 and abs(details["longitude"] - longitude) < 10:
                    return method_id  # Return dynamically detected method
        
        return default_method  # Fallback method
    
    return 3  # Default fallback



@app.get("/prayer-times")
def get_prayer_times( latitude: float = Query(None, description="Latitude"),
    longitude: float = Query(None, description="Longitude")):

    """
    Fetches prayer times dynamically.
    - If latitude & longitude are provided (via GPS), use them.
    - If not, fall back to IP-based location (less accurate).
    """

    city, country = "Unknown City", "Unknown Country" 

    if latitude and longitude:
        print("Using GPS location")
        city, country = get_city_country_from_coordinates(latitude, longitude)
    else:
        print("Using IP-based location")
        latitude, longitude, city, country = get_location_by_ip()
    
    if not latitude or not longitude:
        return {"error": "Unable to detect location via IP. Try again later."}
    
        # Dynamically get the best prayer calculation method
    method = get_calculation_method(latitude, longitude)

    url = f"https://api.aladhan.com/v1/timings?latitude={latitude}&longitude={longitude}&method={method}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return {
            "location": f"{city}, {country}",
            "coordinates": {"latitude": latitude, "longitude": longitude},
            "calculation_method": method,
            "prayer_times": data["data"]["timings"]
        }
    else:
        return {"error": "Failed to fetch prayer times",
                "status_code": resNoneponse.status_code,
                "message": response.text }

