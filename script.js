const userInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const error = document.getElementById("error");
const searchResults = document.getElementById("search-results");
const container2 = document.getElementById("container2");

const nameElement = document.getElementById("pokemon-name");
const idElement = document.getElementById("pokemon-id");
const weightElement = document.getElementById("weight");
const heightElement = document.getElementById("height");
const typesContainer = document.getElementById("types");
const hpElement = document.getElementById("hp");
const attackElement = document.getElementById("attack");
const defenseElement = document.getElementById("defense");
const spAttackElement = document.getElementById("special-attack");
const spDefenseElement = document.getElementById("special-defense");
const speedElement = document.getElementById("speed");

let pokemonData = [];

fetch("https://pokeapi-proxy.freecodecamp.rocks/api/pokemon")
    .then((res) => res.json())
    .then((data) => {
        pokemonData = data.results;
    })
    .catch((err) => {
        error.innerHTML = `<p class="error-msg">There was an error loading the pokemon</p>`;
    });

function getPokemonDetails(pokemonUrl) {
    return fetch(pokemonUrl)
        .then(res => res.json())
        .catch(err => {
            console.error('Error fetching Pokemon details:', err);
            return null;
        });
}

function displayPokemonDetails(details) {
    if (!details) return;

    container2.classList.remove("hidden");
    container2.classList.add("visible");

    const pokemonId = details.id;
    nameElement.textContent = details.name.toUpperCase();
    idElement.textContent = `#${pokemonId}`; // Just display the number
    weightElement.textContent = `Weight: ${details.weight}`;
    heightElement.textContent = `Height: ${details.height}`;
    
    // Clear previous types
    typesContainer.innerHTML = '';
    
    // Create new elements for each type
    details.types.forEach(typeInfo => {
        const typeElement = document.createElement('p');
        typeElement.textContent = typeInfo.type.name.toUpperCase();
        typesContainer.appendChild(typeElement);
    });

    hpElement.textContent = `Hp: ${details.stats.find(stat => stat.stat.name === 'hp').base_stat}`;
    attackElement.textContent = `Attack: ${details.stats.find(stat => stat.stat.name === 'attack').base_stat}`;
    defenseElement.textContent = `Defense: ${details.stats.find(stat => stat.stat.name === 'defense').base_stat}`;
    spAttackElement.textContent = `Special Attack:${details.stats.find(stat => stat.stat.name === 'special-attack').base_stat}`;
    spDefenseElement.textContent = `Special Defense: ${details.stats.find(stat => stat.stat.name === 'special-defense').base_stat}`;
    speedElement.textContent = `Speed: ${details.stats.find(stat => stat.stat.name === 'speed').base_stat}`;

    // Create an image element to load the sprite
    const spriteImage = new Image();
    spriteImage.crossOrigin = 'Anonymous'; // This is important to avoid CORS issues
    spriteImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

    spriteImage.onload = () => {
        const colorThief = new ColorThief();
        try {
            const palette = colorThief.getPalette(spriteImage, 5); // Get top 5 dominant colors
            const dominantColor = palette[0]; // Choose the first one as the dominant color
            container2.style.backgroundColor = `rgb(${dominantColor.join(',')})`;
        } catch (error) {
            console.error('Error getting dominant color:', error);
            // Fallback to a default color if there is an error
            container2.style.backgroundColor = 'lightgray';
        }

        // Display the image
        searchResults.innerHTML = `<img id="sprite" src="${spriteImage.src}" alt="${details.name}">`;
    };

    spriteImage.onerror = () => {
        console.error('Error loading image');
        // Fallback to a default color if image fails to load
        container2.style.backgroundColor = 'lightgray';
    };
}

function searchPokemon(query) {
    // Hide container2 initially
    container2.classList.remove("visible");
    container2.classList.add("hidden");

    // Clear previous search results
    searchResults.innerHTML = '';
    nameElement.textContent = '';
    idElement.textContent = '';
    weightElement.textContent = '';
    heightElement.textContent = '';
    typesContainer.innerHTML = '';
    hpElement.textContent = '';
    attackElement.textContent = '';
    defenseElement.textContent = '';
    spAttackElement.textContent = '';
    spDefenseElement.textContent = '';
    speedElement.textContent = '';

    const queryNumber = parseInt(query, 10);

    // Filter Pokemon based on the exact match of the name or ID
    const filteredPokemon = pokemonData.filter((pokemon) => {
        const nameMatches = pokemon.name.toLowerCase() === query.toLowerCase();
        const idMatches = parseInt(pokemon.url.split('/').slice(-2, -1)[0], 10) === queryNumber; // Extract and compare ID
        return nameMatches || idMatches;
    });

    // If no results were found, display a message
    if (filteredPokemon.length === 0) {
        alert("Pokémon not found");
        return;
    }

    // Fetch and display detailed data for the matched Pokemon
    getPokemonDetails(filteredPokemon[0].url).then(displayPokemonDetails);
}

searchBtn.addEventListener("click", () => {
    const query = userInput.value;
    searchPokemon(query);
});
