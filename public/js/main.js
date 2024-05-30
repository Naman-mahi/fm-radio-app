
const apiUrl = 'https://de1.api.radio-browser.info/json/stations/search';

function liveSearch() {
    const query = document.getElementById('searchQuery').value;
    if (query.trim() === '') {
        document.getElementById('stationsList').innerHTML = '';
        return;
    }

    fetch(`${apiUrl}?name=${query}&limit=30`)
        .then(response => response.json())
        .then(data => displayStations(data))
        .catch(error => console.error('Error fetching radio stations:', error));
}

const BrightColors = [
    "#1F77B4", // Strong Blue
    "#FF7F0E", // Bright Orange
    "#2CA02C", // Green
    "#D62728", // Red
    "#9467BD", // Medium Purple
    "#8C564B", // Brown
    "#E377C2", // Pink
    "#7F7F7F", // Gray
    "#BCBD22", // Olive
    "#17BECF", // Cyan
    "#AEC7E8", // Light Blue
    "#FFBB78", // Light Orange
    "#98DF8A", // Light Green
    "#FF9896", // Light Red
    "#C5B0D5", // Light Purple
    "#C49C94", // Light Brown
    "#F7B6D2", // Light Pink
    "#C7C7C7", // Light Gray
    "#DBDB8D", // Light Olive
    "#9EDAE5", // Light Cyan
    "#FF1493", // Deep Pink
    "#FFD700", // Gold
    "#40E0D0", // Turquoise
    "#00FF7F", // Spring Green
    "#FF4500", // Orange Red
    "#DAA520", // Goldenrod
    "#CD5C5C", // Indian Red
    "#4B0082", // Indigo
    "#48D1CC", // Medium Turquoise
    "#FF6347", // Tomato
    "#2E8B57", // Sea Green
    "#6A5ACD", // Slate Blue
    "#20B2AA", // Light Sea Green
    "#FF69B4", // Hot Pink
    "#87CEFA", // Light Sky Blue
    "#778899", // Light Slate Gray
    "#B0C4DE", // Light Steel Blue
    "#32CD32", // Lime Green
    "#FF00FF", // Magenta
    "#66CDAA", // Medium Aquamarine
    "#BA55D3", // Medium Orchid
    "#9370DB", // Medium Purple
    "#3CB371", // Medium Sea Green
    "#7B68EE", // Medium Slate Blue
    "#00FA9A", // Medium Spring Green
    "#48D1CC", // Medium Turquoise
    "#C71585", // Medium Violet Red
    "#191970", // Midnight Blue
    "#F5FFFA", // Mint Cream
    "#FFE4E1"  // Misty Rose
];

function getDefaultAvatar(name) {
    const initials = name.split(' ').map(word => word.charAt(0)).join('');
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=150`;
}

function displayStations(stations) {
    const stationsList = document.getElementById('stationsList');
    stationsList.innerHTML = '';

    if (stations.length === 0) {
        stationsList.innerHTML = '<p class="text-center text-white">No stations found.</p>';
        return;
    }

    stations.forEach((station, i) => {
        const stationCard = `
            <div class="col-sm-12 col-lg mb-4">
                <div class="card" style="background-color:${BrightColors[(Math.floor(Math.random() * BrightColors.length))]}" onclick="selectStation('${station.url_resolved}', '${station.name}', '${station.country}', '${station.language}', '${station.favicon || getDefaultAvatar(station.name)}')">
                    <img src="${station.favicon || getDefaultAvatar(station.name)}" class="card-img-top" alt="${station.name}">
                <div class="card-body position-absolute">                            
                    <h5 class="card-title stationName">${station.name}</h5><br><br>
                    <span class="badge badge-dark" style="background-color:#000">${station.language}</span>
                </div>
            </div>
        </div>
    `;
        stationsList.innerHTML += stationCard;
    });
}

let currentAudio = new Audio();
currentAudio.controls = false;

function selectStation(url, name, country, language, logo) {
    const playerModal = new bootstrap.Modal(document.getElementById('playerModal'));

    document.getElementById('modalStationLogo').src = logo;
    document.getElementById('modalStationName').innerText = name;
    document.getElementById('modalStationInfo').innerHTML = `Country: ${country}<br>Language: ${language || 'N/A'}`;
    document.getElementById('fixedPlayerStationName').innerHTML = name;

    if (currentAudio.src !== url) {
        currentAudio.src = url;
        currentAudio.play();
    } else if (currentAudio.paused) {
        currentAudio.play();
    } else {
        currentAudio.pause();
    }

    updatePlayPauseIcon();
    playerModal.show();
}

function togglePlay() {
    if (currentAudio.paused) {
        currentAudio.play();
    } else {
        currentAudio.pause();
    }
    updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
    const playPauseIcon = document.querySelector('#playPauseButton i');
    if (currentAudio.paused) {
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
    } else {
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
    }
}

function toggleMute() {
    currentAudio.muted = !currentAudio.muted;
    const muteButton = document.querySelector('.player-controls button:last-child i');
    muteButton.classList.toggle('fa-volume-up');
    muteButton.classList.toggle('fa-volume-mute');
}

function setVolume(value) {
    currentAudio.volume = value;
}

