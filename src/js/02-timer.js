import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const startBtn = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let selectedDate;
startBtn.disabled = true;
const date = Date.now();
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= date) {
      startBtn.disabled = true;
      window.alert('Please choose a date in the future');
      return;
    } else {
      startBtn.disabled = false;
    }
  },
};

const datePicker = flatpickr('#datetime-picker', options);

class Timer {
  constructor() {
    this.intervalId = null;
  }

  start() {
    if (this.intervalId !== null) {
      return;
    }
    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = selectedDate - currentTime;
      const { days, hours, minutes, seconds } = convertMs(deltaTime);
      updateClockFace({ days, hours, minutes, seconds });
    }, 1000);
  }

  stop() {
    clearINterval(this.intervalId);
    this.intervalId = null;
  }
}

const timer = new Timer();

function updateClockFace({ days, hours, minutes, seconds }) {
  daysValue.textContent = days;
  hoursValue.textContent = hours;
  minutesValue.textContent = minutes;
  secondsValue.textContent = seconds;
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = pad(Math.floor(ms / day));
  const hours = pad(Math.floor((ms % day) / hour));
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000));
console.log(convertMs(140000));
console.log(convertMs(24140000));

startBtn.addEventListener('click', () => {
  const selectedDates = datePicker.selectedDates;
  if (selectedDates.length > 0) {
    selectedDate = selectedDates[0];
    timer.start();
  }
});
