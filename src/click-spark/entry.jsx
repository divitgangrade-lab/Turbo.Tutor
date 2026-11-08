import { render } from 'preact';

import ClickSpark from './ClickSpark.jsx';
import './ClickSpark.css';

const host = document.getElementById('click-spark-root');

if (host) {
  render(
    <ClickSpark
      sparkColor={['#ffd400', '#e10600', '#f7f5f0']}
      sparkSize={12}
      sparkRadius={28}
      sparkCount={10}
      sparkWidth={1.8}
      duration={520}
      easing="ease-out"
      randomness={0.3}
      glow={0.4}
    />,
    host
  );
  host.dataset.mounted = 'true';
}
