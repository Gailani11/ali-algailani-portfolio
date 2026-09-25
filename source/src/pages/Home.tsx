import { useEffect } from 'react';
import { Hero } from '../sections/Hero';
import { About } from '../sections/About';
import { Contents } from '../sections/Contents';
import { Logos } from '../sections/Logos';
import { Identities } from '../sections/Identities';
import { UIUX } from '../sections/UIUX';
import { Profiles } from '../sections/Profiles';
import { Print } from '../sections/Print';
import { Social } from '../sections/Social';
import { Statement, Finale } from '../sections/Finale';
import { observeReveals } from '../lib/reveal';

/**
 * The book, front to back: cover → welcome → about → contents → six chapters →
 * statement → thank-you. The rhythm alternates ink and paper like the PDF's spreads.
 */
export function Home() {
  useEffect(() => {
    observeReveals();
  }, []);
  return (
    <>
      <Hero />
      <About />
      <Contents />
      <Logos />
      <Identities />
      <UIUX />
      <Profiles />
      <Print />
      <Social />
      <Statement />
      <Finale />
    </>
  );
}
