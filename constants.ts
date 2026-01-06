import { Module } from './types';
import { BookOpen, Terminal, Cpu, Layers, Zap, Database } from 'lucide-react';

export const INITIAL_MODULES: Module[] = [
  {
    id: 'm1',
    title: 'The Setup & Paradigm Shift',
    lessons: [
      {
        id: 'l1-1',
        title: 'Goodbye Pub, Hello uv',
        description: 'Modern Python project management. Why uv replaces pip/venv/poetry and how it maps to pubspec.yaml.',
        category: 'tooling',
        status: 'unlocked',
      },
      {
        id: 'l1-2',
        title: 'The Type System (or lack thereof?)',
        description: 'Gradual typing in Python vs Dart\'s sound null safety. Type hints, MyPy, and runtime behavior.',
        category: 'basics',
        status: 'unlocked',
      },
      {
        id: 'l1-3',
        title: 'Top-Level vs Classes',
        description: 'Understanding Python scripts, entry points (`if __name__ == "__main__"`), and modules vs Dart libraries.',
        category: 'basics',
        status: 'unlocked',
      },
    ],
  },
  {
    id: 'm2',
    title: 'Data Structures Deep Dive',
    lessons: [
      {
        id: 'l2-1',
        title: 'Lists are NOT Arrays',
        description: 'Python Lists vs Dart Lists. Slicing [::], list comprehensions (the map/filter killer), and mutability.',
        category: 'basics',
        status: 'locked',
      },
      {
        id: 'l2-2',
        title: 'Dicts vs Maps',
        description: 'The hash map power. Dict comprehensions, .get(), and key restrictions.',
        category: 'basics',
        status: 'locked',
      },
      {
        id: 'l2-3',
        title: 'Tuples & Sets',
        description: 'Things Dart barely has (Records are close). Why immutability matters in Python hashing.',
        category: 'basics',
        status: 'locked',
      },
    ],
  },
  {
    id: 'm3',
    title: 'Advanced OOP & Magic',
    lessons: [
      {
        id: 'l3-1',
        title: 'Dunder Methods (Magic Methods)',
        description: '`__init__`, `__str__`, `__call__`. Implementing operator overloading the Python way.',
        category: 'advanced',
        status: 'locked',
      },
      {
        id: 'l3-2',
        title: 'Decorators: Annotations on Steroids',
        description: 'Meta-programming functions. How `@decorator` actually works (it\'s just a wrapper function).',
        category: 'advanced',
        status: 'locked',
      },
      {
        id: 'l3-3',
        title: 'Inheritance & Mixins',
        description: 'True multiple inheritance vs Dart Mixins. The MRO (Method Resolution Order).',
        category: 'advanced',
        status: 'locked',
      },
    ],
  },
  {
    id: 'm4',
    title: 'Async & Concurrency',
    lessons: [
      {
        id: 'l4-1',
        title: 'Asyncio Event Loop',
        description: 'Comparison with Dart\'s Event Loop. `async`/`await` keywords are the same, but the runtime is different.',
        category: 'async',
        status: 'locked',
      },
      {
        id: 'l4-2',
        title: 'Generators & Yield',
        description: 'Dart Streams vs Python Generators. `yield` and `yield from`. Lazy evaluation.',
        category: 'async',
        status: 'locked',
      },
      {
        id: 'l4-3',
        title: 'Context Managers',
        description: '`with` statement. The cleaner version of try/finally for resource management.',
        category: 'advanced',
        status: 'locked',
      },
    ],
  },
];

export const ICONS = {
  basics: BookOpen,
  tooling: Terminal,
  advanced: Layers,
  async: Zap,
  'data-science': Database,
};
