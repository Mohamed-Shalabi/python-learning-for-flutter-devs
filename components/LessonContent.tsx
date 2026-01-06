import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Lesson, GeneratedContent } from '../types';
import { generateLessonContent } from '../services/geminiService';
import { Loader2, AlertCircle, Check, X, ArrowRight } from 'lucide-react';

interface LessonContentProps {
  lesson: Lesson;
  onComplete: () => void;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson, onComplete }) => {
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      setLoading(true);
      setError(null);
      setContent(null);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);

      try {
        const data = await generateLessonContent(lesson.title, lesson.description);
        if (isMounted) setContent(data);
      } catch (err) {
        if (isMounted) setError("Failed to generate content.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadContent();

    return () => { isMounted = false; };
  }, [lesson.id]);

  const handleQuizSubmit = () => {
    if (selectedQuizOption === null) return;
    setQuizSubmitted(true);
    if (content?.quiz && selectedQuizOption === content.quiz.correctIndex) {
      onComplete();
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 text-slate-400 animate-in fade-in duration-300">
        <Loader2 size={40} className="animate-spin text-blue-500" />
        <p>Generating personalized lesson for "{lesson.title}"...</p>
        <p className="text-xs text-slate-500">Consulting the Python Oracles (Gemini 3 Flash)...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-red-400 space-y-2">
        <AlertCircle size={40} />
        <p>{error || "Unknown error occurred"}</p>
        <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 text-white text-sm"
        >
            Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 pb-20">
      <div className="prose prose-invert prose-slate max-w-none">
        <div className="mb-8 pb-6 border-b border-slate-800">
          <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
          <p className="text-lg text-slate-400">{lesson.description}</p>
        </div>

        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="rounded-lg overflow-hidden my-6 border border-slate-700 shadow-xl">
                  <div className="bg-slate-800 px-4 py-1.5 text-xs text-slate-400 flex items-center justify-between">
                    <span className="font-mono font-bold uppercase">{match[1]}</span>
                    {match[1] === 'dart' && <span className="text-blue-400">Your Knowledge</span>}
                    {match[1] === 'python' && <span className="text-yellow-400">Target</span>}
                  </div>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ margin: 0, borderRadius: 0 }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="bg-slate-800 text-red-300 px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
                  {children}
                </code>
              );
            },
            h2: ({children}) => <h2 className="text-2xl font-semibold text-white mt-10 mb-4 pb-2 border-b border-slate-800/50">{children}</h2>,
            h3: ({children}) => <h3 className="text-xl font-medium text-blue-200 mt-8 mb-3">{children}</h3>,
            ul: ({children}) => <ul className="list-disc list-outside space-y-2 text-slate-300 ml-5 mb-6">{children}</ul>,
            li: ({children}) => <li className="pl-1">{children}</li>,
            p: ({children}) => <p className="text-slate-300 leading-relaxed mb-4">{children}</p>,
            blockquote: ({children}) => (
                <blockquote className="border-l-4 border-yellow-500/50 bg-yellow-500/5 pl-4 py-2 my-6 italic text-slate-400 rounded-r-lg">
                    {children}
                </blockquote>
            )
          }}
        >
          {content.markdown}
        </ReactMarkdown>

        {content.quiz && (
          <div className="mt-16 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm">?</span>
                Knowledge Check
            </h3>
            <p className="text-lg text-slate-200 mb-6">{content.quiz.question}</p>
            
            <div className="space-y-3">
              {content.quiz.options.map((option, index) => (
                <button
                  key={index}
                  disabled={quizSubmitted}
                  onClick={() => setSelectedQuizOption(index)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    quizSubmitted
                      ? index === content.quiz!.correctIndex
                        ? 'bg-green-500/10 border-green-500/50 text-green-200'
                        : index === selectedQuizOption
                        ? 'bg-red-500/10 border-red-500/50 text-red-200'
                        : 'bg-slate-800/50 border-transparent text-slate-500 opacity-50'
                      : selectedQuizOption === index
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-800 border-transparent hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {quizSubmitted && index === content.quiz!.correctIndex && (
                        <Check size={20} className="text-green-400" />
                    )}
                    {quizSubmitted && index === selectedQuizOption && index !== content.quiz!.correctIndex && (
                        <X size={20} className="text-red-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {!quizSubmitted && selectedQuizOption !== null && (
                <button 
                    onClick={handleQuizSubmit}
                    className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    Submit Answer <ArrowRight size={18} />
                </button>
            )}

             {quizSubmitted && (
                 <div className={`mt-6 p-4 rounded-lg text-center font-medium ${
                     selectedQuizOption === content.quiz.correctIndex ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                 }`}>
                     {selectedQuizOption === content.quiz.correctIndex 
                        ? "Correct! Lesson marked as completed." 
                        : "Incorrect. Review the content and try again."}
                 </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonContent;
