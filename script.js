const EPISODE_SELECT_EL = document.getElementById("episodeSelection");
const SEARCH_BOX = document.getElementById("searchBox");
const SEARCH_COUNT = document.getElementById("searchCount");
const EPISODES_CONTAINER = document.getElementById("episodes");
const SHOWS_CONTAINER = document.getElementById("shows");
const SEARCH_BOX_ALL_SHOW = document.getElementById("searchAllSHows");
const SEARCH_SHOW_COUNT = document.getElementById("searchShowCount");

let currentEpisodes;
let allShows;

const setup = () => {
  allShows = getAllShows();
  makePageForShows(allShows);

  //whenever we type a letter in a search box
  SEARCH_BOX.addEventListener("keyup", search);

  const episodeSelection = document.getElementById("episodeSelection");
  //whenever we change the dropdown list
  episodeSelection.addEventListener("change", showSelectedEpisode);

  const resetPage = document.getElementById("resetPage");
  resetPage.addEventListener("click", reset);

  SEARCH_BOX_ALL_SHOW.addEventListener("keyup", searchAllShows);
};

const reset = () => {
  SHOWS_CONTAINER.style.display = "block";
  EPISODES_CONTAINER.style.display = "none";
};

// const showSelectedShow = (event) => {
//   const showId = event.target.value;
//   SEARCH_BOX.value = "";
//   sendRequest(showId).then((data) => {
//     currentEpisodes = data;
//     fillUpEpisodeSelection(currentEpisodes);
//     makePageForEpisodes(currentEpisodes);
//   });
// };

//function will call when user change the dropdown list value
const showSelectedEpisode = (event) => {
  const episodeId = event.target.value;
  SEARCH_BOX.value = "";
  if (episodeId === "SHOW_ALL_EPISODES") {
    makePageForEpisodes(currentEpisodes);
    SEARCH_COUNT.innerText = `Displaying ${currentEpisodes.length} / ${currentEpisodes.length} episodes`;
  } else {
    const filterEpisode = currentEpisodes.filter(
      (episode) => episode.id == episodeId
    );

    makePageForEpisodes(filterEpisode);
    SEARCH_COUNT.innerText = `Displaying ${filterEpisode.length} / ${currentEpisodes.length} episodes`;
  }
};

//function will call when user start typing in a search box
const search = (event) => {
  const searchWord = event.target.value.toLowerCase();
  const filterEpisode = currentEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchWord) ||
      episode.summary.toLowerCase().includes(searchWord)
  );

  SEARCH_COUNT.innerText = `Displaying ${filterEpisode.length} / ${currentEpisodes.length} episodes`;

  //incase user selected a specific episode,here episode's dropdownlist with be reset as our search
  //is through all episodes of a show
  EPISODE_SELECT_EL.value = "SHOW_ALL_EPISODES";
  EPISODE_SELECT_EL.text = "show All";

  makePageForEpisodes(filterEpisode);
};

const searchAllShows = (event) => {
  const searchWord = event.target.value.toLowerCase();
  const filterShows = allShows.filter(
    (show) =>
      show.name.toLowerCase().includes(searchWord) ||
      show.summary.toLowerCase().includes(searchWord) ||
      show.genres.toLowerCase().includes(searchWord)
  );
  SEARCH_SHOW_COUNT.innerText = `Found ${filterShows.length} shows`;
  makePageForShows(filterShows);
};

const makePageForEpisodes = (episodeList) => {
  const container = document.getElementById("container");
  container.innerHTML = "";
  episodeList.forEach((episode) => {
    //function for formatting the episode title in a page
    const formatEpisodeTitle = () => {
      //we also can use padStart method here.
      return `${episode.name} - S${
        episode.season > 9 ? episode.season : "0" + episode.season
      }E${episode.number > 9 ? episode.number : "0" + episode.number}`;
    };

    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("episode");

    container.appendChild(episodeDiv);
    const episodeTitle = document.createElement("h2");
    episodeTitle.classList.add("episodeTitle");

    const episodeImg = document.createElement("img");

    episodeImg.classList.add("episodeImg");
    let episodeSummary = document.createElement("div");
    episodeSummary.classList.add("episodeSummary");
    episodeDiv.append(episodeTitle, episodeImg, episodeSummary);

    episodeTitle.innerText = formatEpisodeTitle();
    episodeSummary.innerHTML = episode.summary;
    if (episode.image !== null) {
      episodeImg.src = episode.image.medium;
    }
  });
};

//Get episodes data from API
const sendRequest = (showId) => {
  let url = `https://api.tvmaze.com/shows/${showId}/episodes`;
  return fetch(url)
    .then((response) => {
      //for some data from API we receive code status 404 and dont have appropriate data
      //so I used this if else for the response to manage the error
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("problem to get data from API");
      }
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      const container = document.getElementById("container");
      container.innerHTML = "There is no information for this show";
      console.log(err);
    });
};

const makePageForShows = (shows) => {
  EPISODES_CONTAINER.style.display = "none";

  //make the list of the shows in alphabetical order case-insensitive.
  shows.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
  let showsContainer = document.getElementById("showsContainer");
  showsContainer.innerHTML = "";

  //showDivEl.innerHTML = "";
  // const showSelectEl = document.getElementById("showSelection");
  // shows.forEach((show) => {
  //   const showOptionEl = document.createElement("option");
  //   showOptionEl.value = show.id;
  //   showOptionEl.text = show.name;
  //   showSelectEl.appendChild(showOptionEl);
  // });
  // //get the the first show in the show dropdownlist to fill up the episode dropdownlist of that show.
  // let showId = showSelectEl.firstChild.value;
  // sendRequest(showId).then((data) => {
  //   currentEpisodes = data;
  //   fillUpEpisodeSelection(currentEpisodes);
  //   makePageForEpisodes(currentEpisodes);
  // });
  shows.forEach((show) => {
    const showDivEl = document.createElement("div");
    showDivEl.classList.add("flexColumn", "showDiv");
    showsContainer.appendChild(showDivEl);
    const showNameEl = document.createElement("h2");
    showNameEl.classList.add("showNameEl");

    const showDetailDivEl = document.createElement("div");
    showDetailDivEl.classList.add("flex", "showDetail");
    const showImgEl = document.createElement("img");
    const showSummaryEl = document.createElement("p");
    showSummaryEl.classList.add("showSummary");

    const showOtherDetailEl = document.createElement("div");
    showOtherDetailEl.classList.add("flexColumn", "showOtherDetail");

    const showRatedDivEl = document.createElement("div");
    showRatedDivEl.classList.add("flex");
    const showRatedLabelEl = document.createElement("p");
    const showRatedEl = document.createElement("p");
    showRatedDivEl.append(showRatedLabelEl, showRatedEl);

    const showGenresDivEl = document.createElement("div");
    showGenresDivEl.classList.add("flex");
    const showGenresLabelEl = document.createElement("p");
    const showGenresEl = document.createElement("p");
    showGenresDivEl.append(showGenresLabelEl, showGenresEl);

    const showStatusDivEl = document.createElement("div");
    showStatusDivEl.classList.add("flex");

    const showStatusLabelEl = document.createElement("p");
    const showStatusEl = document.createElement("p");
    showStatusDivEl.append(showStatusLabelEl, showStatusEl);

    const showRuntimeDivEl = document.createElement("div");
    showRuntimeDivEl.classList.add("flex");
    const showRuntimeLabelEl = document.createElement("p");
    const showRuntimeEl = document.createElement("p");
    showRuntimeDivEl.append(showRuntimeLabelEl, showRuntimeEl);

    showOtherDetailEl.append(
      showRatedDivEl,
      showGenresDivEl,
      showStatusDivEl,
      showRuntimeDivEl
    );
    showDetailDivEl.append(showImgEl, showSummaryEl, showOtherDetailEl);

    showDivEl.append(showNameEl, showDetailDivEl);
    SHOWS_CONTAINER.appendChild(showDivEl);

    showNameEl.innerText = show.name;
    if (show.image !== null) {
      showImgEl.src = show.image.medium;
    }
    showImgEl.classList.add("showImg");
    showSummaryEl.innerHTML = show.summary;

    showRatedLabelEl.innerText = "Rated:";
    showRatedEl.innerText = show.rating.average;

    showGenresLabelEl.innerText = "Genres:";
    let genres = "";
    for (let genre of show.genres) {
      genres = genres + genre + " | ";
    }
    showGenresEl.innerHTML = genres.substring(0, genres.length - 2);

    showStatusLabelEl.innerText = "Status:";
    showStatusEl.innerText = show.status;

    showRuntimeLabelEl.innerText = "Runtime:";
    showRuntimeEl.innerText = show.runtime;

    showNameEl.addEventListener("click", () => {
      const showId = show.id;
      sendRequest(showId).then((data) => {
        currentEpisodes = data;
        SHOWS_CONTAINER.style.display = "none";
        EPISODES_CONTAINER.style.display = "block";

        makePageForEpisodes(currentEpisodes);
        fillUpEpisodeSelection(currentEpisodes);
        const showName = document.getElementById("showName");
        showName.innerText = show.name;
        showName.classList.add("showNameHeader");
      });
    });
  });
};

//fill episode dropdownlist
const fillUpEpisodeSelection = (episodes) => {
  EPISODE_SELECT_EL.innerHTML = "";
  let episodeOptionEl = document.createElement("option");
  episodeOptionEl.value = "SHOW_ALL_EPISODES";
  episodeOptionEl.text = "All episodes";
  EPISODE_SELECT_EL.appendChild(episodeOptionEl);

  episodes.forEach((episode) => {
    episodeOptionEl = document.createElement("option");
    episodeOptionEl.value = episode.id;
    episodeOptionEl.text = formatEpisodeOption(episode);
    EPISODE_SELECT_EL.appendChild(episodeOptionEl);
  });
  SEARCH_COUNT.innerText = `Displaying ${episodes.length} / ${episodes.length} episodes`;
};

const formatEpisodeOption = (episode) => {
  return `S${episode.season.toString().padStart(2, "0")}E${episode.number
    .toString()
    .padStart(2, "0")} - ${episode.name}`;
};

window.onload = setup;
