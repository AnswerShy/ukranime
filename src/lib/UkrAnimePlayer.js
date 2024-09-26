import Hls from 'hls.js'
const hls = new Hls();

hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) { //quality video detect
    var levels = hls.levels;
});

let coockieWatch, currentEpisode, currentTitle, baseAssetsUrl;



class PlayerElement {
    setup(assetsUrl) {
        baseAssetsUrl = assetsUrl;
        const player = document.createElement("div");
        player.id = "playerFrame";

        const video = document.createElement("video");
        video.className = "video";
        
        const ost = document.createElement("div");
        ost.className = "ost";

        const ostData = document.createElement("a");
        ostData.className = "ost-data";
        ostData.href = "";
        ostData.target = "_blank";

        const action = document.createElement("div");
        action.className = "continue";

        const controls = document.createElement("div");
        controls.className = "controls";

        const playIcon = document.createElement("img");
        playIcon.src = `${baseAssetsUrl}/assets/icons/play.svg`;
        playIcon.className = "play-icon";

        const soundControl = document.createElement("div");
        soundControl.id = "sound";

        const soundIcon = document.createElement("img");
        soundIcon.src = `${baseAssetsUrl}/assets/icons/sound.svg`;
        soundIcon.className = "soundImg";
        soundIcon.setAttribute("muted", "false");

        const volumeSlider = document.createElement("input");
        volumeSlider.type = "range";
        volumeSlider.className = "slider hiden";
        volumeSlider.name = "volume";
        volumeSlider.min = "0";
        volumeSlider.max = "1";
        volumeSlider.step = "0.01";
        volumeSlider.value = "0.5";

        soundControl.appendChild(soundIcon);
        soundControl.appendChild(volumeSlider);

        const timeDisplay = document.createElement("div");
        timeDisplay.id = "time";

        const paramsIcon = document.createElement("img");
        paramsIcon.src = `${baseAssetsUrl}/assets/icons/options.svg`;
        paramsIcon.id = "params";

        const paramsMenu = document.createElement("div");
        paramsMenu.className = "paramsMenu hiden";
        paramsMenu.id = "paramsMenu";

        const filterOption = document.createElement("li");
        filterOption.innerHTML = 'filter <input type="checkbox" id="filter">';

        const qualityParams = document.createElement("li");
        qualityParams.id = "qualityParamsSelect";
        qualityParams.textContent = "quality";

        const speedParams = document.createElement("li");
        speedParams.id = "speedParamsSelect";
        speedParams.textContent = "speed";

        paramsMenu.appendChild(filterOption);
        paramsMenu.appendChild(qualityParams);
        paramsMenu.appendChild(speedParams);

        const qualitySelect = document.createElement("ul");
        qualitySelect.className = "paramsMenu hiden";
        qualitySelect.id = "qualitySelect";

        const speedControl = document.createElement("div");
        speedControl.className = "paramsMenu hiden";
        speedControl.id = "speed";

        const speedValue = document.createElement("li");
        speedValue.id = "speedValue";
        speedValue.textContent = "1x";

        const speedSlider = document.createElement("input");
        speedSlider.type = "range";
        speedSlider.className = "slider";
        speedSlider.name = "playbackRate";
        speedSlider.min = "0.5";
        speedSlider.max = "3";
        speedSlider.step = "0.01";
        speedSlider.value = "1";

        speedControl.appendChild(speedValue);
        speedControl.appendChild(speedSlider);

        const fullscreenButton = document.createElement("img");
        fullscreenButton.src = `${baseAssetsUrl}/assets/icons/fullscreen.svg`;
        fullscreenButton.className = "fullscreen-icon";

        const progressBar = document.createElement("input");
        progressBar.type = "range";
        progressBar.className = "slider progress";
        progressBar.value = "0";
        progressBar.min = "0";
        progressBar.max = "100";
        progressBar.name = "currentTime"
        progressBar.style.width = "100%";

        controls.appendChild(playIcon);
        controls.appendChild(soundControl);
        controls.appendChild(timeDisplay);
        controls.appendChild(paramsIcon);
        controls.appendChild(paramsMenu);
        controls.appendChild(qualitySelect);
        controls.appendChild(speedControl);
        controls.appendChild(fullscreenButton);
        controls.appendChild(progressBar);

        player.appendChild(video);
        player.appendChild(ost);
        ost.appendChild(ostData);
        player.appendChild(action);
        player.appendChild(controls);

        const episodes = document.createElement("ul")
        episodes.className = "episodes"

        const episodeName = document.createElement("span")
        episodeName.className = "episodeName"

        return {episodeName, player, episodes};
    };
    
    playthis(title) {
        currentTitle = title
        coockieWatch = JSON.parse(localStorage.getItem(`Time_"${currentTitle}"`)) || [];
        const url = `https://ukranime-backend.fly.dev/api/episode_info?title=${title.replace(/ /g,'%20')}`
        fetch(url)
            .then(res => {
                if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if(data.length > 1) {
                    data.forEach(element => {
                        const episodes = new Episode(element.Anime_Episode_Number, element.Anime_Episode_Url, element.Anime_Episode_Name)
                        episodes.createEpisode()
                    });
                }
                else {
                    hls.loadSource(data[0].Anime_Episode_Url)
                    hls.attachMedia(document.querySelector("video"));
                }
            })
            .then(() => {
                try {
                    document.querySelectorAll(".episode").forEach(e => {
                        e.addEventListener("click", () => {
                            console.log(e.getAttribute("data-fetch"))

                            hls.loadSource(e.getAttribute("data-fetch"));
                            hls.attachMedia(document.querySelector("video"));

                            detectEpisodeName(e)

                            currentEpisode = e.innerHTML

                            if(document.querySelector(".selected")) {
                                document.querySelector(".selected").classList.remove("selected")
                            }
                            document.querySelector(`[episode="${currentEpisode}"]`).classList.add("selected")
                        })
                    })
                }
                catch (e) {console.error(e)}
            })
            .catch(error => console.error('Fetch error:', error));
    }

    controls() {
        var videoDuration;
        const videoFrame = document.querySelector("#playerFrame")
        const video = document.querySelector("video")
        const playIcon = document.querySelector(".play-icon")
        const fullscreen = document.querySelector(".fullscreen-icon")
        const soundImg = document.querySelector(".soundImg")
        const progressBar = document.querySelector(".progress")
        const eventDisplay = document.querySelector(".continue")

        function playOrPause() {
            if(video.paused) {
                video.play()
                playIcon.src = `${baseAssetsUrl}/assets/icons/pause.svg`
            }
            else {
                video.pause()
                playIcon.src = `${baseAssetsUrl}/assets/icons/play.svg` 
            }
        }

        video.addEventListener("click", playOrPause)
        playIcon.addEventListener("click", playOrPause)

        fullscreen.addEventListener("click", () => document.fullscreenElement ? document.exitFullscreen() : videoFrame.requestFullscreen())

        document.addEventListener('keydown', (event) => {
            switch(event.key) {
                case ' ':
                    playOrPause();
                    break;
                case 'f':
                    document.fullscreenElement ? document.exitFullscreen() : videoFrame.requestFullscreen();
                    break;
                
            }
        })

        soundImg.addEventListener("click", mute)

        function mute(){
            if(soundImg.getAttribute("muted") === "false") {
                soundImg.setAttribute("muted", "true")
                soundImg.src = `${baseAssetsUrl}/icons/sound.svg`
                video.volume = document.querySelector("input[name=volume]").value
            }
            else {
                soundImg.setAttribute("muted", "false")
                soundImg.src = `${baseAssetsUrl}/icons/sound_muted.svg`
                video.volume = 0
            }
        }

        document.querySelector(".episodes").addEventListener("wheel", (e) => {
            e.preventDefault()
            document.querySelector(".episodes").scrollLeft += e.deltaY
        })
        
        //VOLUME
        document.querySelector("#sound").addEventListener("mouseenter", () => {
            document.querySelector("input[name=volume]").classList.remove("hiden")
        })
          
        document.querySelector("#sound").addEventListener("mouseleave", () => {
          document.querySelector("input[name=volume]").classList.add("hiden")
        })

        //SLIDERS
        document.querySelectorAll(".slider").forEach((slider) => {
            slider.addEventListener("input", handleSliderUpdate);
        });
        
        function handleSliderUpdate() {
          video[this.name] = this.value;
          document.querySelector("#speedValue").innerHTML = `${video.playbackRate}x`
          if(this.name === "currentTime") {
            video.currentTime = progressBar.value;
          }
        }

        //PARAMS MENU
        document.querySelector("#params").addEventListener("click", () => {
            if(document.querySelector("#paramsMenu").classList.contains("hiden")) {
              document.querySelector("#paramsMenu").classList.remove("hiden")
              document.querySelector("#speed").classList.add("hiden")
              document.querySelector("#qualitySelect").classList.add("hiden")
            }
            else {
              document.querySelector("#paramsMenu").classList.add("hiden")  
            }
        })

        //Video progress going

        video.addEventListener("timeupdate", () => {
            progressBar.value = video.currentTime;
            var timeNow;

            timeNow = timeCalc(video.currentTime)
        
            document.querySelector("#time").innerHTML = `${timeNow} / ${videoDuration}`

            saveToCoockieTime(video.currentTime)
        })

        video.addEventListener('loadedmetadata', function () {

            videoDuration = timeCalc(video.duration)

            progressBar.max = video.duration
          
            video.volume = document.querySelector("input[name=volume]").value;
          
            document.querySelector("#time").innerHTML = `0:00 / ${videoDuration}`

            coockieWatch.forEach(e => {
                if(e.episode === currentEpisode && e.time > 200) {
                  eventDisplay.classList.remove("hide")
                  eventDisplay.innerHTML = `Continue from ${Math.floor(e.time/60)}:${Math.floor(e.time%60).toString().padStart(2, '0')}`
                  eventDisplay.setAttribute("value", e.time)
                };
            });
        });

        const saveToCoockieTime = (timeCur) => {
            const episode = parseInt(currentEpisode)
            const time = parseFloat(timeCur)
            var index = coockieWatch.findIndex(ep => ep.episode === episode)

            console.log(coockieWatch[index], index)

            if(index === -1) {
                coockieWatch.push({ episode, time })
            }   
            else {
                coockieWatch[index].episode = episode
                coockieWatch[index].time = time
            }

            localStorage.setItem(`Time_"${currentTitle}"`, JSON.stringify(coockieWatch));
        }

        const timeCalc = (time) => {
            if(Math.floor(video.duration / 3600) > 0){
                return `${Math.floor(time / 3600)}:${Math.floor(time % 3600 / 60).toString().padStart(2, "0")}:${Math.floor(time % 3600 % 60).toString().padStart(2, "0")}`
            }
            else {
                return `${Math.floor(time % 3600 / 60).toString().padStart(2, "0")}:${Math.floor(time % 3600 % 60).toString().padStart(2, "0")}`
            }
        }
    }
}

export default PlayerElement

class Episode {
    constructor (episode, url, name) {
      this.episode = episode
      this.url = url
    }
  
    createEpisode(element) {
      var input = document.createElement("li")
      input.classList.add("episode")
      input.innerHTML = `${this.episode}`
      input.setAttribute("episode", this.episode)
      input.setAttribute("data-fetch", this.url)
      input.setAttribute("episodeName", this.name)
      document.querySelector(".episodes").appendChild(input)

      if(coockieWatch.length > 0) {
        var index = coockieWatch.findIndex(ep => ep.episode == this.episode)
        if(coockieWatch[index] && coockieWatch[index].episode) {
            input.classList.add("watched")
        }
        if(coockieWatch[coockieWatch.length-1].episode == this.episode) {
            currentEpisode = this.episode
            this.loadtohls(this.url)
            detectEpisodeName(input)
            input.classList.add("selected")
        }
      }
    }

    loadtohls(url) {
        hls.loadSource(url)
        hls.attachMedia(document.querySelector("video"))
        console.log(hls.url)
    }
}

const detectEpisodeName = (element) => {
    if(element.getAttribute("episodeName") == undefined) {
        console.log(element.getAttribute("episodeName"))
        document.querySelector(".episodeName").innerHTML = element.getAttribute("episodeName")
    }
    else {
        document.querySelector(".episodeName").innerHTML = element.getAttribute("episode")
    }
}

