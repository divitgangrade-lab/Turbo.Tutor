import { render } from 'preact';
import ParticleText from './ParticleText.jsx';

const host = document.getElementById('particle-text-root');

if (host) {
  host.dataset.mounted = 'true';
  render(
    <ParticleText
      text="TURBO TUTOR"
      particleSize={1.5}
      density={5}
      color="#7f8a91"
      highlightColor="#ffd400"
      highlightMode="motion"
      shape="circle"
      intro="gather"
      scatter={120}
      gatherDuration={1800}
      stagger={350}
      clickBurst={false}
      pointerRepel={0}
      idleDrift={0.25}
      trigger="mount"
      fontSize="clamp(3rem, 10vw, 7.5rem)"
      fontWeight={900}
      fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif"
      glow={false}
      className="footer-particle-wordmark"
    />,
    host
  );
}
