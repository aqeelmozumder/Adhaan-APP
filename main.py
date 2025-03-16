from fastapi import FastAPI, Request
import requests

app = FastAPI()


def get_public_ip():
    """Fetches the public IP of the user."""
    try:
        response = requests.get("https://httpbin.org/ip")
        if response.status_code == 200:
            return response.json().get("origin")
    except:
        return None
    return None


def get_location_by_ip(ip: str):
    """Fetches location details using IP address."""
    geo_url = f"http://ip-api.com/json/{ip}"
    response = requests.get(geo_url)

    if response.status_code == 200:
        data = response.json()
        if data["status"] == "success":
            return data["lat"], data["lon"], data["city"], data["country"]
    
    return None, None, None, None  # Default case

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
def get_prayer_times(request: Request):

    """
    Fetches prayer times automatically by detecting the user's location via IP.
    """

     # Get user's IP address and determine location
    client_ip = get_public_ip()
    if not client_ip:
        return {"error": "Unable to fetch public IP."}
    
    latitude, longitude, city, country = get_location_by_ip(client_ip)
    
    if not latitude or not longitude:
        return {"error": "Unable to detect location via IP. Try again later."}
    
        # Dynamically get the best prayer calculation method
    method = get_calculation_method(latitude, longitude)

    url = f"https://api.aladhan.com/v1/timings?latitude={latitude}&longitude={longitude}&method={method}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return {
            "location": f"{city}, {country}" if city and country else "Location detected by IP",
            "coordinates": {"latitude": latitude, "longitude": longitude},
            "calculation_method": method,
            "prayer_times": data["data"]["timings"]
        }
    else:
        return {"error": "Failed to fetch prayer times",
                "status_code": response.status_code,
                "message": response.text }

