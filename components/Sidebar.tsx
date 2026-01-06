import React from 'react';
import { Module, Lesson, ViewState } from '../types';
import { ICONS } from '../constants';
import { CheckCircle, Lock, PlayCircle, MessageSquare } from 'lucide-react';

interface SidebarProps {
  modules: Module[];
  currentLessonId: string | null;
  onSelectLesson: (lesson: Lesson) => void;
  onSelectChat: () => void;
  viewState: ViewState;
  completedLessons: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  modules, 
  currentLessonId, 
  onSelectLesson, 
  onSelectChat,
  viewState,
  completedLessons
}) => {
  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 h-screen flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-yellow-400">
          Dart<span className="text-white">To</span>Python
        </h1>
        <p className="text-xs text-slate-400 mt-1">Senior Engineer Track (uv edition)</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <button
          onClick={onSelectChat}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
            viewState === ViewState.CHAT
              ? 'bg-blue-600/20 text-blue-400 border border-blue-600/50'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-transparent'
          }`}
        >
          <MessageSquare size={18} />
          <span className="font-medium">Ask the Mentor</span>
        </button>

        {modules.map((module) => (
          <div key={module.id} className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-2">
              {module.title}
            </h2>
            <div className="space-y-1">
              {module.lessons.map((lesson) => {
                const Icon = ICONS[lesson.category];
                const isCompleted = completedLessons.includes(lesson.id);
                const isActive = currentLessonId === lesson.id && viewState === ViewState.LESSON;
                
                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left group ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                  >
                    <div className={`
                      p-1.5 rounded-md flex-shrink-0
                      ${isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}
                    `}>
                      <Icon size={14} />
                    </div>
                    <span className="flex-1 truncate">{lesson.title}</span>
                    {isCompleted ? (
                      <CheckCircle size={14} className="text-green-500" />
                    ) : isActive ? (
                      <PlayCircle size={14} className="text-blue-400 animate-pulse" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-slate-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>Progress</span>
          <span>{Math.round((completedLessons.length / modules.flatMap(m => m.lessons).length) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-yellow-400 transition-all duration-500"
            style={{ width: `${(completedLessons.length / modules.flatMap(m => m.lessons).length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
