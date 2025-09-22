import React, { useState } from "react";

// Input component for typing and sending messages
export default function MessageInput({ onSend }:{ onSend:(text:string)=>void }){
  const [text, setText] = useState("");
  
  // Handle form submission - send message and clear input
  function submit(e: React.FormEvent){ 
    e.preventDefault(); 
    if(!text.trim()) return; // Don't send empty messages
    onSend(text); // Call parent's send function
    setText(""); // Clear input after sending
  }
  
  return (
    <form onSubmit={submit} className="border-t p-2 flex gap-2">
      <input 
        className="input" 
        placeholder="Type a message" 
        value={text} 
        onChange={e=>setText(e.target.value)} 
      />
      <button className="btn">Send</button>
    </form>
  );
}
