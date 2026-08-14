import { useEffect, useState } from "react";
// ... existing imports

export default function ToolsPage() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoc, setUserLoc] = useState(null); // { lat, lng }
  const [sortByDistance, setSortByDistance] = useState(false);

  // Get user location
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setUserLoc({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => console.log("Location denied")
    );
  }, []);

  useEffect(() => {
    fetch("/api/tools")
      .then(res => res.json())
      .then(data => {
        // If location available and sorting requested, compute distances
        if (userLoc && sortByDistance) {
          data.sort((a, b) => {
            const distA = haversine(userLoc.lat, userLoc.lng, a.latitude, a.longitude);
            const distB = haversine(userLoc.lat, userLoc.lng, b.latitude, b.longitude);
            return distA - distB;
          });
        }
        setTools(data);
        setLoading(false);
      });
  }, [userLoc, sortByDistance]);

  // Haversine distance function in km
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2)**2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  // Add to UI:
  // <button onClick={() => setSortByDistance(!sortByDistance)}>
  //   {sortByDistance ? "Showing nearest first" : "Sort by distance"}
  // </button>

  // Display distance on ToolCard? Optional: modify ToolCard to accept userLoc and show distance.
}
