'use strict';

// prettier-ignore

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const sideBar = document.querySelector('.sidebar');
const copyRight = document.querySelector('.copyright');
const startBtn = document.querySelector('.start-button');
const mapDiv = document.querySelector('#map');
const messageDiv = document.querySelector('.messages');
startBtn.addEventListener('click', function () {
  // sideBar.style.width = '500px';
  startBtn.style.display = 'none';
  startBtn.style.opacity = 0;
  copyRight.style.opacity = '0';
  mapDiv.style.pointerEvents = 'initial';
  messageDiv.style.display = 'block';
});
class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; //in km
    this.duration = duration; //in min
  }
  _setDiscription() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.discription = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()] //months[3]
    } ${this.date.getDate()}`;
    console.log(this.discription);
  }
}
console.log(new Date().getMonth());
class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPase();
    this._setDiscription();
  }
  calcPase() {
    this.pase = this.duration / this.distance;
    return this.pase;
  }
}
class Cycle extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDiscription();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
const run = new Running([[39, -12], 5.2, 24, 78]);
const cycle = new Cycle([[39, -12], 27, 95, 523]);
console.log(run, cycle);
// ======================================= ===================
class App {
  #map;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }
  _getPosition() {
    // GeoLocation
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),

      function () {
        alert('Could not find GeoLocation');
      }
    );
  }
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    console.log(position);
    const coords = [latitude, longitude];
    console.log(this);
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    // Handel clicks on the map
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    messageDiv.classList.add('messages-fade');
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _hideForm() {
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(function () {
      form.style.display = 'grid';
      // console.log('ok');
    }, 1000);
  }
  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every((input) => Number.isFinite(input));

    const allPoistive = (...inputs) => inputs.every((input) => input > 0);

    e.preventDefault();
    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;
    // If workout running, create running obj
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // Check if data is valid
      if (
        !validInputs(distance, duration, cadence) ||
        !allPoistive(distance, duration)
      )
        console.log('Invalid distance!');
      workout = new Running([lat, lng], distance, duration, cadence);
    }
    //================================================================================================================
    // If workout cycling, create cycling obj
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !validInputs(distance, duration, elevation) ||
        !allPoistive(distance, duration)
      )
        console.log('Invalid distance!');
      workout = new Cycle([lat, lng], distance, duration, elevation);
    }
    // Add new obj to workout array
    this.#workouts.push(workout);
    console.log(workout);
    //
    // Clear inputs forms .
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    // Render workout on map as marker
    this._renderWorkoutMarker(workout);
    this._renderWorkout(workout);

    // hide form
    this._hideForm();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♀️' : '🏃‍♂️'}${workout.discription}`
      )
      .openPopup();
  }
  _renderWorkout(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
              <h2 class="workout__title">${workout.discription}</h2>
              <div class="workout__details">
                <span class="workout__icon">${
                  workout.type === 'running' ? '🏃‍♀️' : '🏃‍♂️'
                }</span>
                <span class="workout__value">${workout.distance}</span>
                <span class="workout__unit">km</span>
              </div>
                   <div class="workout__details">
                <span class="workout__icon">⏱</span>
                <span class="workout__value">${workout.duration}</span>
                <span class="workout__unit">min</span>
              </div>`;
    if (workout.type === 'running') {
      html += `      <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.pase.toFixed(1)}</span>
                <span class="workout__unit">min/km</span>
              </div>
              <div class="workout__details">
                <span class="workout__icon">🦶🏼</span>
                <span class="workout__value">${workout.cadence}</span>
                <span class="workout__unit">spm</span>
              </div>
            </li>
    `;
      if (workout.type === 'cycling') {
        html += `<div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.speed.toFixed(1)}</span>
                <span class="workout__unit">km/h</span>
              </div>
              <div class="workout__details">
                <span class="workout__icon">⛰</span>
                <span class="workout__value">${workout.elevationGain}</span>
                <span class="workout__unit">m</span>
              </div> </li>`;
      }
    }
    form.insertAdjacentHTML('afterend', html);
  }
  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    console.log(workoutEl);
    if (!workoutEl);
    const workout = this.#workouts.find(function (work) {
      work.id === workoutEl.dataset.id;
    });
    console.log(workout);
    this.#map.setView(this.#workouts.coords, 13);
  }
}
const app = new App();
