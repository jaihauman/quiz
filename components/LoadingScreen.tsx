import React from 'react';
import { Icon } from './Icon';

interface LoadingScreenProps {
  topic: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ topic }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 space-y-8 animate-fade-in">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
           <Icon name="BrainCircuit" className="text-primary-600 w-10 h-10 animate-pulse" />
        </div>
      </div>
      
      <div className="space-y-3 max-w-md">
        <h2 className="text-2xl font-bold text-slate-800">परीक्षा तैयार हो रही है...</h2>
        <p className="text-slate-500">
          हमारा AI {topic} के नवीनतम पाठ्यक्रम और पैटर्न का विश्लेषण करके आपके लिए एक टेस्ट बना रहा है।
        </p>
      </div>

      <div className="flex gap-2">
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-75"></div>
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-150"></div>
      </div>
    </div>
  );
};
