const apiKey = '8105d10fcd2090289c5a2f38d96a4bb4';  // Substitua com sua chave de API do Last.fm
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const artistInfo = document.getElementById('artistDetails');
const trackInfo = document.getElementById('tracksList');
const albumsInfo = document.getElementById('albumsList');
const globalTopSongs = document.getElementById('globalTopSongs');

const generosPermitidos = [
    "Blues", "Jazz", "R&B", "Soul", "Funk", "Hip-Hop", 
    "Reggae", "Afrobeat", "House", "Trap", "Gospel"
];

async function fetchArtistInfo(artistName) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${apiKey}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function fetchArtistTracks(artistName) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artistName}&api_key=${apiKey}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function fetchTopGlobalTracks() {
    const url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apiKey}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Função para verificar o gênero
function checkGenre(artistGenres) {
    return artistGenres.some(genre => generosPermitidos.includes(genre));
}

async function displayArtistData(artistName) {
    try {
        const artistData = await fetchArtistInfo(artistName);
        const topTracksData = await fetchArtistTracks(artistName);
        const topGlobalTracksData = await fetchTopGlobalTracks();

        if (artistData.artist && topTracksData.toptracks) {
            // Exibir informações do artista
            const genres = artistData.artist.tags.tag.map(tag => tag.name);
            const isValidGenre = checkGenre(genres);

            if (isValidGenre) {
                const artistBio = artistData.artist.bio.summary;
                const artistImage = artistData.artist.image[2]['#text'];  // Imagem média do artista

                // Exibir informações do artista
                artistInfo.innerHTML = `
                    <h3>${artistName}</h3>
                    <img src="${artistImage}" alt="${artistName}" />
                    <p>${artistBio}</p>
                    <h4>Top Tracks:</h4>
                    <ul>
                        ${topTracksData.toptracks.track.map(track => `
                            <li>
                                ${track.name} - ${track.artist.name} 
                                <a href="${track.url}" target="_blank">Ouça</a>
                            </li>
                        `).join('')}
                    </ul>
                `;

                // Exibir músicas mais tocadas globalmente
                globalTopSongs.innerHTML = `
                    <h4>Músicas Mais Tocadas Globalmente:</h4>
                    <ul>
                        ${topGlobalTracksData.tracks.track.map(track => `
                            <li>
                                ${track.name} - ${track.artist.name} 
                                <a href="${track.url}" target="_blank">Ouça</a>
                            </li>
                        `).join('')}
                    </ul>
                `;
            } else {
                artistInfo.innerHTML = `<p>Este artista não pertence aos gêneros selecionados.</p>`;
            }
        } else {
            artistInfo.innerHTML = `<p>Artista não encontrado.</p>`;
        }
    } catch (error) {
        console.error("Erro ao buscar dados do artista:", error);
        artistInfo.innerHTML = "<p>Erro ao buscar informações. Tente novamente.</p>";
    }
}

searchButton.addEventListener('click', () => {
    const artistName = searchInput.value.trim();
    if (artistName) {
        displayArtistData(artistName);
    } else {
        alert("Digite o nome do artista.");
    }
});
