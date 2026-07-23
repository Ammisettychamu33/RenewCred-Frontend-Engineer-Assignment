import React, { useEffect, useRef, useCallback } from 'react';
import katex from 'katex';
import { FiCopy, FiCheck, FiInfo } from 'react-icons/fi';

/**
 * RenderBlock — renders a single content block to its public presentation.
 *
 * Improvements:
 *  - KaTeX useEffect has a cleanup that empties the container on unmount /
 *    expression change so stale renders don't persist.
 *  - Table <th> elements include scope="col" for screen-reader column headers.
 *  - Code copy button has an aria-label and aria-pressed state.
 *  - Images have explicit loading="lazy" and decoding="async" for performance.
 */
const RenderBlock = ({ block }) => {
  const katexRef                      = useRef(null);
  const [copiedCode, setCopiedCode]   = React.useState(false);

  // ── KaTeX render with proper cleanup ─────────────────────
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
          katexRef.current.innerText = block.data.expression;
        }
      }
    }

    return () => {
      // Clear stale render on expression change or unmount
      if (katexRef.current) katexRef.current.innerHTML = '';
    };
  }, [block.type, block.data?.expression]);

  const copyCodeToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text).catch(() => {
      // Fallback for environments without clipboard API
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }, []);

  switch (block.type) {
    case 'heading': {
      const level = block.data?.level || 'h2';
      const text  = block.data?.text  || '';
      if (level === 'h1') {
        return (
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-10 mb-6">
            {text}
          </h1>
        );
      }
      if (level === 'h3') {
        return (
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-4 tracking-tight">
            {text}
          </h3>
        );
      }
      if (level === 'h4') {
        return (
          <h4 className="text-lg font-semibold text-slate-800 mt-6 mb-3">{text}</h4>
        );
      }
      return (
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-12 mb-6 tracking-tight border-b border-slate-200/60 pb-3">
          {text}
        </h2>
      );
    }

    case 'paragraph':
      return (
        <p className="text-slate-700 leading-relaxed text-base sm:text-lg mb-6">
          {block.data?.text}
        </p>
      );

    case 'list': {
      const isBullet = block.data?.style === 'bullet';
      const items    = block.data?.items || [];
      return isBullet ? (
        <ul className="list-disc list-outside space-y-2.5 mb-8 text-slate-700 pl-6 text-base sm:text-lg leading-relaxed">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <ol className="list-decimal list-outside space-y-2.5 mb-8 text-slate-700 pl-6 text-base sm:text-lg leading-relaxed font-medium">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
      );
    }

    case 'nestedList': {
      const items = Array.isArray(block.data?.items) ? block.data.items : [];
      return (
        <ul className="list-disc list-outside space-y-3 mb-8 text-slate-700 pl-6 text-base sm:text-lg leading-relaxed">
          {items.map((item, idx) => (
            <li key={idx}>
              <span className="font-medium text-slate-900">
                {typeof item === 'string' ? item : item.text}
              </span>
              {Array.isArray(item.children) && (
                <ul className="list-circle list-outside pl-6 space-y-2 mt-2 text-slate-600 text-sm sm:text-base">
                  {item.children.map((child, cIdx) => (
                    <li key={cIdx}>
                      {typeof child === 'string' ? child : child.text}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      );
    }

    case 'table': {
      const headers = block.data?.headers || [];
      const rows    = block.data?.rows    || [];
      return (
        <div className="my-8 overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-100/80 text-slate-900 font-bold border-b border-slate-200">
                <tr>
                  {headers.map((h, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className="py-3.5 px-5 border-r last:border-r-0 border-slate-200"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="py-3.5 px-5 border-r last:border-r-0 border-slate-200 text-slate-700"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    case 'equation':
      return (
        <div className="my-8 p-6 bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200 rounded-2xl shadow-2xs text-center">
          <div
            ref={katexRef}
            role="math"
            aria-label={block.data?.caption || 'Mathematical equation'}
            className="text-xl sm:text-2xl py-3 overflow-x-auto text-slate-900 font-serif"
          />
          {block.data?.caption && (
            <p className="text-xs font-semibold text-slate-500 mt-2 uppercase tracking-wider">
              {block.data.caption}
            </p>
          )}
        </div>
      );

    case 'image':
      return (
        <figure className="my-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md bg-slate-100">
            <img
              src={block.data?.url}
              alt={block.data?.alt || 'Content visual'}
              loading="lazy"
              decoding="async"
              className="w-full max-h-[600px] object-contain hover:scale-101 transition-transform duration-300"
            />
          </div>
          {block.data?.caption && (
            <figcaption className="text-center text-xs font-medium text-slate-500 mt-3">
              {block.data.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'quote':
      return (
        <blockquote className="my-8 p-6 border-l-4 border-brand-600 bg-gradient-to-r from-brand-50/50 to-white rounded-r-2xl shadow-2xs">
          <p className="text-slate-800 text-lg sm:text-xl font-medium italic leading-relaxed">
            &ldquo;{block.data?.text}&rdquo;
          </p>
          {block.data?.author && (
            <cite className="block text-xs font-bold text-brand-700 uppercase tracking-wider mt-3 not-italic">
              &mdash; {block.data.author}
            </cite>
          )}
        </blockquote>
      );

    case 'code':
      return (
        <div className="my-8 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
          <div className="bg-slate-950 px-4 py-2.5 text-xs font-mono text-slate-400 border-b border-slate-800 flex items-center justify-between">
            <span className="font-semibold uppercase text-brand-400">
              {block.data?.language || 'code'}
            </span>
            <button
              type="button"
              onClick={() => copyCodeToClipboard(block.data?.code || '')}
              aria-label={copiedCode ? 'Code copied to clipboard' : 'Copy code to clipboard'}
              aria-pressed={copiedCode}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded"
            >
              {copiedCode
                ? <FiCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                : <FiCopy  className="w-3.5 h-3.5"                  aria-hidden="true" />
              }
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-5 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed">
            <code>{block.data?.code}</code>
          </pre>
        </div>
      );

    case 'divider':
      return <hr className="border-t border-slate-200/80 my-12" />;

    default:
      return (
        <div className="my-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
          <FiInfo className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span>[Unknown block type: {block.type}]</span>
        </div>
      );
  }
};

/**
 * BlockRenderer — renders an ordered list of content blocks.
 * Blocks are sorted by their `order` property before rendering.
 */
const BlockRenderer = ({ blocks = [] }) => {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-sm">
        No content blocks to render for this page.
      </div>
    );
  }

  const sortedBlocks = [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="space-y-2">
      {sortedBlocks.map((block) => (
        <RenderBlock key={block.id || block._id} block={block} />
      ))}
    </div>
  );
};

export default BlockRenderer;
