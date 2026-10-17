import React, { useState } from 'react';

interface NotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotesDrawer: React.FC<NotesDrawerProps> = ({ isOpen, onClose }) => {
  const [notes, setNotes] = useState<string[]>([
    'Remember: For unit-normalized vectors, Euclidean distance squared = 2 * (1 - cosine). Saves expensive square roots!',
    'HNSW Layer 2 has high skip radius (sparse). Layer 0 has dense ground truth connections.',
    'efConstruction controls graph density at build time; M controls max connections per node.',
  ]);
  const [newNote, setNewNote] = useState('');

  if (!isOpen) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([newNote.trim(), ...notes]);
    setNewNote('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2f3033]/50 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#e3e2e6]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005bbf] text-[22px]">edit_note</span>
            <h3 className="font-semibold text-lg text-[#1a1b1e]">Learner Notes & Annotations</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#efedf1] text-[#727785]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleAddNote} className="my-4 space-y-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Jot down a quick insight, formula, or question for Gemini tutor..."
            rows={3}
            className="w-full p-3 rounded-xl bg-[#f4f3f7] border-0 text-sm text-[#1a1b1e] placeholder:text-[#727785] outline-none focus:ring-2 focus:ring-[#005bbf]"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-full bg-[#005bbf] hover:bg-[#1a73e8] text-white text-xs font-semibold shadow-sm transition-all"
          >
            Save Note to Cloud
          </button>
        </form>

        <div className="flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-[#727785] font-semibold uppercase tracking-wider">
            <span>Saved Notes ({notes.length})</span>
            <span>Auto-synced</span>
          </div>
          {notes.map((note, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#f4f3f7] border border-[#e3e2e6] space-y-1">
              <p className="text-sm text-[#1a1b1e] leading-relaxed">{note}</p>
              <div className="flex items-center justify-between text-[11px] text-[#727785] pt-1">
                <span>Module 2: High-Dimensional Geometry</span>
                <button
                  onClick={() => setNotes(notes.filter((_, i) => i !== idx))}
                  className="hover:text-[#ba1a1a]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
