function ProfilePhoto() {
  let input = document.getElementById('profilePhoto');
  let TextPlayerPhoto = document.getElementById('TextPlayerPhoto');
  let profilePlayer = document.getElementById('profilePlayer');

  if (input.files && input.files[0]) {
    let reader = new FileReader();

    reader.onload = function (e) {
      profilePlayer.src = e.target.result;
      profilePlayer.classList.remove('hidden');
      TextPlayerPhoto.classList.add('hidden');
    };

    reader.readAsDataURL(input.files[0]);
  }
}

// Form 
const positionInput = document.getElementById('position');
const extraAttributes = document.getElementById('extraAttributes');

// Form Position
positionInput.addEventListener('change', (event) => {
  const position = event.target.value;

  if (position === 'GK') {
    extraAttributes.innerHTML = `
          <label class="block text-sm font-medium text-green-300 mb-2">Diving</label>
          <input type="number" id="diving" class="w-full text-black font-bold bg-green-300 rounded-md p-2 mb-2" placeholder="Diving (0-100)" required>
          <label class="block text-sm font-medium text-green-300 mb-2">Handling</label>
          <input type="number" id="handling" class="w-full text-black font-bold bg-green-300 rounded-md p-2 mb-2" placeholder="Handling (0-100)" required>
          <label class="block text-sm font-medium text-green-300 mb-2">Kicking</label>
          <input type="number" id="kicking" class="w-full text-black font-bold bg-green-300 rounded-md p-2 mb-2" placeholder="Kicking (0-100)" required>
          <label class="block text-sm font-medium text-green-300 mb-2">Reflexes</label>
          <input type="number" id="reflexes" class="w-full text-black font-bold bg-green-300 rounded-md p-2 mb-2" placeholder="Reflexes (0-100)" required>
          <label class="block text-sm font-medium text-green-300 mb-2">Speed</label>
          <input type="number" id="speed" class="w-full text-black font-bold bg-green-300 rounded-md p-2 mb-2" placeholder="Speed (0-100)" required>
          <label class="block text-sm font-medium text-green-300 mb-2">Positioning</label>
          <input type="number" id="positioning" class="w-full text-black font-bold bg-green-300 rounded-md p-2 mb-2" placeholder="Positioning (0-100)" required>
        `;
    extraAttributes.classList.remove('hidden');
  } else if (position) {
    extraAttributes.innerHTML = `
          <label class="block text-sm font-medium text-green-300 mb-2">Pace</label>
          <input type="number" id="pace" class="w-full text-black font-bold bg-green-300 rounded-md p-2 mb-2" placeholder="Pace (0-100)" required>
          <label class="block text-sm font-medium text-green-300 mb-2">Shooting</label>
          <input type="number" id="shooting" class="w-full text-black font-bold bg-green-300 rounded-md p-2 mb-2" placeholder="Shooting (0-100)" required>
          <label class="block text-sm font-medium text-green-300 mb-2">Passing</label>
          <input type="number" id="passing" class="w-full text-black font-bold bg-green-300 rounded-md p-2 mb-2" placeholder="Passing (0-100)" required>
          <label class="block text-sm font-medium text-green-300 mb-2">Dribbling</label>
          <input type="number" id="dribbling" class="w-full text-black font-bold bg-green-300 rounded-md p-2 mb-2" placeholder="Dribbling (0-100)" required>
          <label class="block text-sm font-medium text-green-300 mb-2">Defending</label>
          <input type="number" id="defending" class="w-full text-black font-bold bg-green-300 rounded-md p-2 mb-2" placeholder="Defending (0-100)" required>
          <label class="block text-sm font-medium text-green-300 mb-2">Physical</label>
          <input type="number" id="physical" class="w-full text-black font-bold bg-green-300 rounded-md p-2 mb-2" placeholder="Physical (0-100)" required>
        `;
    extraAttributes.classList.remove('hidden');
  } else {
    extraAttributes.innerHTML = '';
    extraAttributes.classList.add('hidden');
  }
});
