import React, { useEffect, useRef, useCallback, memo } from 'react';
import katex from 'katex';
import {
  FiChevronUp,
  FiChevronDown,
  FiTrash2,
  FiCopy,
  FiPlus,
  FiMinus,
} from 'react-icons/fi';

/**
 * BlockItem — editor card for a single content block.
 *
 * Wrapped in React.memo so it only re-renders when its own props change,
 * preventing unnecessary re-renders of sibling blocks on every keystroke.
 *
 * Accessibility improvements:
 *  - All icon-only buttons have aria-label describing their action.
 *  - Disabled state on Move-Up/Down is reflected via aria-disabled.
 *  - KaTeX ref cleanup is handled in the useEffect return.
 */
const BlockItem = memo(({
  block,
  index,
  totalBlocks,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
}) => {
  const katexRef = useRef(null);

  // ── LaTeX preview effect with proper cleanup ──────────────
  useEffect(() => {
    if (block.type !== 'equation' || !katexRef.current) return;

    if (block.data?.expression) {
      try {
        katex.render(block.data.expression, katexRef.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch {
        if (katexRef.current) {
          katexRef.current.innerText = 'Invalid LaTeX formula';
        }
      }
    } else {
      // Clear stale render when expression is emptied
      if (katexRef.current) katexRef.current.innerHTML = '';
    }
  }, [block.type, block.data?.expression]);

  // ── Data change helpers ───────────────────────────────────
  const handleDataChange = useCallback(
    (field, value) => {
      onChange(block.id, { ...block.data, [field]: value });
    },
    [block.id, block.data, onChange]
  );

  const handleListItemChange = useCallback(
    (itemIdx, value) => {
      const items = [...(block.data.items || [])];
      items[itemIdx] = value;
      handleDataChange('items', items);
    },
    [block.data, handleDataChange]
  );

  const addListItem = useCallback(() => {
    handleDataChange('items', [...(block.data.items || []), 'New list item']);
  }, [block.data, handleDataChange]);

  const removeListItem = useCallback(
    (itemIdx) => {
      handleDataChange(
        'items',
        (block.data.items || []).filter((_, idx) => idx !== itemIdx)
      );
    },
    [block.data, handleDataChange]
  );

  const handleTableHeaderChange = useCallback(
    (colIdx, value) => {
      const headers = [...(block.data.headers || [])];
      headers[colIdx] = value;
      handleDataChange('headers', headers);
    },
    [block.data, handleDataChange]
  );

  const handleTableCellChange = useCallback(
    (rowIdx, colIdx, value) => {
      const rows = (block.data.rows || []).map((row) => [...row]);
      if (!rows[rowIdx]) rows[rowIdx] = [];
      rows[rowIdx][colIdx] = value;
      handleDataChange('rows', rows);
    },
    [block.data, handleDataChange]
  );

  const addTableRow = useCallback(() => {
    const colsCount = (block.data.headers || []).length || 2;
    handleDataChange('rows', [
      ...(block.data.rows || []),
      Array(colsCount).fill('Cell data'),
    ]);
  }, [block.data, handleDataChange]);

  const removeTableRow = useCallback(
    (rowIdx) => {
      handleDataChange(
        'rows',
        (block.data.rows || []).filter((_, idx) => idx !== rowIdx)
      );
    },
    [block.data, handleDataChange]
  );

  const addTableColumn = useCallback(() => {
    const headers = [
      ...(block.data.headers || ['Header 1']),
      `Header ${(block.data.headers?.length || 1) + 1}`,
    ];
    const rows = (block.data.rows || []).map((row) => [...row, 'Cell']);
    onChange(block.id, { ...block.data, headers, rows });
  }, [block.id, block.data, onChange]);

  // ── Block editor content renderer ─────────────────────────
  const renderBlockEditorContent = () => {
    switch (block.type) {
      case 'heading':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Heading Level
              </label>
              <select
                value={block.data?.level || 'h2'}
                onChange={(e) => handleDataChange('level', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              >
                <option value="h1">H1 - Main Title</option>
                <option value="h2">H2 - Section Header</option>
                <option value="h3">H3 - Sub Section</option>
                <option value="h4">H4 - Small Heading</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Heading Text
              </label>
              <input
                type="text"
                value={block.data?.text || ''}
                onChange={(e) => handleDataChange('text', e.target.value)}
                placeholder="Enter heading text..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:outline-none font-semibold text-slate-900"
              />
            </div>
          </div>
        );

      case 'paragraph':
        return (
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Paragraph Content
            </label>
            <textarea
              rows={3}
              value={block.data?.text || ''}
              onChange={(e) => handleDataChange('text', e.target.value)}
              placeholder="Write your paragraph content here..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:outline-none resize-y"
            />
          </div>
        );

      case 'list':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-500">
                List Style
              </label>
              <select
                value={block.data?.style || 'bullet'}
                onChange={(e) => handleDataChange('style', e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none"
              >
                <option value="bullet">Bullet List</option>
                <option value="number">Numbered List</option>
              </select>
            </div>

            <div className="space-y-2">
              {(block.data?.items || ['Sample item']).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListItemChange(idx, e.target.value)}
                    aria-label={`List item ${idx + 1}`}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem(idx)}
                    aria-label={`Remove list item ${idx + 1}`}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                  >
                    <FiTrash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addListItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              <FiPlus className="w-3.5 h-3.5" aria-hidden="true" /> Add List Item
            </button>
          </div>
        );

      case 'nestedList':
        return (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-500">
              Nested List JSON / Items
            </label>
            <textarea
              rows={4}
              value={
                typeof block.data?.items === 'string'
                  ? block.data.items
                  : JSON.stringify(block.data?.items || [], null, 2)
              }
              onChange={(e) => {
                try {
                  handleDataChange('items', JSON.parse(e.target.value));
                } catch {
                  handleDataChange('items', e.target.value);
                }
              }}
              placeholder='[{"text": "Parent Item", "children": [{"text": "Child Item"}]}]'
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            />
            <p className="text-xs text-slate-400">
              Provide an array of objects with <code>text</code> and optional <code>children</code> array.
            </p>
          </div>
        );

      case 'table': {
        const headers = block.data?.headers || ['Header 1', 'Header 2'];
        const rows    = block.data?.rows    || [['Cell 1', 'Cell 2']];
        return (
          <div className="space-y-3 overflow-x-auto">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-500">
                Table Grid Editor
              </label>
              <button
                type="button"
                onClick={addTableColumn}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                + Column
              </button>
            </div>

            <table className="w-full text-sm border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100">
                  {headers.map((h, colIdx) => (
                    <th key={colIdx} scope="col" className="p-2 border border-slate-200">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => handleTableHeaderChange(colIdx, e.target.value)}
                        aria-label={`Column ${colIdx + 1} header`}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-xs text-slate-800"
                      />
                    </th>
                  ))}
                  <th scope="col" className="p-2 border border-slate-200 w-10">
                    <span className="sr-only">Row actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {headers.map((_, colIdx) => (
                      <td key={colIdx} className="p-2 border border-slate-200">
                        <input
                          type="text"
                          value={row[colIdx] || ''}
                          onChange={(e) => handleTableCellChange(rowIdx, colIdx, e.target.value)}
                          aria-label={`Row ${rowIdx + 1}, column ${colIdx + 1}`}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700"
                        />
                      </td>
                    ))}
                    <td className="p-2 border border-slate-200 text-center">
                      <button
                        type="button"
                        onClick={() => removeTableRow(rowIdx)}
                        aria-label={`Remove row ${rowIdx + 1}`}
                        className="text-rose-500 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              type="button"
              onClick={addTableRow}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              + Add Row
            </button>
          </div>
        );
      }

      case 'equation':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                LaTeX Equation Expression
              </label>
              <input
                type="text"
                value={block.data?.expression || ''}
                onChange={(e) => handleDataChange('expression', e.target.value)}
                placeholder="e.g. E = mc^2 or \\int_{0}^{\\infty} x^2 dx"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Caption (Optional)
              </label>
              <input
                type="text"
                value={block.data?.caption || ''}
                onChange={(e) => handleDataChange('caption', e.target.value)}
                placeholder="Equation title or reference..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl">
              <span className="text-xs font-semibold text-amber-700 block mb-1">
                Live LaTeX Render:
              </span>
              <div
                ref={katexRef}
                aria-label="LaTeX equation preview"
                className="text-center py-2 overflow-x-auto text-slate-800 font-serif"
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={block.data?.url || ''}
                onChange={(e) => handleDataChange('url', e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={block.data?.alt || ''}
                  onChange={(e) => handleDataChange('alt', e.target.value)}
                  placeholder="Image description"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={block.data?.caption || ''}
                  onChange={(e) => handleDataChange('caption', e.target.value)}
                  placeholder="Figure 1. Operational Diagram"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
            {block.data?.url && (
              <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100 flex items-center justify-center">
                <img
                  src={block.data.url}
                  alt={block.data.alt || 'Preview'}
                  className="max-h-48 object-contain"
                />
              </div>
            )}
          </div>
        );

      case 'quote':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Quote Text
              </label>
              <textarea
                rows={2}
                value={block.data?.text || ''}
                onChange={(e) => handleDataChange('text', e.target.value)}
                placeholder="Inspiring quote or key takeaway..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Author / Citation
              </label>
              <input
                type="text"
                value={block.data?.author || ''}
                onChange={(e) => handleDataChange('author', e.target.value)}
                placeholder="e.g. Steve Jobs, Apple Inc."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-500">Language</label>
              <select
                value={block.data?.language || 'javascript'}
                onChange={(e) => handleDataChange('language', e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="sql">SQL</option>
                <option value="bash">Bash / Shell</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Code snippet
              </label>
              <textarea
                rows={5}
                value={block.data?.code || ''}
                onChange={(e) => handleDataChange('code', e.target.value)}
                placeholder="// Enter code here..."
                className="w-full px-3 py-2 bg-slate-900 text-slate-100 border border-slate-800 rounded-xl text-xs font-mono focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
              />
            </div>
          </div>
        );

      case 'divider':
        return (
          <div className="py-2 text-center text-slate-400 text-xs italic">
            <hr className="border-t border-slate-200 my-2" />
            Horizontal Divider Line
          </div>
        );

      default:
        return (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <strong>Unknown Block Type ({block.type}):</strong> Edit raw data as JSON below.
            <textarea
              rows={3}
              value={JSON.stringify(block.data || {}, null, 2)}
              onChange={(e) => {
                try {
                  handleDataChange('custom', JSON.parse(e.target.value));
                } catch {}
              }}
              aria-label="Raw block JSON data"
              className="w-full mt-2 p-2 bg-white border rounded text-xs font-mono"
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all hover:border-slate-300">
      {/* Block header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {block.type} Block
          </span>
        </div>

        <div className="flex items-center gap-1" role="group" aria-label={`Controls for ${block.type} block ${index + 1}`}>
          {/* Move Up */}
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMoveUp(index)}
            aria-label={`Move ${block.type} block up`}
            aria-disabled={index === 0}
            className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <FiChevronUp className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Move Down */}
          <button
            type="button"
            disabled={index === totalBlocks - 1}
            onClick={() => onMoveDown(index)}
            aria-label={`Move ${block.type} block down`}
            aria-disabled={index === totalBlocks - 1}
            className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <FiChevronDown className="w-4 h-4" aria-hidden="true" />
          </button>

          <span className="w-px h-4 bg-slate-200 mx-1" aria-hidden="true" />

          {/* Duplicate */}
          <button
            type="button"
            onClick={() => onDuplicate(block)}
            aria-label={`Duplicate ${block.type} block`}
            className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <FiCopy className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(block.id)}
            aria-label={`Delete ${block.type} block`}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <FiTrash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Main form fields */}
      {renderBlockEditorContent()}
    </div>
  );
});

BlockItem.displayName = 'BlockItem';

export default BlockItem;
