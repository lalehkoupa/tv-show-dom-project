const setup = () => {
  const allShows = getAllShows();
  fillUpShowSelection(allShows);

  const searchBox = document.getElementById("searchBox");
  //whenever we type a letter in a search box
  searchBox.addEventListener("keyup", search);

  const episodeSelection = document.getElementById("episodeSelection");
  //whenever we change the dropdown list
  episodeSelection.addEventListener("change", showSelectedEpisode);

  const showSelection = document.getElementById("showSelection");
  showSelection.addEventListener("change", showSelectedShow);
};

const showSelectedShow = (event) => {
  const showId = event.target.value;
  let allEpisodes = [];
  sendRequest(showId).then((data) => {
    allEpisodes = data;
    fillUpEpisodeSelection(allEpisodes);
    makePageForEpisodes(allEpisodes);
  });
};

//function will call when user change the dropdown list value
const showSelectedEpisode = (event) => {
  const episodeId = event.target.value;
  let allEpisodes;
  const showId = showSelection.value;
  sendRequest(showId).then((data) => {
    allEpisodes = data;
    if (episodeId === "SHOW_ALL_EPISODES") {
      makePageForEpisodes(allEpisodes);
      searchCount.innerText = `Displaying ${allEpisodes.length} / ${allEpisodes.length} episodes`;
    } else {
      const filterEpisode = allEpisodes.filter(
        (episode) => episode.id == episodeId
      );

      makePageForEpisodes(filterEpisode);

      searchCount.innerText = `Displaying ${filterEpisode.length} / ${allEpisodes.length} episodes`;
    }
  });
};

//function will call when user start typing in a search box
const search = (event) => {
  const searchWord = event.target.value.toLowerCase();
  let allEpisodes;
  const showId = showSelection.value;
  sendRequest(showId).then((data) => {
    allEpisodes = data;
    const filterEpisode = allEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchWord) ||
        episode.summary.toLowerCase().includes(searchWord)
    );
    const searchCount = document.getElementById("searchCount");
    searchCount.innerText = `Displaying ${filterEpisode.length} / ${allEpisodes.length} episodes`;
    makePageForEpisodes(filterEpisode);
  });
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
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => console.log(err));
};

//fill show dropdownlist
const fillUpShowSelection = (shows) => {
  //make the list of the shows in alphabetical order case-insensitive.
  shows.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));

  const showSelectEl = document.getElementById("showSelection");
  shows.forEach((show) => {
    const showOptionEl = document.createElement("option");
    showOptionEl.value = show.id;
    showOptionEl.text = show.name;
    showSelectEl.appendChild(showOptionEl);
  });
  //get the the first show in the show dropdownlist to fill up the episode dropdownlist of that show.
  let showId = showSelectEl.firstChild.value;
  sendRequest(showId).then((data) => {
    const allEpisodes = data;
    fillUpEpisodeSelection(allEpisodes);
    makePageForEpisodes(allEpisodes);
  });
};

//fill episode dropdownlist
const fillUpEpisodeSelection = (episodes) => {
  const episodeSelectEl = document.getElementById("episodeSelection");
  episodeSelectEl.innerHTML = "";
  let episodeOptionEl = document.createElement("option");
  episodeOptionEl.value = "SHOW_ALL_EPISODES";
  episodeOptionEl.text = "All episodes";
  episodeSelectEl.appendChild(episodeOptionEl);

  episodes.forEach((episode) => {
    episodeOptionEl = document.createElement("option");
    episodeOptionEl.value = episode.id;
    episodeOptionEl.text = formatEpisodeOption(episode);
    episodeSelectEl.appendChild(episodeOptionEl);
  });
  searchCount.innerText = `Displaying ${episodes.length} / ${episodes.length} episodes`;
};

const formatEpisodeOption = (episode) => {
  return `S${episode.season.toString().padStart(2, "0")}E${episode.number
    .toString()
    .padStart(2, "0")} - ${episode.name}`;
};

window.onload = setup;
