from fastapi import FastAPI
import requests

app = FastAPI()

# Victoria, BC Coordinates
LATITUDE = 48.4284
LONGITUDE = -123.3656
METHOD = 2  # Calculation method (Islamic Society of North America)

@app.get("/prayer-times")
def get_prayer_times():
    url = f"https://api.aladhan.com/v1/timingsByCity?city=Victoria&country=Canada&method={METHOD}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return data["data"]["timings"]  # Return only prayer timings
    else:
        return {"error": "Failed to fetch prayer times"}

