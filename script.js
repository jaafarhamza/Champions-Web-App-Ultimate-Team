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

function addPlayerToSubstitutes() {
  if (!validateAndCalculateRating()) return;

  // player details--------------------------------------------------
  const name = document.getElementById('name').value.trim();
  const position = document.getElementById('position').value;
  const nationalityFile = document.getElementById('flag').files[0];
  const clubFile = document.getElementById('logo').files[0];
  const rating = document.getElementById('rating').textContent.trim();
  const photoFile = document.getElementById('profilePhoto').files[0];

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

  // position section--------------------------------------------------

  const targetSection =
    position === 'GK'
      ? document.querySelector('.substitutesGK')
      : document.querySelector('.substitutesSQ');

  // add more players--------------------------------------------------
  const morePlayers = targetSection.cloneNode(true);
  targetSection.parentElement.appendChild(morePlayers);

  if (position === 'GK') {
    targetSection.parentElement
      .querySelector('.substitutesGK')
      .classList.remove('hidden');
  } else {
    targetSection.parentElement
      .querySelector('.substitutesSQ')
      .classList.remove('hidden');
  }

  // player card----------------------------------------------------------------
  const substitute = (selector, value) => {
    const element = targetSection.querySelector(selector);
    if (element) element.textContent = value;
  };

  const setImage = (selector, file) => {
    const image = targetSection.querySelector(selector);
    if (file && image) {
      image.src = URL.createObjectURL(file);
      image.classList.remove('hidden');
    }
  };

  setImage('.photoPlayers', photoFile);
  setImage('.photoNation', nationalityFile);
  setImage('.photoClub', clubFile);

  substitute('.rating', rating);
  substitute('.position', position);
  substitute('.name', name);

  // substitute attributes-----------------------------------------------------------
  const attributes = position === 'GK' ? GKelement : SQelement;
  attributes.forEach((attr) => {
    substitute(`.${attr}`, document.getElementById(attr).value.trim() || 'N/A');
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

//  event listener---------------------------------------------------------------
document
  .getElementById('addPlayerButton')
  .addEventListener('click', addPlayerToSubstitutes);
