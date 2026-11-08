import { render } from 'preact';

import { HugeiconsIcon } from '@hugeicons/react';
import { Mortarboard01Icon, Note01Icon, UserGroupIcon, Video01Icon } from '@hugeicons/core-free-icons';

import MagicBento from './MagicBento.jsx';
import './included-bento.css';

const root = document.getElementById('magic-bento-root');
const mount = document.getElementById('magic-bento-mount');

const glyph = icon => <HugeiconsIcon icon={icon} size={18} strokeWidth={1.8} />;

const items = [
  {
    id: 'format',
    label: 'Format',
    title: 'One student, one tutor',
    description: 'Every lap is one-to-one. No shared screens and no rotating groups.',
    icon: glyph(UserGroupIcon)
  },
  {
    id: 'coverage',
    label: 'Coverage',
    title: 'Grades 1–8',
    description: 'Math, English and Science from first grade through eighth.',
    icon: glyph(Mortarboard01Icon)
  },
  {
    id: 'where',
    label: 'Where',
    title: 'Zoom or the library',
    description: 'Join from home, or meet at Twin Hickory Library in Henrico.',
    icon: glyph(Video01Icon)
  },
  {
    id: 'after',
    label: 'After',
    title: 'A written recap',
    description: 'Three wins, one focus and the next-lap plan after every session.',
    icon: glyph(Note01Icon)
  }
];

if (root && mount) {
  render(
    <MagicBento
      items={items}
      columns={4}
      rowHeight={190}
      gap={12}
      radius={20}
      theme="light"
      glowColor="#b00020"
      spotlightRadius={280}
      enableBorderGlow
      enableSpotlight
      clickEffect
    />,
    mount
  );

  root.dataset.mounted = 'true';
}
