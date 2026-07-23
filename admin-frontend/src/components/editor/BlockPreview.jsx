import React, { useEffect, useRef } from 'react';
import katex from 'katex';

const RenderPreviewBlock = ({ block }) => {
  const katexRef = useRef(null);

  useEffect(() => {
    if (block.type === 'equation' && katexRef.current && block.data?.expression) {
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
  }, [block.type, block.data?.expression]);

  switch (block.type) {
    case 'heading': {
      const level = block.data?.level || 'h2';
      const text = block.data?.text || '';
      if (level === 'h1') return <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{text}</h1>;
      if (level === 'h3') return <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3">{text}</h3>;
      if (level === 'h4') return <h4 className="text-lg font-semibold text-slate-800 mt-4 mb-2">{text}</h4>;
      return <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2">{text}</h2>;
    }

    case 'paragraph':
      return <p className="text-slate-700 leading-relaxed mb-4 text-base">{block.data?.text}</p>;

    case 'list': {
      const isBullet = block.data?.style === 'bullet';
      const items = block.data?.items || [];
      return isBullet ? (
        <ul className="list-disc list-inside space-y-2 mb-4 text-slate-700 pl-2">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <ol className="list-decimal list-inside space-y-2 mb-4 text-slate-700 pl-2">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
      );
    }

    case 'nestedList': {
      const items = Array.isArray(block.data?.items) ? block.data.items : [];
      return (
        <ul className="list-disc list-inside space-y-2 mb-4 text-slate-700 pl-2">
          {items.map((item, idx) => (
            <li key={idx}>
              <span>{typeof item === 'string' ? item : item.text}</span>
              {Array.isArray(item.children) && (
                <ul className="list-circle list-inside pl-6 space-y-1 mt-1 text-slate-600">
                  {item.children.map((child, cIdx) => (
                    <li key={cIdx}>{typeof child === 'string' ? child : child.text}</li>
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
      const rows = block.data?.rows || [];
      return (
        <div className="overflow-x-auto my-6 border border-slate-200 rounded-xl shadow-2xs">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-semibold">
              <tr>
                {headers.map((h, idx) => (
                  <th key={idx} scope="col" className="p-3 border-r last:border-r-0 border-slate-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/50">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3 border-r last:border-r-0 border-slate-200 text-slate-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'equation':
      return (
        <div className="my-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
          <div ref={katexRef} className="text-lg py-2 overflow-x-auto"></div>
          {block.data?.caption && <p className="text-xs text-slate-500 mt-2 font-medium">{block.data.caption}</p>}
        </div>
      );

    case 'image':
      return (
        <figure className="my-6">
          <img
            src={block.data?.url}
            alt={block.data?.alt || ''}
            loading="lazy"
            decoding="async"
            className="w-full max-h-[500px] object-cover rounded-2xl border border-slate-200 shadow-xs"
          />
          {block.data?.caption && (
            <figcaption className="text-center text-xs text-slate-500 mt-2">{block.data.caption}</figcaption>
          )}
        </figure>
      );

    case 'quote':
      return (
        <blockquote className="my-6 pl-4 border-l-4 border-brand-500 italic text-slate-800 bg-brand-50/30 p-4 rounded-r-xl">
          <p className="text-base">&ldquo;{block.data?.text}&rdquo;</p>
          {block.data?.author && <cite class="block text-xs font-semibold text-brand-700 mt-2">— {block.data.author}</cite>}
        </blockquote>
      );

    case 'code':
      return (
        <div className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md">
          <div className="bg-slate-950 px-4 py-2 text-xs font-mono text-slate-400 border-b border-slate-800 flex justify-between">
            <span>{block.data?.language || 'code'}</span>
          </div>
          <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
            <code>{block.data?.code}</code>
          </pre>
        </div>
      );

    case 'divider':
      return <hr className="border-t border-slate-200 my-8" />;

    default:
      return (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl my-4 text-xs text-amber-800">
          [Unknown Block: {block.type}]
        </div>
      );
  }
};

const BlockPreview = ({ title, seo, blocks }) => {
  return (
    <div className="bg-white p-6 md:p-10 rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto min-h-[600px]">
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-6 mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{title || 'Untitled Page'}</h1>
        {seo?.metaDescription && (
          <p className="text-slate-500 text-sm mt-2">{seo.metaDescription}</p>
        )}
      </div>

      {/* Render Blocks */}
      {blocks && blocks.length > 0 ? (
        blocks.map((block) => <RenderPreviewBlock key={block.id} block={block} />)
      ) : (
        <div className="text-center py-20 text-slate-400 text-sm">
          No blocks added yet. Use the block toolbar to add content blocks.
        </div>
      )}
    </div>
  );
};

export default BlockPreview;
