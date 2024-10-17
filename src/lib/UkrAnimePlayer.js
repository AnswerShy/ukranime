import Hls from 'hls.js'
const hls = new Hls();

var toggleElements = {}

let coockieWatch, currentEpisode, currentTitle, baseAssetsUrl;

let hideTimeOut;


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

        toggleElements.soundIcon = soundIcon
        toggleElements.playIcon = playIcon

        toggleElements.controls = controls
        toggleElements.videoFrame = player
        toggleElements.video = video
        toggleElements.actionDisplay = action

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
                const sortedEpisodes = data.sort((a, b) => a.Anime_Episode_Number - b.Anime_Episode_Number);
                if(data.length > 1) {
                    sortedEpisodes.forEach(element => {
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
            .then(() => {
                hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) { //quality video detect
                    var levels = hls.levels;
                    for (var i = 0; i < levels.length; i++) {
                      var option = document.createElement('li');
                      option.classList.add("qualityVar")
                      option.value = i;
                      option.innerHTML = levels[i].height + 'P';
                      document.querySelector("#qualitySelect").appendChild(option);
                    }
                    document.querySelectorAll(".qualityVar").forEach(element => { 
                        element.addEventListener('click', () => {
                            hls.currentLevel = element.value
                            console.log(hls.currentLevel)
                        })
                    });
                });
            })
            .catch(error => console.error('Fetch error:', error));
    }

    controls() {
        var videoDuration;
        const video = toggleElements.video;
        const fullscreen = document.querySelector(".fullscreen-icon");
        const soundImg = document.querySelector(".soundImg");
        const progressBar = document.querySelector(".progress");

        [toggleElements.video, toggleElements.playIcon].forEach(e => e.addEventListener("click", playOrPause))

        fullscreen.addEventListener("click", () => document.fullscreenElement ? document.exitFullscreen() : toggleElements.videoFrame.requestFullscreen())

        soundImg.addEventListener("click", mute)

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
        const elementMap = {
            "#params": "menu",
            "#qualityParamsSelect": "quality",
            "#speedParamsSelect": "speed"
        };
        
        const paramMenuSwitcher = (whichOne) => {
            const elements = {
                menu: document.querySelector("#paramsMenu"),
                quality: document.querySelector("#qualitySelect"),
                speed: document.querySelector("#speed")
            }

            if (elements[whichOne] && elements[whichOne].classList.contains("hiden")) {
                Object.values(elements).forEach(el => el.classList.add("hiden"));
                elements[whichOne].classList.remove("hiden")
            }
            else {
                Object.values(elements).forEach(el => el.classList.add("hiden"));
            }
        }

        Object.entries(elementMap).forEach(([selector, param]) => {
            document.querySelector(selector).addEventListener("click", () => { paramMenuSwitcher(param) })
        })

        //Video progress going
        video.addEventListener("timeupdate", () => {
            progressBar.value = video.currentTime;
            var timeNow;

            timeNow = timeCalc(video.currentTime)
        
            document.querySelector("#time").innerHTML = `${timeNow} / ${videoDuration}`

            if(video.currentTime > 100) saveToCoockieTime(video.currentTime);
            
        })

        video.addEventListener('loadedmetadata', function () {

            videoDuration = timeCalc(video.duration)

            progressBar.max = video.duration
          
            video.volume = document.querySelector("input[name=volume]").value;
          
            document.querySelector("#time").innerHTML = `0:00 / ${videoDuration}`

            coockieWatch.forEach(e => {
                if(e.episode === currentEpisode && e.time > 10) {
                  video.currentTime = e.time
                };
            });
        });

        const saveToCoockieTime = (timeCur) => {
            const episode = parseInt(currentEpisode)
            const time = parseFloat(timeCur)
            var index = coockieWatch.findIndex(ep => ep.episode === episode)

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
        keyBinds()
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
            var index = coockieWatch.findIndex(ep => ep.episode === this.episode)
            if(coockieWatch[index] && coockieWatch[index].episode) {
                input.classList.add("watched")
            }
            if(coockieWatch[coockieWatch.length-1].episode === this.episode) {
                currentEpisode = this.episode
                this.loadtohls(this.url)
                detectEpisodeName(input)
                input.classList.add("selected")
            }
        }
        else if(coockieWatch.length < 1 && this.episode === 1) {
            currentEpisode = this.episode
            this.loadtohls(this.url)
            detectEpisodeName(input)
        }
    }

    loadtohls(url) {
        hls.loadSource(url)
        hls.attachMedia(document.querySelector("video"))
        console.log(hls.url)
    }
}

const detectEpisodeName = (element) => {
    if(element.getAttribute("episodeName") === undefined) {
        console.log(element.getAttribute("episodeName"))
        document.querySelector(".episodeName").innerHTML = element.getAttribute("episodeName")
    }
    else {
        document.querySelector(".episodeName").innerHTML = element.getAttribute("episode")
    }
}

const moveDisplay = (direction, count) => {
    const eventDisplay = toggleElements.actionDisplay
    switch(direction) {
        case '+':
            eventDisplay.innerHTML = `${count} >>`
            break;
        case '-':
            eventDisplay.innerHTML = `<< ${count}`
            break;
        case '=':
            eventDisplay.innerHTML = `${count}`
            break;
        default:
            break;
    }
    eventDisplay.classList.remove("hiden")
    setTimeout(() => {
        eventDisplay.classList.add("hiden")
    }, 1000)
}

const keyBinds = () => {
    const video = toggleElements.video
    document.addEventListener('keydown', (event) => {
        switch(event.key) {
            default:
                console.log("key does not binded")
                break
            case 'ArrowRight':
              video.currentTime += 5
              moveDisplay("+", 5)
              break;
            case 'ArrowLeft':
              video.currentTime -= 5
              moveDisplay("-", 5)
              break;
            case 'ArrowUp':
              if(parseFloat(video.volume).toFixed(2) !== 1) {
                video.volume += 0.01
                video.volume = Math.round(video.volume * 100) / 100
                document.querySelector("input[name=volume]").value = video.volume
              }
              moveDisplay("=", `${Math.round(video.volume * 100)}%`)
              break;
            case 'ArrowDown':
              if (parseFloat(video.volume).toFixed(2) !== 0) {
                video.volume -= 0.01
                video.volume = Math.round(video.volume * 100) / 100
                document.querySelector("input[name=volume]").value = video.volume
              }
              moveDisplay("=", `${Math.round(video.volume * 100)}%`)
              break;
            case 'f':
                document.fullscreenElement ? document.exitFullscreen() : toggleElements.videoFrame.requestFullscreen()
                break;
            case 'a':
                if(video.currentTime > 0) video.currentTime -= 0.1;
                moveDisplay("-", "frame")
                break;
            case 'd':
                video.currentTime += 0.1
                moveDisplay("+", "frame")
                break;
            case 'w':
                video.playbackRate += 0.5 
                document.querySelector("[name=playbackRate]").value = video.playbackRate
                document.querySelector("#speedValue").innerHTML = `${video.playbackRate}x`
                moveDisplay("=", video.playbackRate)
                break;
            case 's':
                if(video.playbackRate > 0){
                    video.playbackRate -= 0.5
                    document.querySelector("[name=playbackRate]").value = video.playbackRate
                    document.querySelector("#speedValue").innerHTML = `${video.playbackRate}x`
                    moveDisplay("=", video.playbackRate)
                }
                else {moveDisplay("=", video.playbackRate)}
                break;
            case ' ':
                playOrPause()
                break;
            case 'm':
                mute()
                break;
          }
    })
}

const playOrPause = () => { 
    if(toggleElements.video.paused) {
        toggleElements.video.play()
        toggleElements.playIcon.src = `${baseAssetsUrl}/assets/icons/pause.svg`
    }
    else {
        toggleElements.video.pause()
        toggleElements.playIcon.src = `${baseAssetsUrl}/assets/icons/play.svg` 
    }
}

const mute = () => {
    if(toggleElements.soundIcon.getAttribute("muted") === "false") {
        toggleElements.soundIcon.setAttribute("muted", "true")
        toggleElements.soundIcon.src = `${baseAssetsUrl}/assets/icons/sound.svg`
        toggleElements.video.volume = document.querySelector("input[name=volume]").value
    }
    else {
        toggleElements.soundIcon.setAttribute("muted", "false")
        toggleElements.soundIcon.src = `${baseAssetsUrl}/assets/icons/sound_muted.svg`
        toggleElements.video.volume = 0
    }
}