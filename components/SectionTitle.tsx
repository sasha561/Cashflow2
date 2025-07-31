
import React from 'react';

interface SectionTitleProps {
  title: string;
  total?: number;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, total }) => {
  return (
    <div className="flex justify-between items-center bg-yellow-400 text-slate-800 font-bold py-2 px-4 rounded-lg w-full">
      <h2 className="text-xl uppercase tracking-wider">{title}</h2>
      {total !== undefined && (
        <span className="text-xl bg-white text-slate-800 rounded-md px-4 py-1 tabular-nums">
          {total.toLocaleString('uk-UA')}
        </span>
      )}
    </div>
  );
};

export default SectionTitle;