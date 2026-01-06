import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LessonContent from './components/LessonContent';
import ChatInterface from './components/ChatInterface';
import { INITIAL_MODULES } from './constants';
import { Lesson, ViewState } from './types';
import { Rocket } from 'lucide-react';

const App: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [viewState, setViewState] = useState<ViewState>(ViewState.ROADMAP);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  // Initialize with the first available lesson
  useEffect(() => {
    // Check if we have an API key, if not, we might want to show a warning, 
    // but the sub-components handle gracefully.
  }, []);

  const handleSelectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setViewState(ViewState.LESSON);
  };

  const handleLessonComplete = () => {
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons(prev => [...prev, currentLesson.id]);
    }
  };

  const renderContent = () => {
    switch (viewState) {
      case ViewState.CHAT:
        return <ChatInterface />;
      case ViewState.LESSON:
        if (currentLesson) {
          return (
            <LessonContent 
              lesson={currentLesson} 
              onComplete={handleLessonComplete} 
            />
          );
        }
        return <div className="text-white">Select a lesson</div>;
      case ViewState.ROADMAP:
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-yellow-400 p-1">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <Rocket size={48} className="text-white" />
                </div>
            </div>
            <h1 className="text-4xl font-bold text-white">
              Welcome, <span className="text-blue-400">Flutter Expert</span>.
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl">
              Ready to add Python to your arsenal? This course is generated dynamically 
              to map your Dart knowledge directly to Python concepts, using the modern 
              <code className="bg-slate-800 px-2 py-1 rounded text-yellow-300 mx-1">uv</code> toolchain.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-2xl text-left">
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                    <h3 className="font-bold text-blue-400 mb-2">Why uv?</h3>
                    <p className="text-sm text-slate-400">Forget pip and venv. `uv` is the `flutter pub` of Python. It handles everything faster and cleaner.</p>
                </div>
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                    <h3 className="font-bold text-yellow-400 mb-2">Adaptive Learning</h3>
                    <p className="text-sm text-slate-400">Lessons adapt to your Senior level. No "what is a variable" tutorials here. Straight to the complex stuff.</p>
                </div>
            </div>
            <button 
                onClick={() => {
                    const firstLesson = INITIAL_MODULES[0].lessons[0];
                    handleSelectLesson(firstLesson);
                }}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-full shadow-lg shadow-blue-500/25 transition-all transform hover:scale-105"
            >
                Start Journey
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <Sidebar 
        modules={INITIAL_MODULES} 
        currentLessonId={currentLesson?.id || null}
        onSelectLesson={handleSelectLesson}
        onSelectChat={() => setViewState(ViewState.CHAT)}
        viewState={viewState}
        completedLessons={completedLessons}
      />
      
      <main className="flex-1 h-screen overflow-hidden relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
             style={{ 
                 backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', 
                 backgroundSize: '24px 24px' 
             }} 
        />
        
        <div className="relative z-10 h-full overflow-y-auto">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
