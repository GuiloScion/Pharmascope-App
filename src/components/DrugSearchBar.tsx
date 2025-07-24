import React, { useState } from 'react';

interface DrugSearchBarProps {
  onSearch: (query: string) => void;
}

const DrugSearchBar: React.FC<DrugSearchBarProps> = ({ onSearch }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl mx-auto">
      <input
        type="text"
        className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Search for a drug..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default DrugSearchBar;