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
// TODO: Geo Location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    },
    () => {
      alert("Couldn't get current position");
    }
  );
}
