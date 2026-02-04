import { useState } from "react";
import { Play, RotateCcw, Copy, Check, ChevronDown, Terminal, Clock, Zap, Download } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";

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
  <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
    {icon}
  </div>
);

const LanguageSelector = ({ languages, selectedLanguage, onSelectLanguage, isOpen, setIsOpen }) => (
  <div className="relative">
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center gap-3 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-lg transition-all"
    >
      <LanguageIcon icon={selectedLanguage.icon} />
      <span className="font-medium text-foreground">{selectedLanguage.name}</span>
      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </button>

    {isOpen && (
      <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border/50 rounded-xl shadow-2xl shadow-black/20 overflow-hidden z-50">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => {
              onSelectLanguage(lang);
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors ${
              selectedLanguage.id === lang.id ? "bg-primary/10 border-l-2 border-primary" : ""
            }`}
          >
            <LanguageIcon icon={lang.icon} />
            <span className="font-medium text-foreground">{lang.name}</span>
          </button>
        ))}
      </div>
    )}
  </div>
);

const CodeEditor = ({ code, setCode, lineNumbers }) => (
  <div className="flex-1 flex overflow-hidden bg-card rounded-lg border border-border/50">
    <div className="w-12 bg-muted/30 border-r border-border/30 py-4 flex flex-col items-end pr-3 text-xs font-mono text-muted-foreground select-none overflow-hidden">
      {lineNumbers.map((num) => (
        <div key={num} className="h-6 leading-6">
          {num}
        </div>
      ))}
    </div>

    <textarea
      value={code}
      onChange={(e) => setCode(e.target.value)}
      spellCheck={false}
      className="flex-1 bg-transparent p-4 font-mono text-sm text-foreground leading-6 resize-none focus:outline-none placeholder:text-muted-foreground/50"
      placeholder="Start coding here..."
    />
  </div>
);

const InputPanel = ({ input, setInput }) => (
  <div className="flex-1 flex flex-col bg-card rounded-lg border border-border/50 overflow-hidden">
    <div className="h-12 bg-muted/30 border-b border-border/50 flex items-center px-4">
      <span className="font-medium text-sm text-foreground">📥 Input (stdin)</span>
    </div>
    <textarea
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Provide input for your program (if needed)..."
      className="flex-1 bg-transparent p-4 font-mono text-sm text-foreground resize-none focus:outline-none placeholder:text-muted-foreground/50"
    />
  </div>
);

const OutputPanel = ({ output, isRunning, executionTime }) => (
  <div className="flex-1 flex flex-col bg-card rounded-lg border border-border/50 overflow-hidden">
    <div className="h-12 bg-muted/30 border-b border-border/50 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Terminal className="w-4 h-4 text-primary" />
        <span className="font-medium text-sm text-foreground">📤 Output (stdout)</span>
      </div>
      {executionTime !== null && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{executionTime}ms</span>
        </div>
      )}
    </div>

    <div className="flex-1 p-4 font-mono text-sm overflow-auto">
      {isRunning ? (
        <div className="flex items-center gap-3 text-primary">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Running code...</span>
        </div>
      ) : output ? (
        <pre className="whitespace-pre-wrap text-foreground">{output}</pre>
      ) : (
        <div className="text-muted-foreground/50 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          <span>Click "Run Code" to see output</span>
        </div>
      )}
    </div>
  </div>
);

const ActionButtons = ({ onRun, onReset, onCopy, onDownload, copied, isRunning }) => (
  <div className="flex items-center gap-2">
    <button
      onClick={onCopy}
      className="p-2 hover:bg-secondary/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
      title="Copy code"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
    </button>
    <button
      onClick={onDownload}
      className="p-2 hover:bg-secondary/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
      title="Download code"
    >
      <Download className="w-4 h-4" />
    </button>
    <button
      onClick={onReset}
      className="p-2 hover:bg-secondary/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
      title="Reset code"
    >
      <RotateCcw className="w-4 h-4" />
    </button>
    <button
      onClick={onRun}
      disabled={isRunning}
      className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
    >
      <Play className="w-4 h-4" />
      <span>Run Code</span>
    </button>
  </div>
);

export default function CodeHub() {
  const { isOpen } = useSidebar();
  const { user } = useAuth();
  
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [code, setCode] = useState(languages[0].template);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);

  const lineNumbers = code.split("\n").map((_, i) => i + 1);

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
      };

      setOutput(mockOutputs[selectedLanguage.id] || "Code executed successfully!");
      setIsRunning(false);
    }, 800 + Math.random() * 400);
  };

  const handleReset = () => {
    setCode(selectedLanguage.template);
    setOutput("");
    setExecutionTime(null);
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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">CodeHub</h1>
            <p className="text-muted-foreground">Practice coding with our online compiler. Write, run, and test code in multiple languages.</p>
          </div>

          {/* Main Editor Area */}
          <div className="flex flex-col gap-4 h-[calc(100vh-280px)]">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border border-border/50 rounded-lg">
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

            {/* Content Area - Split Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
              {/* Left Column - Code Editor */}
              <div className="flex flex-col overflow-hidden min-h-0 rounded-lg border border-border/50">
                <div className="text-muted-foreground text-sm font-medium px-4 py-3 bg-muted/30 border-b border-border/50">💻 Code Editor</div>
                <CodeEditor code={code} setCode={setCode} lineNumbers={lineNumbers} />
              </div>

              {/* Right Column - Input & Output */}
              <div className="flex flex-col gap-4 overflow-hidden min-h-0">
                {/* Input Box */}
                <div className="flex-1 flex flex-col min-h-0 rounded-lg border border-border/50 overflow-hidden">
                  <div className="text-muted-foreground text-sm font-medium px-4 py-3 bg-muted/30 border-b border-border/50">📥 Input</div>
                  <InputPanel input={input} setInput={setInput} />
                </div>

                {/* Output Box */}
                <div className="flex-1 flex flex-col min-h-0 rounded-lg border border-border/50 overflow-hidden">
                  <div className="text-muted-foreground text-sm font-medium px-4 py-3 bg-muted/30 border-b border-border/50">📤 Output</div>
                  <OutputPanel output={output} isRunning={isRunning} executionTime={executionTime} />
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-6 p-4 bg-card border border-border/50 rounded-lg">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Features</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Support for JavaScript, Python, Java, C++, and C#</li>
                  <li>• Real-time code execution with input/output handling</li>
                  <li>• Copy and download your code snippets with proper file extensions</li>
                  <li>• Available for both students and teachers to practice coding</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
