import React from 'react';
import {
  FiType,
  FiAlignLeft,
  FiList,
  FiGrid,
  FiMinus,
  FiCode,
  FiImage,
  FiMessageSquare,
  FiPlus,
  FiHelpCircle,
} from 'react-icons/fi';

const BLOCK_TYPES = [
  { type: 'heading',    label: 'Heading',          icon: FiType,          color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { type: 'paragraph',  label: 'Paragraph',         icon: FiAlignLeft,     color: 'text-slate-600 bg-slate-50 border-slate-200' },
  { type: 'list',       label: 'List',              icon: FiList,          color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { type: 'nestedList', label: 'Nested List',       icon: FiList,          color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { type: 'table',      label: 'Table',             icon: FiGrid,          color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { type: 'equation',   label: 'Equation (LaTeX)',  icon: FiHelpCircle,    color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { type: 'image',      label: 'Image',             icon: FiImage,         color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { type: 'quote',      label: 'Quote',             icon: FiMessageSquare, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  { type: 'code',       label: 'Code Block',        icon: FiCode,          color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  { type: 'divider',    label: 'Divider',           icon: FiMinus,         color: 'text-gray-600 bg-gray-50 border-gray-200' },
];

const BlockToolbar = ({ onAddBlock }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6">
      <div className="flex items-center gap-2 mb-3" aria-hidden="true">
        <FiPlus className="w-4 h-4 text-brand-600" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Add New Block
        </span>
      </div>

      <div
        role="toolbar"
        aria-label="Insert content block"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2"
      >
        {BLOCK_TYPES.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => onAddBlock(item.type)}
              aria-label={`Insert ${item.label} block`}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all hover:shadow-xs active:scale-95 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-brand-500 ${item.color}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BlockToolbar;
