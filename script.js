const charactersList = document.getElementById('characters-list');
const pagination = document.getElementById('pagination');
const nameFilter = document.getElementById('name-filter');
const resetButton = document.getElementById('reset-button');
let charactersData = []; 
const defaultHouseImages = {
    Gryffindor: './gryffindor.jpg',
    Hufflepuff: './hufflepuff.jpg',
    Ravenclaw: './ravenclaw.jpg',
    Slytherin: './slytherin.jpg',
    Unknown: './nohouse.jpg' 
}
const charactersPerPage = 10;
let currentPage = 1;


function fetchAndDisplayCharacters(page) {
    fetch(`https://hp-api.onrender.com/api/characters?page=${page}&limit=${charactersPerPage}`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            charactersData = data;
            displayCharacters(currentPage);
            displayPagination();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


function displayCharacters(page) {
    charactersList.innerHTML = '';

    const startIndex = (page - 1) * charactersPerPage;
    const endIndex = startIndex + charactersPerPage;
    const charactersToDisplay = charactersData.slice(startIndex, endIndex);

    charactersToDisplay.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.className = 'character-card';

        const characterImage = document.createElement('img');
        characterImage.className = 'character-image';

        if (character.image) {
            characterImage.src = character.image;
        } else {
            const defaultImage = defaultHouseImages[character.house] || defaultHouseImages['Unknown'];
            characterImage.src = `./assets/${defaultImage}`;
        }

        characterImage.alt = character.name;

        const characterInfo = document.createElement('div');
        characterInfo.className = 'character-info';

        const characterName = document.createElement('div');
        characterName.className = 'character-name';
        characterName.textContent = `${character.name}`;

        const characterHouse = document.createElement('div');
        characterHouse.className = 'character-house';
        characterHouse.textContent = `Casa: ${character.house || 'Unknown'}`;

        const characterSpecies = document.createElement('div');
        characterSpecies.className = 'character-species';
        characterSpecies.textContent = `Especie: ${character.species || 'Unknown'}`;

        characterInfo.appendChild(characterName);
        characterInfo.appendChild(characterHouse);
        characterInfo.appendChild(characterSpecies);

        characterCard.appendChild(characterImage);
        characterCard.appendChild(characterInfo);

        charactersList.appendChild(characterCard);
    });
}


function displayPagination() {
    const totalPages = Math.ceil(charactersData.length / charactersPerPage);
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('button__container');
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayCharacters(currentPage);
        });
        pagination.appendChild(pageButton);
    }
}

nameFilter.addEventListener('input', () => {
    const filterValue = nameFilter.value.toLowerCase();
    const filteredCharacters = charactersData.filter(character =>
        character.name.toLowerCase().includes(filterValue)
    );

    charactersData = filteredCharacters;
    currentPage = 1;
    displayCharacters(currentPage);
    displayPagination();
});

fetchAndDisplayCharacters(currentPage);

resetButton.addEventListener('click', () => {
    nameFilter.value = ''; 
    charactersData = []; 
    currentPage = 1; 
    fetchAndDisplayCharacters(currentPage); 
});