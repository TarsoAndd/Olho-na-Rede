import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MissionsPage from './pages/MissionsPage';
import LearnPage from './pages/LearnPage';
import QuizPage from './pages/QuizPage';
import { UserProgress } from './types';
import { loadProgress } from './store/progressStore';

type Page = 'home' | 'missions' | 'learn' | 'quiz';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  function handleNavigate(p: string) {
    setPage(p as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-cyber-dark">
      <Navbar activePage={page} onNavigate={handleNavigate} progress={progress} />

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {page === 'home' && (
            <HomePage progress={progress} onNavigate={handleNavigate} />
          )}
          {page === 'missions' && (
            <MissionsPage progress={progress} onProgressUpdate={setProgress} />
          )}
          {page === 'learn' && (
            <LearnPage />
          )}
          {page === 'quiz' && (
            <QuizPage progress={progress} onProgressUpdate={setProgress} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
