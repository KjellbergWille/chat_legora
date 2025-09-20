import React, { useState } from "react";

export default function MessageInput({ onSend }:{ onSend:(text:string)=>void }){
  const [text, setText] = useState("");
  function submit(e: React.FormEvent){ e.preventDefault(); if(!text.trim()) return; onSend(text); setText(""); }
  return (
    <form onSubmit={submit} className="border-t p-2 flex gap-2">
      <input className="input" placeholder="Type a message" value={text} onChange={e=>setText(e.target.value)} />
      <button className="btn">Send</button>
    </form>
  );
}
