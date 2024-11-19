import * as Carousel from "./Carousel.js";
// import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_w6dfjsxV3oMlVBcL3scQZ22IjWkxbDl5CkV2yCb6KOa9eQeKwId6jguGWODQQahI";

// Step 1: Initial Load
async function initialLoad() {
  console.log("start");
  axios
    .get("https://api.thecatapi.com/v1/breeds", {
      // set default header
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    })
    .then((response) => {
      console.log("loaded");
      console.log(response);
      response.data.forEach((breed) => {
        // create an option element and set the info
        const optionEl = document.createElement("option");
        optionEl.value = breed.id;
        optionEl.innerText = breed.name;

        breedSelect.appendChild(optionEl);
      });

      displayBreedData(fetchBreedById(response.data[0].id));
    })
    .catch((error) => {
      console.log(error);
    });
}
initialLoad();

// Step 2: Event handler
breedSelect.addEventListener("input", (e) =>
  displayBreedData(fetchBreedById(e.target.value))
);

async function fetchImageDataById(id) {
  const img = await fetch(id);
  const imgJson = await img.json();
  return imgJson;
}

async function fetchBreedById(id) {
  const breed = await fetch(
    `https://api.thecatapi.com/v1/images/search?limit=100&breed_ids=${id}&api_key=${API_KEY}`
  );
  const breedJson = await breed.json();
  return breedJson;
}

function displayBreedData(breedPromise) {
  breedPromise
    .then((breedData) => {
      // success
      console.log(breedData);
      // clear and restart carousel
      Carousel.clear();
      Carousel.start();
      // for each object in array, call Carousel file's createCarouselItem function to create a new item.
      breedData.forEach((obj) => {
        const newEl = Carousel.createCarouselItem(obj.url, "", obj.id);
        // append to carousel
        Carousel.appendCarousel(newEl);
      });

      // get breed image id and info
      const imgId = breedData[0].url.slice(
        breedData[0].url.lastIndexOf("/") + 1,
        breedData[0].url.lastIndexOf(".")
      );
      const imgFetchUrl = `https://api.thecatapi.com/v1/images/${imgId}`;
      displayInformationSection(fetchImageDataById(imgFetchUrl));
    })
    .catch((error) => {
      infoDump.querySelector("table").innerHTML =
        "<tr><th>No Data Found.</th></tr>";
    });
}

function displayInformationSection(imgPromise) {
  imgPromise
    .then((imgData) => {
      infoDump.querySelector("table").innerHTML = "";
      // success
      Object.entries(imgData.breeds[0]).forEach(([key, value]) => {
        if (key == "name" || key == "origin" || key == "description") {
          const tr = document.createElement("tr");
          tr.innerHTML = `<th>${key}</th>
          <td>${value}</td>`;

          infoDump.querySelector("table").append(tr);
        }
      });
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

export async function favourite(imgId) {
  // your code here
}
