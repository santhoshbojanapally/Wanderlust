let mapDiv = document.getElementById("map");
if (mapDiv) {
  let lng = mapDiv.getAttribute("lng");
  let lat = mapDiv.getAttribute("lat");
  let title = mapDiv.getAttribute("locationName");
  console.log("Longitude: ", lng);
  console.log("Lattitude: ", lat);

  var myIcon = L.icon({
    iconUrl: "../assets/compass.png",
    iconSize: [15, 20],
    iconAnchor: [7, 10],
    popupAnchor: [0, -12],
  });

  var map = L.map("map").setView([lat, lng], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  L.marker([`${lat}`, `${lng}`], { icon: myIcon })
    .addTo(map)
    .bindPopup(`${title}`)
    .openPopup();
}
