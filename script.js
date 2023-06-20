let editingCard;
let id;
async function randomAnime(){
  try{
  var animeSearch = await fetch("https://api.jikan.moe/v4/random/anime")
  animeJson = await animeSearch.json()
  if(animeJson.error){
    throw Error("Deu ruim");
  }
  return animeJson;
}catch(error){
  console.log(error);
  }
}

async function GetAnimeByType(type,limit){
  try{
    if(limit>10) limit=10;
  var animeSearch = await fetch("https://api.jikan.moe/v4/top/anime?type="+type+"&kids=true&limit="+limit)
  animeJson = await animeSearch.json()
  if(animeJson.error){
    throw Error("Deu ruim");
  } 
  return animeJson;
}catch(error){
  console.log(error);
  }
}

  function createAnimeCard(anime) {
    const animeCard={
      title: anime.title, 
      synopsis: anime.synopsis,
      img: anime.images.jpg.image_url
    };
    if (animeCard.synopsis.length > 100) {
      animeCard.synopsis = animeCard.synopsis.substring(0, 100) + "...";
    }
    const card = document.createElement('div');
    card.className = 'card col-lg-3 com-md-4 col-sm-12';
    const img = document.createElement('img');
    img.className = 'card-img-top';
    img.src = animeCard.img;
    img.alt = animeCard.title;
    img.style = 'max-height: 200px'

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const title = document.createElement('h5');
    title.className = 'card-title';
    title.textContent = animeCard.title;

    const synopsis = document.createElement('p');
    synopsis.className = 'card-text';
    synopsis.textContent = animeCard.synopsis;
    card.synopsisElement=synopsis;

    const deleteButton = document.createElement('a');
    deleteButton.className = 'delete-button';
    deleteButton.href = '#';
    deleteButton.textContent = 'Remover';

    cardBody.appendChild(title);
    cardBody.appendChild(synopsis);
    cardBody.appendChild(deleteButton);
    card.appendChild(img);
    card.appendChild(cardBody);

     
    
    card.addEventListener('mouseenter', function () {
      card.classList.add('highlighted');
    });

    card.addEventListener('mouseleave', function () {
      card.classList.remove('highlighted');  
    });

    card.addEventListener('click',function(event){ 
      if (event.target.className === 'delete-button') {
          const card = event.target.closest('.card');
          if (confirm('Você tem certeza de que deseja excluir este card?')) {
              removeAnimeCard(card);
          }
      } else {
          openModal(animeCard,card);
      }
  });
  return card;  
  }
  
  function renderAnimeCards(animeList) {
    const container = document.getElementById('anime-container');
    container.innerHTML = '';
  
    animeList.forEach(function (anime) {
      const card = createAnimeCard(anime);
      container.appendChild(card);
    });
  }
  openModal = (animeCard,card) => {
    const editModal = new bootstrap.Modal(document.getElementById('editAnimeModal'));
    const synopsisTextArea = document.getElementById('anime-synopsis');
    synopsisTextArea.value = animeCard.synopsis
    editingCard = {card: card}; 
    editModal.show();
  };  
  async function addAnimeCard(type,limit) {
    const anime = await GetAnimeByType(type,limit);
    anime.data.forEach(element => {
      const card = createAnimeCard(element);
      const container = document.getElementById('anime-container');
      container.appendChild(card);
  });}

  async function addRandomAnimeCard() {
  const anime = await randomAnime();
      const card = createAnimeCard(anime.data);
      const container = document.getElementById('anime-container');
      container.appendChild(card);
  }
  
  function removeAnimeCard(card) {
    const container = document.getElementById('anime-container');
    container.removeChild(card);
  }

  async function filterByRating(animeData,rating){
    if(!(animeData.rating.includes(rating))){
      return animeData;
    }
    let anime = await randomAnime();
    return filterByRating(anime.data,rating);
  }
  
  const addRandomAnimeButton = document.getElementById('add-random-anime-button');
  addRandomAnimeButton.addEventListener('click', addRandomAnimeCard);
  
  document.getElementById('add-anime-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const animeType = document.getElementById('anime-type-value').value;
    const animeCount = document.getElementById('anime-count').value;
    addAnimeCard(animeType, animeCount);
    const addAnimeModal = bootstrap.Modal.getInstance(document.getElementById('addAnimeModal'));
    addAnimeModal.hide();
  });

  document.getElementById('submitAnimeEdit').addEventListener('click', function(event) {
    event.preventDefault();
    const newSynopsis = document.getElementById('anime-synopsis').value;
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editAnimeModal'));
    
    if (editingCard) {
      editingCard.card.synopsisElement.textContent = newSynopsis;
      editingCard.card.synopsis = newSynopsis; // Atualize a sinopse no objeto anime deste card
    }
    editModal.hide();
  });