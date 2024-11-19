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
    `https://api.thecatapi.com/v1/images/search?breed_ids=${id}`
  );
  const breedJson = await breed.json();
  return breedJson;
}

function displayBreedData(breedPromise) {
  breedPromise
    .then((breedData) => {
      // success

      // clear and restart carousel
      Carousel.clear();
      Carousel.start();
      // for each object in array, call Carousel file's createCarouselItem function to create a new item.
      breedData.forEach((obj) => {
        const newEl = Carousel.createCarouselItem(obj.url, "", obj.id);
        const imgId = obj.url.slice(
          obj.url.lastIndexOf("/") + 1,
          obj.url.lastIndexOf(".")
        );
        const imgFetchUrl = `https://api.thecatapi.com/v1/images/${imgId}`;
        displayInformationSection(fetchImageDataById(imgFetchUrl));
        // append to carousel
        Carousel.appendCarousel(newEl);
      });
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function displayInformationSection(imgPromise) {
  imgPromise
    .then((imgData) => {
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
/*
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
