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

// validation form--------------------------------------------------------------------

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
      !playerName.value.trim() || playerName.value.length < 3 || playerName.value.length > 20
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
    const GKelement = ['diving', 'handling', 'kicking', 'reflexes', 'speed', 'positioning'];
    const SQelement = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];
    const gkDiv = document.getElementById('extraAttributesGK');
    const sqDiv = document.getElementById('extraAttributesSQ');
    let calculatedRating = 0;
  
    const calculateRating = (attributes, divisor) => {
      let total = 0;
      attributes.forEach((attr) => {
        const input = document.getElementById(attr);
        validateInput(input, !input.value || isNaN(input.value) || input.value < 10 || input.value > 99);
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

  function addPlayerToSubstitutes() {
    // Validate form and calculate rating
    if (!validateAndCalculateRating()) return;
  
    // player details--------------------------------------------------
    const name = document.getElementById('name').value.trim();
    const position = document.getElementById('position').value;
    const nationalityFile = document.getElementById('flag').files[0];
    const clubFile = document.getElementById('logo').files[0];
    const rating = document.getElementById('rating').textContent.trim();
    const photoFile = document.getElementById('profilePhoto').files[0];
  
    const GKelement = ['diving', 'handling', 'kicking', 'reflexes', 'speed', 'positioning'];
    const SQelement = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];
  
    // position section--------------------------------------------------
    const targetSection = position === 'GK'
      ? document.querySelector('.substitutesGK')
      : document.querySelector('.substitutesSQ');
  
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
      timer: 1000,
    });
    // Clear form------------------------------------------------------------
    document.getElementById('playerForm').reset();
    // clear rating------------------------------------------------------------
    document.getElementById('rating').textContent = '--';
  }
  
  //  event listener---------------------------------------------------------------
  document.getElementById('addPlayerButton').addEventListener('click', addPlayerToSubstitutes);
  
  
