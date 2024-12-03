// Upload Photos
function uploadPhoto(inputId, textId, imgId) {
  let input = document.getElementById(inputId);
  let textElement = document.getElementById(textId);
  let imgElement = document.getElementById(imgId);

  if (input.files && input.files[0]) {
    let reader = new FileReader();

    reader.onload = function (e) {
      imgElement.src = e.target.result;
      imgElement.classList.remove('hidden');
      textElement.classList.add('hidden');
    };

    reader.readAsDataURL(input.files[0]);
  }
}

// Form Position
const positionInput = document.getElementById('position');
const extraAttributesGK = document.getElementById('extraAttributesGK');
const extraAttributesSQ = document.getElementById('extraAttributesSQ');

positionInput.addEventListener('change', (event) => {
  const position = event.target.value;

  if (position === 'GK') {
    extraAttributesGK.classList.remove('hidden');
    extraAttributesSQ.classList.add('hidden');
  } else if (position) {
    extraAttributesSQ.classList.remove('hidden');
    extraAttributesGK.classList.add('hidden');
  } else {
    extraAttributesGK.innerHTML = '';
    extraAttributesSQ.innerHTML = '';
    extraAttributesSQ.classList.add('hidden');
    extraAttributesGK.classList.add('hidden');
  }
});

// validation form with rating calculate --------------------------------------------------------------------
const GKelement = [
  'diving',
  'handling',
  'kicking',
  'reflexes',
  'speed',
  'positioning',
];
const SQelement = [
  'pace',
  'shooting',
  'passing',
  'dribbling',
  'defending',
  'physical',
];
function validateAndCalculateRating() {
  let isValid = true;

  // ERROR-----------------------------------------------------------------
  const createError = (element) => {
    element.classList.add('border-2', 'border-red-500');
    isValid = false;
  };

  // Remove error-----------------------------------------------------------
  const removeError = (element) => {
    element.classList.remove('border-2', 'border-red-500');
  };

  // ValidateInput condition----------------------------------------------------------
  const validateInput = (field, condition) => {
    if (condition) {
      createError(field);
    } else {
      removeError(field);
    }
  };

  // Player details validate------------------------------------------------
  const playerName = document.getElementById('name');
  validateInput(
    playerName,
    !playerName.value.trim() ||
      playerName.value.length < 3 ||
      playerName.value.length > 20
  );

  const playerPhoto = document.getElementById('profilePhoto');
  validateInput(playerPhoto, !playerPhoto.files.length);

  const position = document.getElementById('position');
  validateInput(position, !position.value);

  const nationality = document.getElementById('nationality');
  validateInput(nationality, !nationality.value.trim());

  const club = document.getElementById('club');
  validateInput(club, !club.value.trim());

  // attributes and calculate rating---------------------------------------------------------

  const gkDiv = document.getElementById('extraAttributesGK');
  const sqDiv = document.getElementById('extraAttributesSQ');
  let calculatedRating = 0;

  const calculateRating = (attributes, divisor) => {
    let total = 0;
    attributes.forEach((attr) => {
      const input = document.getElementById(attr);
      validateInput(
        input,
        !input.value ||
          isNaN(input.value) ||
          input.value < 10 ||
          input.value > 99
      );
      total += parseFloat(input.value || 0);
    });
    return Math.trunc(total / divisor);
  };

  if (!gkDiv.classList.contains('hidden')) {
    calculatedRating = calculateRating(GKelement, 5.5);
  } else if (!sqDiv.classList.contains('hidden')) {
    calculatedRating = calculateRating(SQelement, 5.5);
  }

  // Rating -------------------------------------------------------------
  const ratingElement = document.getElementById('rating');
  if (isValid) {
    ratingElement.textContent = calculatedRating;
  }

  return isValid;
}

// ADD Players------------------------------------------------------

let totalPlayers = 0;
let gkCount = 0;
const maxPlayers = 25;
const maxGKs = 3;

// Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

function addPlayerToSubstitutes() {
  // Validate form and calculate rating
  if (!validateAndCalculateRating()) return;

  // player details--------------------------------------------------
  const name = document.getElementById('name').value.trim();
  const position = document.getElementById('position').value;
  const nationality = document.getElementById('nationality').value.trim();
  const club = document.getElementById('club').value.trim();
  const nationalityFile = document.getElementById('flag').files[0];
  const clubFile = document.getElementById('logo').files[0];
  const rating = document.getElementById('rating').textContent.trim();
  const photoFile = document.getElementById('profilePhoto').files[0];
  const diving = document.getElementById('diving').value;
  const handling = document.getElementById('handling').value;
  const kicking = document.getElementById('kicking').value;
  const reflexes = document.getElementById('reflexes').value;
  const speed = document.getElementById('speed').value;
  const positioning = document.getElementById('positioning').value;
  const pace = document.getElementById('pace').value;
  const shooting = document.getElementById('shooting').value;
  const passing = document.getElementById('passing').value;
  const dribbling = document.getElementById('dribbling').value;
  const defending = document.getElementById('defending').value;
  const physical = document.getElementById('physical').value;

  //   limit players--------------------------------------------------
  if (totalPlayers >= maxPlayers) {
    Swal.fire({
      background: '#000000',
      position: 'center',
      icon: 'error',
      title: 'You have reached the maximum number of players.',
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  if (position === 'GK' && gkCount >= maxGKs) {
    Swal.fire({
      background: '#000000',
      position: 'center',
      icon: 'error',
      title: 'You have reached the maximum number of GKs.',
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  totalPlayers++;
  if (position === 'GK') gkCount++;

  Promise.all([
    fileToBase64(nationalityFile),
    fileToBase64(clubFile),
    fileToBase64(photoFile),
  ]).then(([nationalityFile, clubFile, photoFile]) => {
    let player = {
      name,
      position,
      rating,
      nationality,
      club,
      photoFile: photoFile || null,
      nationalityFile: nationalityFile || null,
      clubFile: clubFile || null,
      diving,
      handling,
      kicking,
      reflexes,
      speed,
      positioning,
      pace,
      shooting,
      passing,
      dribbling,
      defending,
      physical,
    };
    let players = JSON.parse(localStorage.getItem('players')) || [];
    players.push(player);
    localStorage.setItem('players', JSON.stringify(players));

    // substitute card ----------------------------------------------------------------

    const targetSection =
      position === 'GK'
        ? document.querySelector('.substitutesGK')
        : document.querySelector('.substitutesSQ');

    // position section--------------------------------------------------

    let newSubstitute = targetSection.cloneNode(true);
    newSubstitute.removeAttribute('id');
    newSubstitute.classList.add('cursor-pointer');
    newSubstitute
      .querySelectorAll('*')
      .forEach((el) => el.removeAttribute('id'));
    newSubstitute.classList.remove('hidden');
    newSubstitute.classList.add('substitute');

    const substitute = (selector, value) => {
      const element = newSubstitute.querySelector(selector);
      if (element) element.textContent = value;
    };

    const setImage = (selector, src) => {
      const image = newSubstitute.querySelector(selector);
      if (src && image) {
        image.src = src;
        image.classList.remove('hidden');
      }
    };

    targetSection.parentElement.appendChild(newSubstitute);

    substitute('.name', name);
    substitute('.position', position);
    substitute('.rating', rating);
    substitute('.nationality', nationality);
    substitute('.club', club);

    if (position === 'GK') {
      substitute('.diving', diving);
      substitute('.handling', handling);
      substitute('.kicking', kicking);
      substitute('.reflexes', reflexes);
      substitute('.speed', speed);
      substitute('.positioning', positioning);
    } else {
      substitute('.pace', pace);
      substitute('.shooting', shooting);
      substitute('.passing', passing);
      substitute('.dribbling', dribbling);
      substitute('.defending', defending);
      substitute('.physical', physical);
    }
    setImage('.photoPlayers', photoFile);
    setImage('.photoNation', nationalityFile);
    setImage('.photoClub', clubFile);

    // substitute attributes-----------------------------------------------------------
  });

  // Show success message-------------------------------------------------
  Swal.fire({
    background: '#000000',
    position: 'center',
    icon: 'success',
    title: `${name} added successfully!`,
    showConfirmButton: false,
    timer: 1500,
  });

  // Clear form------------------------------------------------------------
  clearForm();
  
}
document
  .getElementById('addPlayerButton')
  .addEventListener('click', addPlayerToSubstitutes);

function clearForm() {
  document.getElementById('playerForm').reset();
  // clear rating------------------------------------------------------------
  document.getElementById('rating').textContent = '--';
  // clear photo-------------------------------------------------------------
  document.getElementById('profilePlayer').src = '';
  document.getElementById('profilePlayer').classList.add('hidden');
  document.getElementById('TextPlayerPhoto').classList.remove('hidden');

  document.getElementById('profileFlag').src = '';
  document.getElementById('profileFlag').classList.add('hidden');
  document.getElementById('TextFlag').classList.remove('hidden');

  document.getElementById('profileLogo').src = '';
  document.getElementById('profileLogo').classList.add('hidden');
  document.getElementById('TextLogo').classList.remove('hidden');
}

window.onload = function () {
  let substitutePlace = document.getElementById('sub');
  const storedSubstitutes = JSON.parse(localStorage.getItem('players')) || [];

  storedSubstitutes.forEach((player) => {
    //  template
    const targetTemplate =
      player.position === 'GK'
        ? document.querySelector('.substitutesGK')
        : document.querySelector('.substitutesSQ');

    // Clone the template
    const newSubstitute = targetTemplate.cloneNode(true);
    newSubstitute.classList.remove('hidden');
    newSubstitute.removeAttribute('id');
    newSubstitute.classList.add('cursor-pointer');
    newSubstitute.classList.add('substitute');

    const substitute = (selector, value) => {
      const element = newSubstitute.querySelector(selector);
      if (element) element.textContent = value;
    };

    const setImage = (selector, src) => {
      const image = newSubstitute.querySelector(selector);
      if (src && image) {
        image.src = src;
        image.classList.remove('hidden');
      }
    };

    substitute('.name', player.name);
    substitute('.position', player.position);
    substitute('.rating', player.rating);
    substitute('.nationality', player.nationality);
    substitute('.club', player.club);

    if (player.position === 'GK') {
      substitute('.diving', player.diving);
      substitute('.handling', player.handling);
      substitute('.kicking', player.kicking);
      substitute('.reflexes', player.reflexes);
      substitute('.speed', player.speed);
      substitute('.positioning', player.positioning);
    } else {
      substitute('.pace', player.pace);
      substitute('.shooting', player.shooting);
      substitute('.passing', player.passing);
      substitute('.dribbling', player.dribbling);
      substitute('.defending', player.defending);
      substitute('.physical', player.physical);
    }

    setImage('.photoPlayers', player.photoFile);
    setImage('.photoNation', player.nationalityFile);
    setImage('.photoClub', player.clubFile);

    substitutePlace.appendChild(newSubstitute);
  });
};

// SHOW data in the form------------------------------------------------
document.getElementById('sub').addEventListener('click', (event) => {
  const clickolayer = event.target.closest('.substitute');
  if (!clickolayer) return;

  const hideSubtitues = Array.from(clickolayer.parentNode.children).filter(
    (child) => !child.classList.contains('hidden')
  );

  const index = hideSubtitues.indexOf(clickolayer);

  const players = JSON.parse(localStorage.getItem('players')) || [];
  const player = players[index];
  if (!player) return;

  document.getElementById('name').value = player.name;
  document.getElementById('position').value = player.position;
  document.getElementById('nationality').value = player.nationality;
  document.getElementById('club').value = player.club;
  document.getElementById('rating').textContent = player.rating;

  if (player.photoFile) {
    document.getElementById('profilePlayer').src = player.photoFile;
    document.getElementById('profilePlayer').classList.remove('hidden');
    document.getElementById('TextPlayerPhoto').classList.add('hidden');
  }
  if (player.nationalityFile) {
    document.getElementById('profileFlag').src = player.nationalityFile;
    document.getElementById('profileFlag').classList.remove('hidden');
    document.getElementById('TextFlag').classList.add('hidden');
  }
  if (player.clubFile) {
    document.getElementById('profileLogo').src = player.clubFile;
    document.getElementById('profileLogo').classList.remove('hidden');
    document.getElementById('TextLogo').classList.add('hidden');
  }

  const attributes = player.position === 'GK' ? GKelement : SQelement;
  attributes.forEach((attr) => {
    document.getElementById(attr).value = player[attr];
    document.getElementById(attr).parentElement.classList.remove('hidden');
  });

  document.getElementById('addPlayerButton').classList.add('hidden');
  document.getElementById('update').classList.remove('hidden');
  document.getElementById('delete').classList.remove('hidden');
  document.getElementById('cancel').classList.remove('hidden');

  document.getElementById('playerForm').dataset.index = index;
});

// hide button
function hideButton() {
  document.getElementById('addPlayerButton').classList.remove('hidden');
  document.getElementById('update').classList.add('hidden');
  document.getElementById('delete').classList.add('hidden');
  document.getElementById('cancel').classList.add('hidden');
  // hide the attribute value in the form
  GKelement.forEach((attr) => {
    document.getElementById(attr).parentElement.classList.add('hidden');
  });
  SQelement.forEach((attr) => {
    document.getElementById(attr).parentElement.classList.add('hidden');
  });
}

// cancel button------------------------------------------------
document.getElementById('cancel').addEventListener('click', () => {
  clearForm();
  hideButton();
});

// delete button------------------------------------------------
document.getElementById('delete').addEventListener('click', () => {
  const index = document.getElementById('playerForm').dataset.index;
  const players = JSON.parse(localStorage.getItem('players')) || [];
  players.splice(index, 1);
  localStorage.setItem('players', JSON.stringify(players));
  window.location.reload();
});

// modifier players------------------------------------------------
document.getElementById('update').addEventListener('click', () => {
  if (!validateAndCalculateRating()) return;

  const index = document.getElementById('playerForm').dataset.index;
  const players = JSON.parse(localStorage.getItem('players')) || [];
  const player = players[index];
  player.name = document.getElementById('name').value;
  player.position = document.getElementById('position').value;
  player.rating = document.getElementById('rating').textContent.trim();
  player.nationality = document.getElementById('nationality').value;
  player.club = document.getElementById('club').value;
  player.photoFile = document.getElementById('profilePlayer').src;
  player.nationalityFile = document.getElementById('profileFlag').src;
  player.clubFile = document.getElementById('profileLogo').src;
  player.diving = document.getElementById('diving').value;
  player.handling = document.getElementById('handling').value;
  player.kicking = document.getElementById('kicking').value;
  player.reflexes = document.getElementById('reflexes').value;
  player.speed = document.getElementById('speed').value;
  player.positioning = document.getElementById('positioning').value;
  player.pace = document.getElementById('pace').value;
  player.shooting = document.getElementById('shooting').value;
  player.passing = document.getElementById('passing').value;
  player.dribbling = document.getElementById('dribbling').value;
  player.defending = document.getElementById('defending').value;
  player.physical = document.getElementById('physical').value;

  localStorage.setItem('players', JSON.stringify(players));
  window.location.reload();
});

// Popup
const playerElements = document.querySelectorAll('.player');
const popup = document.getElementById('popup');
const popupContent = document.getElementById('popupContent');
const closePopupButton = document.getElementById('closePopup');
const substitutesContainer = document.getElementById('sub'); // Div with substitutes

// Show the popup
function showPopup() {
  popup.classList.remove('hidden');
}

// Hide the popup
function hidePopup() {
  popup.classList.add('hidden');
}

// Function to update the terrain
function updateTerrain(position, substitute) {
  const terrainPositionDiv = document.querySelector(`.${position}`);
  const playerName = substitute.querySelector('.name').textContent; 
  const playerImage = substitute.querySelector('.photoPlayers').src;
  // Update the terrain div
  const imgElement = terrainPositionDiv.querySelector('img');
  const nameElement = terrainPositionDiv.querySelector(`.nom${position}`); 

  imgElement.src = playerImage; 
  nameElement.textContent = playerName; 

  terrainPositionDiv.querySelector('span').classList.add('hidden'); 
  terrainPositionDiv.style.backgroundImage = 'none'; 

  // Save to local storage
  const playerData = {
    name: playerName,
    image: playerImage
  };
  localStorage.setItem(position, JSON.stringify(playerData)); 

  hidePopup();
}

playerElements.forEach((player) => {
  player.addEventListener('click', () => {
    Array.from(popupContent.children).forEach((child) => {
      if (child.id !== 'closePopup') {
        popupContent.removeChild(child);
      }
    });

    // Add the player to the popup
    if (player.classList.contains('GK')) {
      const GKsubstitutes = document.querySelectorAll('.substitutesGK');
      GKsubstitutes.forEach((substitute) => {
        const clone = substitute.cloneNode(true); 
        popupContent.appendChild(clone);

        clone.addEventListener('click', () => {
          updateTerrain('GK', clone);
        });
      });
    }else {
      
      const positions = ['ST', 'LW', 'RW', 'CM3', 'CM2', 'CM1', 'CB1', 'CB2', 'LB', 'RB',]; 
      positions.forEach((pos) => {
        if (player.classList.contains(pos)) {
          const substitutes = document.querySelectorAll('.substitutesSQ');
          substitutes.forEach((substitute) => {
            const clone = substitute.cloneNode(true); 
            popupContent.appendChild(clone);

            // Add click event to each substitute
            clone.addEventListener('click', () => {
              updateTerrain(pos, clone);
            });
          });
        }
      });
    }

    // Show the popup
    showPopup();
  });
});

closePopupButton.addEventListener('click', hidePopup);

function loadTerrainFromLocalStorage() {
  const positions = ['GK', 'ST', 'LW', 'RW', 'CM3', 'CM2', 'CM1', 'CB1', 'CB2', 'LB', 'RB',]; 

  positions.forEach(position => {
    const playerData = JSON.parse(localStorage.getItem(position)); 
    if (playerData) {
      const terrainPositionDiv = document.querySelector(`.${position}`);
      const imgElement = terrainPositionDiv.querySelector('img');
      const nameElement = terrainPositionDiv.querySelector(`.nom${position}`);

      imgElement.src = playerData.image; 
      nameElement.textContent = playerData.name; 
      nameElement.classList.remove('hidden'); 
      terrainPositionDiv.style.backgroundImage = 'none'; 
      terrainPositionDiv.querySelector('span').classList.add('hidden');
    }
  });
}
document.addEventListener('DOMContentLoaded', loadTerrainFromLocalStorage);
