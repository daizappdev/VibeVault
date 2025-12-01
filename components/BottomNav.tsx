import React from 'react';
import { Home, PlusSquare, BookOpen, User } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  const getIconColor = (view: ViewState) => {
    return currentView === view ? 'text-vault-pop' : 'text-vault-muted';
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-vault-card/95 backdrop-blur-md border-t border-white/5 pb-6 pt-4 px-8 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <button 
          onClick={() => onChangeView('HOME')}
          className="flex flex-col items-center gap-1 transition-transform active:scale-95"
        >
          <Home size={24} className={getIconColor('HOME')} />
        </button>

        <button 
          onClick={() => onChangeView('CREATE_POST')}
          className="flex flex-col items-center gap-1 transition-transform active:scale-95"
        >
          <PlusSquare size={28} className={currentView === 'CREATE_POST' ? 'text-vault-pop' : 'text-white'} />
        </button>

        <button 
          onClick={() => onChangeView('SCRAPBOOK')}
          className="flex flex-col items-center gap-1 transition-transform active:scale-95"
        >
          <BookOpen size={24} className={getIconColor('SCRAPBOOK')} />
        </button>
        
        <button 
          onClick={() => onChangeView('PROFILE')}
          className="flex flex-col items-center gap-1 transition-transform active:scale-95"
        >
          <User size={24} className={getIconColor('PROFILE')} />
        </button>
      </div>
    </div>
  );
};