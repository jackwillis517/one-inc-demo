import { useState } from "react";

export default function Form() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const testMessages = [
    "message one",
    "message two",
    "message three",
    "message one",
    "message two",
    "message three",
    "message one",
    "message two",
    "message three",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setMessages([...messages, input]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto mt-10">
      <div className="flex-1 overflow-y-auto mb-4 px-2">
        {testMessages.map((msg, idx) => (
          <div key={idx} className="my-2 p-2 text-white">
            {msg}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
        <input
          type="text"
          className="flex-1 min-w-[400px] text-white px-6 py-4 rounded-xl focus:outline-none bg-[#164a7f]"
          placeholder="Professional, Casual, Polite, or Something for the Socials..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-[#93D500] text-black rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Process
        </button>
      </form>
    </div>
  );
}
