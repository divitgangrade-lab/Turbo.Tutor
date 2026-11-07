import { render } from 'preact';
import SplitFlapText from './SplitFlapText.jsx';

const host = document.getElementById('split-flap-root');

if (host) {
  host.dataset.mounted = 'true';
  render(
    <SplitFlapText
      words={['PLANS READY', 'ZOOM ONLINE', 'KART OPEN']}
      flipDuration={0.14}
      stagger={0.035}
      cycleDelay={2600}
      charset="alphanumeric"
      flipsPerChar={5}
      tileColor="#12161a"
      textColor="#ffd400"
      tileRadius={2}
      gap={3}
      fontSize={18}
      loop
      padTo={12}
      align="left"
      intro
      glare={0.25}
      depth={0.35}
      order="center"
      tileStyle="board"
      className="launch-board-flaps"
    />,
    host
  );
}
