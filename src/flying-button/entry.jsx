import { render } from 'preact';
import FlyingButton from './FlyingButton.jsx';

const pad = document.getElementById('flying-button-root');

if (pad) {
  pad.dataset.mounted = 'true';
  pad.querySelector('.launch-fallback')?.remove();
  render(
    <FlyingButton
      theme="dark"
      size="large"
      altitude={170}
      hoverTime={2.4}
      jets={2}
      thrusters
      trigger="hover"
      carryCursor
      smoke={1}
      turbulence={1}
      wobble={1}
      ramp={false}
      thrustColor="#8ec5ff"
      smokeColor="#eef1f6"
      onClick={() => document.getElementById('launch-cta')?.click()}
    >
      Take off
    </FlyingButton>,
    pad
  );
}
