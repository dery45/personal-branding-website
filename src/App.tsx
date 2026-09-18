import { Suspense, lazy } from 'react';
import { useTranslation } from './context/LanguageContext';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { SplashScreen } from './components/layout/SplashScreen';
// Above the fold: eager. Everything below the fold is code-split so the
// initial bundle stays small; chunks load in parallel and render in place
// (all Suspense fallbacks are null → no layout shift, no spinners).
import { Hero } from './components/sections/Hero';
import { PersonalMotto } from './components/sections/PersonalMotto';

const Experience = lazy(() =>
  import('./components/sections/Experience').then((m) => ({ default: m.Experience })),
);
const Projects = lazy(() =>
  import('./components/sections/Projects').then((m) => ({ default: m.Projects })),
);
const Education = lazy(() =>
  import('./components/sections/Education').then((m) => ({ default: m.Education })),
);
const Achievements = lazy(() =>
  import('./components/sections/Achievements').then((m) => ({ default: m.Achievements })),
);
const Portfolio = lazy(() =>
  import('./components/sections/Portfolio').then((m) => ({ default: m.Portfolio })),
);
const Contact = lazy(() =>
  import('./components/sections/Contact').then((m) => ({ default: m.Contact })),
);
const Thanks = lazy(() =>
  import('./components/sections/Thanks').then((m) => ({ default: m.Thanks })),
);

function App() {
  const { t } = useTranslation();
  return (
    <>
      <a href="#main" className="skip-link">
        {t('a11y.skipToContent')}
      </a>
      <SplashScreen />
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <PersonalMotto />
        <Suspense fallback={null}>
          <Experience />
          <Projects />
          <Education />
          <Achievements />
          <Portfolio />
          <Contact />
          <Thanks />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;
