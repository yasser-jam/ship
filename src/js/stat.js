// FILE FOR MANIPULATING PHYSICS VALUES FROM CUSTOM INTERFACE
let speed; // speed variable
let time; // time variable

export const setSpeed = (s) => {
  speed = s.toFixed(3);

  update();
};

export const setTime = (t) => {
  time = t.toFixed(0);

  update();
};

const div = document.createElement('div');
document.body.append(div);

div.id = 'card';

const update = () => {
  const statCard = `
<div class="card">
        <div>
            <div class="text-sm">Ship Velocity</div>
            <div class="text-lg">${speed} m/s</div>
        </div>

        <div>
            <div class="text-sm">Scene Time</div>
            <div class="text-lg">${time}s</div>
        </div>
    </div>
`;

  document.querySelector('#card').innerHTML = statCard;
};
