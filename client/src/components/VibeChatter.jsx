import React, { useState, useRef, useEffect } from "react";

export default function VibeChatter({ onChat, progress }) {
  const [position, setPosition] = useState({ x: 1000, y: 80 });
  const [size, setSize] = useState({ width: 380, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [collapsed, setCollapsed] = useState(false);
  const promptRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(
    progress?.length > 0 ? true : false
  );

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  const handleResize = (e) => {
    const newWidth = e.clientX - position.x;
    const newHeight = e.clientY - position.y;
    if (newWidth > 280 && newHeight > 300) {
      setSize({ width: newWidth, height: newHeight });
    }
  };

  return (
    <div
      ref={promptRef}
      style={{
        left: position.x,
        top: position.y,
        width: collapsed ? 200 : size.width,
        height: collapsed ? 40 : size.height,
      }}
      className="fixed z-50 bg-[#1f201bcc] backdrop-blur-md rounded-xl shadow-2xl border border-[#2a2a26] text-white flex flex-col overflow-hidden"
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className="cursor-move px-4 py-2 bg-[#2b2c26] text-lg font-semibold border-b border-[#333] flex justify-between items-center"
      >
        <span className="text-sm">
          {collapsed
            ? "VibeChatter"
            : "What do you vibe on today? Ask me anything."}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCollapsed((prev) => !prev);
          }}
          className="ml-4 text-white bg-transparent hover:text-gray-300 focus:outline-none text-lg"
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Chat Input */}
          <div className="flex flex-col p-4 gap-2 flex-grow overflow-hidden">
            <textarea
              className="bg-[#2a2a26] text-white rounded-lg p-2 resize-none flex-1 focus:outline-none focus:ring-2 focus:ring-[#4a4a40]"
              placeholder="Type your vibe here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
            <button
              className="bg-[#4a4a40] hover:bg-[#5a5a50] text-white px-4 py-2 rounded-lg transition cursor-pointer"
              onClick={() => onChat(prompt)}
              disabled={buttonDisabled}
            >
              Vibe Now
            </button>

            {/* Task Status */}
            <div className="bg-[#2a2a26] mt-2 p-3 rounded-lg overflow-y-auto text-sm h-24">
              <p className="opacity-70">Waiting for your vibe...</p>
              {/* Dynamically populate task status here */}
            </div>
          </div>

          {/* Resize Handle */}
          <div
            onMouseDown={(e) => {
              window.addEventListener("mousemove", handleResize);
              window.addEventListener(
                "mouseup",
                () => {
                  window.removeEventListener("mousemove", handleResize);
                },
                { once: true }
              );
            }}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
          ></div>
        </>
      )}
    </div>
  );
}
