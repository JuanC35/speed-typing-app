const Timer = require('timer');

// Create a new timer with a duration of 5 seconds
const timer = new Timer(5000);

// Start the timer
timer.start();

// Listen for the 'done' event, which fires when the timer is finished
timer.on('done', () => {
  console.log('Timer finished!');
});

// Optionally, you can also listen for the 'tick' event, which fires every second (by default)
timer.on('tick', () => {
  console.log('Tick');
});
