import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import socket from "../socket";
import axios from "axios";

function EditorPanel({ selectedFile }) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const isSaved = selectedFileContent === code;

  const fetchFileContent = async (filePath) => {
    if (!filePath) return;
    const response = await axios.get(`http://localhost:9000/files/content`, {
      params: { path: filePath },
    });
    setSelectedFileContent(response.data.content);
  };

  useEffect(() => {
    if (selectedFile && selectedFileContent) {
      setCode(selectedFileContent);
    }
  }, [selectedFile, selectedFileContent]);

  useEffect(() => {
    if (selectedFile) fetchFileContent(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    if (code && !isSaved) {
      const timer = setTimeout(() => {
        socket.emit("file:change", {
          path: selectedFile,
          content: code,
        });
      }, 5 * 1000);
      return () => clearTimeout(timer);
    }
  }, [code, selectedFile, isSaved]);

  useEffect(() => {
    setCode("");
  }, [selectedFile]);

  return (
    <div className="flex flex-col h-full justify-end">
      {selectedFile && (
        <div className="flex bg-[#1f201b] text-gray-400 py-1 gap-2 items-center">
          <p>{selectedFile.replaceAll("/", " > ")}</p>{" "}
          {isSaved ? (
            <span className="bg-green-600 text-white text-[10px] font-bold px-1 py-0.5 rounded-sm">
              {"Saved"}
            </span>
          ) : (
            <span className="bg-red-600 text-white text-[10px] font-bold px-1 py-0.5 rounded-sm">
              {"Unsaved"}
            </span>
          )}
        </div>
      )}
      <AceEditor
        height="96%"
        width="96%"
        mode={language}
        theme="monokai"
        fontSize={14}
        lineHeight={19}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        value={code}
        onChange={(e) => setCode(e)}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          enableMobileMenu: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}

export default EditorPanel;
