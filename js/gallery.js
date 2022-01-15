const gallery = document.querySelector(".gallery");
const search = document.querySelector(".header__icon--search");
const text = document.querySelector(".header__input");
const noResults = document.querySelector(".header__error");

let IDS;

async function fetchImages(page) {
  try {
    IDS = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=130c7a7ecd86dbb286ae26c3cdcca88c&language=en-US`
    );
    const res = await axios.get(
      `https://api.themoviedb.org/3/trending/all/day?api_key=130c7a7ecd86dbb286ae26c3cdcca88c&page=${page}`
    );
    building(res.data.results);
    return res.data;
  } catch (error) {
    return console.log("fail");
  }
}

fetchImages(1);

async function fetchMovies(name) {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=130c7a7ecd86dbb286ae26c3cdcca88c&query=${name}`
    );
    if (res.data.results.length === 0) {
      return (noResults.style.display = "flex");
    }
    gallery.innerHTML = "";
    building(res.data.results);
    return res.data;
  } catch (error) {
    return (noResults.style.display = "flex");
  }
}

function building(resp) {
  const markup = resp
    .map((variable) => {
      let genreName = "";
      let movieName = "";
      let movieDate = "";

      IDS.data.genres.forEach((element) => {
        let currentID = Object.values(element)[0];
        if (variable.genre_ids.includes(currentID)) {
          genreName += Object.values(element)[1] + ", ";
        }
      });
      genreName = genreName.slice(0, genreName.length - 2);
      if ("title" in variable) {
        movieName = variable.title;
        movieDate = variable.release_date.slice(0, 4);
      } else if ("name" in variable) {
        movieName = variable.name;
        movieDate = variable.first_air_date.slice(0, 4);
      }
      return `<div class="movie-card" data-id="${variable.id}">
  <div class="movie-picture">
    <img class="movie-img" src="http://image.tmdb.org/t/p/w500/${variable.poster_path}" alt="${movieName} poster">
  </div>
  <div class="movie-description">
    <div class="movie-title">
      ${movieName}
    </div>
    <div class="movie-genre">
      ${genreName} | ${movieDate}
    </div>
  </div>
</div> `;
    })
    .join("");
  gallery.innerHTML += markup;
}

search.addEventListener("click", function () {
  noResults.style.display = "none";
  fetchMovies(text.value);
});

text.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    noResults.style.display = "none";
    fetchMovies(text.value);
  }
});
