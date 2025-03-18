import requests

def get_calculation_method(latitude, longitude):
    """Fetches the appropriate prayer calculation method based on location dynamically."""
    method_url = "https://api.aladhan.com/v1/methods"
    response = requests.get(method_url)

    if response.status_code == 200:
        methods_data = response.json()["data"]

        # Default fallback to MWL (Muslim World League)
        default_method_id = 3
        default_method_name = methods_data.get("MWL", {}).get("name", "Muslim World League")

        print(f"🔎 Checking calculation method for coordinates: {latitude}, {longitude}")

        closest_method = None
        closest_distance = float("inf")  # Start with an infinite distance

        # Iterate through all methods and find the closest match
        for method_key, method_info in methods_data.items():
            method_id = method_info.get("id")  # Get ID safely
            method_name = method_info.get("name", "Unknown Method")  # Get name safely

            if "location" in method_info:
                method_lat = method_info["location"].get("latitude", 0)
                method_lon = method_info["location"].get("longitude", 0)

                # ✅ Calculate approximate distance (Manhattan Distance)
                distance = abs(method_lat - latitude) + abs(method_lon - longitude)

                print(f"🔍 Checking {method_name} at ({method_lat}, {method_lon}), Distance: {distance}")

                # Select the closest method
                if distance < closest_distance:
                    closest_distance = distance
                    closest_method = (method_id, method_name)

        # ✅ Return the best-matched method
        if closest_method:
            print(f"✅ Best Matched Method: {closest_method[1]}")
            return closest_method

        # ❌ If no method is close enough, use MWL as fallback
        print("❌ No specific match found. Using default MWL")
        return default_method_id, default_method_name

    print("❌ Error fetching methods. Using default MWL")
    return 3, "Muslim World League"  # Default fallback
