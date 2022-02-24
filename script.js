const setup = () => {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);

  const searchBox = document.getElementById("searchBox");
  const searchCount = document.getElementById("searchCount");
  searchCount.innerText = "search episodes";
  //whenever we type a letter in a search box
  searchBox.addEventListener("keyup", search);

  const episodeSelection = document.getElementById("episodeSelection");
  //whenever we change the dropdown list
  episodeSelection.addEventListener("change", showSelectedEpisode);
};

//function will call when user change the dropdown list value
const showSelectedEpisode = (event) => {
  const episodeId = Number(event.target.value);
  const allEpisodes = getAllEpisodes();
  //showing all episodes
  if (episodeId === 00) {
    makePageForEpisodes(allEpisodes);
  } else {
    const filterEpisode = allEpisodes.filter(
      (episode) => episode.id === episodeId
    );

    makePageForEpisodes(filterEpisode);
  }
};

//function will call when user start typing in a search box
const search = (event) => {
  const searchWord = event.target.value.toLowerCase();
  const allEpisodes = getAllEpisodes();
  const filterEpisode = allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchWord) ||
      episode.summary.toLowerCase().includes(searchWord)
  );

  const searchCount = document.getElementById("searchCount");
  //if we deleting the value of searchBox,the value of searchCount will be reset.
  searchWord === ""
    ? (searchCount.innerText = "search episode")
    : (searchCount.innerText = `Displaying ${filterEpisode.length} / ${allEpisodes.length} episodes`);
  makePageForEpisodes(filterEpisode);
};

const makePageForEpisodes = (episodeList) => {
  const container = document.getElementById("container");
  container.innerHTML = "";
  const episodeSelEl = document.getElementById("episodeSelection");

  episodeList.forEach((episode) => {
    //function for formatting the episode title in a page
    const formatEpisodeTitle = () => {
      //we also can use padStart method here.
      return `${episode.name} - S${
        episode.season > 9 ? episode.season : "0" + episode.season
      }E${episode.number > 9 ? episode.number : "0" + episode.number}`;
    };

    //function for formatting the episode title in a dropdown list
    const formatEpisodeOption = () => {
      //we also can use padStart method here.
      return `S${episode.season > 9 ? episode.season : "0" + episode.season}E${
        episode.number > 9 ? episode.number : "0" + episode.number
      } - ${episode.name}`;
    };

    const episodeOptEl = document.createElement("option");
    episodeOptEl.value = episode.id;
    episodeOptEl.text = formatEpisodeOption();
    episodeSelEl.appendChild(episodeOptEl);

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
    episodeImg.src = episode.image.medium;
  });
};

window.onload = setup;
