from fastapi import FastAPI, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from services.geolocation import get_location_by_ip, get_city_country_from_coordinates
from services.prayer_times import get_prayer_times

app = FastAPI()

# Serve static files (JS, CSS)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def serve_home():
    """Serves the frontend HTML page."""
    return FileResponse("templates/index.html")



@app.get("/prayer-times")
def fetch_prayer_times( latitude: float = Query(None, description="Latitude"), longitude: float = Query(None, description="Longitude")):

    """
    Fetches prayer times dynamically.
    - If latitude & longitude are provided (via GPS), use them.
    - If not, fall back to IP-based location (less accurate).
    """

    if latitude and longitude:
        print("Using GPS location")
        city, country = get_city_country_from_coordinates(latitude, longitude)
    else:
        print("Using IP-based location")
        latitude, longitude, city, country = get_location_by_ip()
    
    if not latitude or not longitude:
        return {"error": "Unable to detect location via IP. Try again later."}
    
    return get_prayer_times(latitude, longitude, city, country)

