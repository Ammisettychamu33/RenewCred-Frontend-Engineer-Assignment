import React from 'react';
import BlockToolbar from './BlockToolbar';
import BlockItem from './BlockItem';
import { FiInbox } from 'react-icons/fi';

const BlockEditor = ({ blocks = [], onChange }) => {
  const handleAddBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      order: blocks.length,
      data: getDefaultDataForType(type),
    };
    onChange([...blocks, newBlock]);
  };

  const handleUpdateBlock = (id, newBlockData) => {
    const updated = blocks.map((b) => (b.id === id ? { ...b, data: newBlockData } : b));
    onChange(updated);
  };

  const handleDeleteBlock = (id) => {
    const filtered = blocks.filter((b) => b.id !== id);
    onChange(reorderBlocks(filtered));
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...blocks];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(reorderBlocks(updated));
  };

  const handleMoveDown = (index) => {
    if (index === blocks.length - 1) return;
    const updated = [...blocks];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(reorderBlocks(updated));
  };

  const handleDuplicateBlock = (block) => {
    const duplicated = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    const index = blocks.findIndex((b) => b.id === block.id);
    const updated = [...blocks];
    updated.splice(index + 1, 0, duplicated);
    onChange(reorderBlocks(updated));
  };

  const reorderBlocks = (arr) => {
    return arr.map((b, idx) => ({ ...b, order: idx }));
  };

  const getDefaultDataForType = (type) => {
    switch (type) {
      case 'heading':
        return { level: 'h2', text: 'New Heading' };
      case 'paragraph':
        return { text: 'Paragraph text content...' };
      case 'list':
        return { style: 'bullet', items: ['First list item', 'Second list item'] };
      case 'nestedList':
        return { items: [{ text: 'Parent item', children: [{ text: 'Nested sub-item' }] }] };
      case 'table':
        return { headers: ['Header A', 'Header B'], rows: [['Data A1', 'Data B1'], ['Data A2', 'Data B2']] };
      case 'equation':
        return { expression: 'E = mc^2', caption: 'Energy-Mass Equivalence' };
      case 'image':
        return { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop', alt: 'Sample image', caption: 'Image Caption' };
      case 'quote':
        return { text: 'The best way to predict the future is to invent it.', author: 'Alan Kay' };
      case 'code':
        return { language: 'javascript', code: '// Write your code here\nconsole.log("Hello RenewCred");' };
      case 'divider':
        return {};
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6">
      <BlockToolbar onAddBlock={handleAddBlock} />

      {blocks.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          <FiInbox className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="text-base font-semibold text-slate-700">No content blocks added yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click any block button from the toolbar above to start building your page content.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <BlockItem
              key={block.id}
              block={block}
              index={index}
              totalBlocks={blocks.length}
              onChange={handleUpdateBlock}
              onDelete={handleDeleteBlock}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onDuplicate={handleDuplicateBlock}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockEditor;
