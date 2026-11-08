import { render } from 'preact';

import { HugeiconsIcon } from '@hugeicons/react';
import { CodeIcon, File01Icon, Folder01Icon, Note01Icon, Pdf01Icon } from '@hugeicons/core-free-icons';

import AnimatedList from './AnimatedList.jsx';
import './lap-pack.css';

const root = document.getElementById('animated-list-root');
const mount = document.getElementById('animated-list-mount');
const status = document.getElementById('lap-pack-status');

const glyph = icon => <HugeiconsIcon icon={icon} size={18} strokeWidth={1.8} />;

const items = [
  {
    icon: glyph(Note01Icon),
    title: 'Session plan',
    description: 'Grade, topic and the one goal for the lap',
    meta: 'Before'
  },
  {
    icon: glyph(Pdf01Icon),
    title: 'Practice set',
    description: 'The exact questions worked through in the lap',
    meta: 'PDF'
  },
  {
    icon: glyph(CodeIcon),
    title: 'Worked notes',
    description: 'Every example written out in full',
    meta: 'After'
  },
  {
    icon: glyph(File01Icon),
    title: 'Progress note',
    description: 'Three wins and one focus for next time',
    meta: '24 h'
  },
  {
    icon: glyph(Folder01Icon),
    title: 'Next-lap plan',
    description: 'What the next session picks up first',
    meta: '48 h'
  }
];

if (root && mount) {
  render(
    <AnimatedList
      items={items}
      onItemSelect={item => {
        if (status) status.textContent = `${item.title}: ${item.description}.`;
      }}
      animation="pop"
      stagger={0.06}
      maxHeight={340}
      width="100%"
      radius={12}
      gap={7}
    />,
    mount
  );

  root.dataset.mounted = 'true';
}
