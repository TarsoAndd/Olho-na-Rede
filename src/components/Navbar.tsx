import { Shield, Trophy, BookOpen, Gamepad2, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserProgress } from '../types';
import { getCompletedCount } from '../store/progressStore';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  progress: UserProgress;
}

export default function Navbar({ activePage, onNavigate, progress }: NavbarProps) {
  const completedCount = getCompletedCount(progress);
  const totalGames = 5;

  const navItems = [
    { id: 'home', label: 'Início', icon: Shield },
    { id: 'missions', label: 'Missões', icon: Gamepad2 },
    { id: 'learn', label: 'Aprender', icon: BookOpen },
    { id: 'quiz', label: 'Quiz Final', icon: HelpCircle },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-cyber-cyan/20 rounded-none">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg hidden sm:block">
            <span className="text-cyber-cyan">Cyber</span>
            <span className="text-white">Quest</span>
          </span>
        </motion.button>

        {/* Nav Items */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={16} />
                <span className="hidden md:block">{item.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Progress + Score */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-cyber-blue/20 rounded-lg px-3 py-1.5 border border-cyber-blue/30">
            <Trophy size={14} className="text-yellow-400" />
            <span className="text-sm font-bold text-yellow-400">{progress.totalScore}</span>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-slate-400">Nível {progress.level}</span>
            <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full"
                style={{ width: `${(progress.xp / progress.xpToNextLevel) * 100}%` }}
                layoutId="xp-bar"
              />
            </div>
          </div>
          <div className="flex items-center gap-1 bg-cyber-green/20 rounded-lg px-2 py-1.5 border border-cyber-green/30">
            <span className="text-xs font-semibold text-cyber-green">{completedCount}/{totalGames}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
