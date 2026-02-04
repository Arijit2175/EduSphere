import { useState } from "react";
import { Code2, Play, RotateCcw, Copy, Check, Download, ChevronDown, Terminal, Clock, Zap, Keyboard } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../contexts/SidebarContext";
import "./CodeHub.css";

const languages = [
  {
    id: "javascript",
    name: "JavaScript",
    icon: "JS",
    ext: "js",
    template: `// JavaScript Example
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Student"));
console.log("Welcome to CodeHub!");`,
  },
  {
    id: "python",
    name: "Python",
    icon: "PY",
    ext: "py",
    template: `# Python Example
def greet(name):
    return f"Hello, {name}!"

print(greet("Student"))
print("Welcome to CodeHub!")`,
  },
  {
    id: "java",
    name: "Java",
    icon: "JV",
    ext: "java",
    template: `// Java Example
public class Main {
    public static void main(String[] args) {
        System.out.println(greet("Student"));
        System.out.println("Welcome to CodeHub!");
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`,
  },
  {
    id: "cpp",
    name: "C++",
    icon: "C+",
    ext: "cpp",
    template: `// C++ Example
#include <iostream>
#include <string>
using namespace std;

string greet(string name) {
    return "Hello, " + name + "!";
}

int main() {
    cout << greet("Student") << endl;
    cout << "Welcome to CodeHub!" << endl;
    return 0;
}`,
  },
  {
    id: "csharp",
    name: "C#",
    icon: "C#",
    ext: "cs",
    template: `// C# Example
using System;

class Program {
    static void Main() {
        Console.WriteLine(Greet("Student"));
        Console.WriteLine("Welcome to CodeHub!");
    }
    
    static string Greet(string name) {
        return $"Hello, {name}!";
    }
}`,
  },
];

const LanguageIcon = ({ icon }) => (
  <div className="language-icon">{icon}</div>
);

const LanguageSelector = ({ languages, selectedLanguage, onSelectLanguage, isOpen, setIsOpen }) => (
  <div className="language-selector">
    <button className="language-selector-btn" onClick={() => setIsOpen(!isOpen)}>
      <LanguageIcon icon={selectedLanguage.icon} />
      <span className="language-name">{selectedLanguage.name}</span>
      <ChevronDown className={`chevron-icon ${isOpen ? "rotated" : ""}`} size={14} />
    </button>

    {isOpen && (
      <>
        <div className="dropdown-overlay" onClick={() => setIsOpen(false)} />
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                onSelectLanguage(lang);
                setIsOpen(false);
              }}
              className={`language-option ${selectedLanguage.id === lang.id ? "selected" : ""}`}
            >
              <LanguageIcon icon={lang.icon} />
              <span className="language-name">{lang.name}</span>
            </button>
          ))}
        </div>
      </>
    )}
  </div>
);

const CodeEditor = ({ code, setCode }) => {
  const lineNumbers = code.split("\n").map((_, i) => i + 1);

  return (
    <div className="code-editor">
      <div className="line-numbers">
        {lineNumbers.map((num) => (
          <div key={num} className="line-number">
            {num}
          </div>
        ))}
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="code-textarea"
        placeholder="Start coding here..."
      />
    </div>
  );
};

const InputPanel = ({ input, setInput }) => (
  <div className="panel">
    <div className="panel-header">
      <div className="panel-header-left">
        <Keyboard size={14} className="panel-icon" />
        <span className="panel-title">INPUT</span>
      </div>
    </div>
    <textarea
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Enter input for your program..."
      className="panel-textarea"
    />
  </div>
);

const OutputPanel = ({ output, isRunning, executionTime }) => (
  <div className="panel">
    <div className="panel-header">
      <div className="panel-header-left">
        <Terminal size={14} className="panel-icon" />
        <span className="panel-title">OUTPUT</span>
      </div>
      {executionTime !== null && (
        <div className="time-badge">
          <Clock size={10} />
          <span>{executionTime}ms</span>
        </div>
      )}
    </div>
    <div className="output-content">
      {isRunning ? (
        <div className="running-indicator">
          <div className="spinner small" />
          <span>Executing...</span>
        </div>
      ) : output ? (
        <pre className="output-text">{output}</pre>
      ) : (
        <div className="output-placeholder">
          <Zap size={14} />
          <span>Output will appear here</span>
        </div>
      )}
    </div>
  </div>
);

const ActionButtons = ({ onRun, onReset, onCopy, onDownload, copied, isRunning }) => (
  <div className="action-buttons">
    <button className="icon-btn" onClick={onCopy} title="Copy code">
      {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
    </button>
    <button className="icon-btn" onClick={onDownload} title="Download code">
      <Download size={16} />
    </button>
    <button className="icon-btn" onClick={onReset} title="Reset code">
      <RotateCcw size={16} />
    </button>
    <button className="run-btn" onClick={onRun} disabled={isRunning}>
      {isRunning ? <div className="spinner" /> : <Play size={16} />}
      <span>{isRunning ? "Running..." : "Run"}</span>
    </button>
  </div>
);

export default function CodeHub() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [code, setCode] = useState(languages[0].template);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setCode(lang.template);
    setOutput("");
    setExecutionTime(null);
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput("");

    const startTime = Date.now();
    setTimeout(() => {
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);

      const mockOutputs = {
        javascript: "Hello, Student!\nWelcome to CodeHub!",
        python: "Hello, Student!\nWelcome to CodeHub!",
        java: "Hello, Student!\nWelcome to CodeHub!",
        cpp: "Hello, Student!\nWelcome to CodeHub!",
        csharp: "Hello, Student!\nWelcome to CodeHub!",
        typescript: "Hello, Student!\nWelcome to CodeHub!",
      };

      setOutput(mockOutputs[selectedLanguage.id] || "Code executed successfully!");
      setIsRunning(false);
    }, 600 + Math.random() * 300);
  };

  const handleReset = () => {
    setCode(selectedLanguage.template);
    setOutput("");
    setExecutionTime(null);
    setInput("");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `code.${selectedLanguage.ext}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const { sidebarOpen } = useSidebar();

  return (
    <div className="app-layout">
      <Navbar />
      <div className="layout-container">
        <Sidebar />
        <div className={`main-content-wrapper ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <div className="codehub-container">
            {/* Header */}
            <header className="codehub-header">
              <div className="header-left">
                <div className="logo-icon">
                  <Code2 size={16} />
                </div>
                <span className="logo-text">CodeHub</span>
              </div>
              <div className="header-right">
                <LanguageSelector
                  languages={languages}
                  selectedLanguage={selectedLanguage}
                  onSelectLanguage={handleLanguageChange}
                  isOpen={languageDropdownOpen}
                  setIsOpen={setLanguageDropdownOpen}
                />
                <ActionButtons
                  onRun={handleRun}
                  onReset={handleReset}
                  onCopy={handleCopy}
                  onDownload={handleDownload}
                  copied={copied}
                  isRunning={isRunning}
                />
              </div>
            </header>

            {/* Main Content */}
            <main className="codehub-main">
              {/* Code Editor - Left Panel */}
              <div className="editor-panel">
                <CodeEditor code={code} setCode={setCode} />
              </div>

              {/* Right Panel - Input & Output */}
              <div className="io-panel">
                <div className="input-section">
                  <InputPanel input={input} setInput={setInput} />
                </div>
                <div className="output-section">
                  <OutputPanel output={output} isRunning={isRunning} executionTime={executionTime} />
                </div>
              </div>
            </main>

            {/* Footer Status */}
            <footer className="codehub-footer">
              <span>Ready</span>
              <span>© 2025 EduSphere. All rights reserved.</span>
              <span>{selectedLanguage.name} • UTF-8</span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
