import { render } from 'preact';

import ScrollStack, { ScrollStackItem } from './ScrollStack.jsx';
import './term-stack.css';

const root = document.getElementById('scroll-stack-root');
const mount = document.getElementById('scroll-stack-mount');

const cards = [
  {
    n: '01',
    tag: 'Lap 1',
    title: 'Diagnose',
    body: 'A short check of last term’s work, in the student’s own handwriting. We find the one gap that is holding everything else back before adding anything new.',
    meta: 'One 45-minute lap · written summary'
  },
  {
    n: '02',
    tag: 'Laps 2–6',
    title: 'Build',
    body: 'One idea at a time, worked in front of the student and then repeated back. Practice stays short enough to finish, so the habit is accuracy rather than speed.',
    meta: 'Weekly laps · notes after each'
  },
  {
    n: '03',
    tag: 'Laps 7–10',
    title: 'Apply',
    body: 'The same ideas inside timed questions and real paper layouts. We rehearse the first thirty seconds of an exam question until the entry point is automatic.',
    meta: 'Timed sets · marked together'
  },
  {
    n: '04',
    tag: 'Every 4 laps',
    title: 'Review',
    body: 'We stop, look back at the work and reset the plan. Parents get a plain-language note on what moved, what did not, and what the next four laps should cover.',
    meta: 'Progress note · next-lap plan'
  }
];

if (root && mount) {
  render(
    <ScrollStack
      itemDistance={92}
      itemStackDistance={18}
      stackPosition={96}
      itemScale={0.04}
      baseScale={0.86}
      dimAmount={0.14}
      holdDistance={180}
      smoothScroll={false}
      useWindowScroll
    >
      {cards.map(card => (
        <ScrollStackItem key={card.n}>
          <div class="term-card">
            <div class="term-card-top">
              <span class="term-card-n" aria-hidden="true">
                {card.n}
              </span>
              <span class="term-card-tag">{card.tag}</span>
            </div>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <p class="term-card-meta">{card.meta}</p>
          </div>
        </ScrollStackItem>
      ))}
    </ScrollStack>,
    mount
  );

  root.dataset.mounted = 'true';
}
