import React from "react";

export default function ThreadList({ threads, activeId, onSelect }:{
  threads: Array<{ id:number; participants:string[]; lastAt:string|null }>,
  activeId: number | null,
  onSelect: (id:number)=>void,
}) {
  return (
    <div className="space-y-2 overflow-auto max-h-[calc(100vh-140px)]">
      {threads.map(t => (
        <button key={t.id} onClick={()=>onSelect(t.id)} className={`w-full text-left p-2 rounded ${activeId===t.id? 'bg-black text-white' : 'hover:bg-gray-100'}`}>
          <div className="text-sm font-medium">{t.participants.join(", ") || "(empty)"}</div>
          <div className="text-xs opacity-70">#{t.id} {t.lastAt? new Date(t.lastAt).toLocaleString():''}</div>
        </button>
      ))}
    </div>
  );
}
