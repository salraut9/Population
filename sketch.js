const options = {
  lat: 32,   // initial map co-ordinates
  lng: 100,
  zoom: 4,
  style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
}

// Create an instance of Leaflet
const mappa = new Mappa('Leaflet');
let myMap;
let canvas;

function preload() {
  data = loadTable('population_data.csv', 'csv', 'header');
}
function setup() {
    canvas = createCanvas(windowWidth, windowHeight).parent('canvasContainer'); // map on the <div>

  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);    // div -> map -> canvas
  myMap.onChange(mapPopulation);

}

function draw() {
  textSize(16);
  fill(0);
  textAlign(RIGHT, BOTTOM);
  text("Click to get data", width - 10, height -10);
}

// function to map population data on the mappa map
function mapPopulation(){
   clear();
   for (let r = 0; r < data.getRowCount(); r++) {
    var currentLat = data.getString(r, 'latitude');
    var currentLong = data.getString(r, 'longitude');
    var pop = data.getString(r, 'population');

    // convert latitude and longitude to x and y position
    var pos = myMap.latLngToPixel(currentLat, currentLong);

    // map population to ellipse size
    var popSize = map(pop, 0, 37000000, 1, 50);

    fill(255, 0, 0, 100);
    ellipse(pos.x, pos.y, popSize, popSize);
  }
}

// function to show details of the city when clicked on it
function mousePressed() {
  for (let r = 0; r < data.getRowCount(); r++) {
    var currentLat = data.getString(r, 'latitude');
    var currentLong = data.getString(r, 'longitude');
    var pos = myMap.latLngToPixel(currentLat, currentLong);

    var d = dist(mouseX, mouseY, pos.x, pos.y);
    if (d <= 5) {
      var city = data.getString(r, 'city');
      var pop = data.getString(r, 'population');
      var country = data.getString(r, 'country');

      // display the information
      fill(0);
      text(`City: ${city}\nCountry: ${country}\nPopulation: ${pop}`, mouseX, mouseY);
    }
  }
}
