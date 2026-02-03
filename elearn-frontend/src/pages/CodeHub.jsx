import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { PlayArrow, ContentCopy, Download } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";

export default function CodeHub() {
  const { isOpen } = useSidebar();
  const { user } = useAuth();
  
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(
    `# Write your code here\nprint("Hello, World!")`
  );
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const languages = [
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
  ];

  const languageExtensions = {
    python: "py",
    javascript: "js",
    java: "java",
    cpp: "cpp",
    csharp: "cs",
  };

  const handleRunCode = async () => {
    setLoading(true);
    setError("");
    setOutput("");

    try {
      // This is a placeholder - integrate with actual compiler API
      // For now, just show a demo message
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOutput("✓ Code executed successfully!\n\nOutput: (Compiler API integration pending)");
    } catch (err) {
      setError("Failed to execute code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  const handleDownloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    const extension = languageExtensions[language] || "txt";
    element.download = `code.${extension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <Container
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            ml: { xs: 0, md: isOpen ? 25 : 8.75 },
            transition: "margin-left 0.3s ease",
            py: 4,
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mb: 1,
              }}
            >
              CodeHub
            </Typography>
            <Typography variant="body1" sx={{ color: "#666" }}>
              Practice coding with our online compiler. Write, run, and test code in multiple
              languages.
            </Typography>
          </Box>

          {/* Main Editor Area */}
          <Grid container spacing={3}>
            {/* Code Editor */}
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Stack spacing={2}>
                    <FormControl size="small" fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={language}
                        label="Language"
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        {languages.map((lang) => (
                          <MenuItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#667eea" }}>
                      Code Editor
                    </Typography>
                    <TextField
                      multiline
                      rows={12}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Write your code here..."
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "0.9rem",
                        "& .MuiOutlinedInput-root": {
                          fontFamily: "monospace",
                        },
                      }}
                      variant="outlined"
                    />

                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={handleRunCode}
                        disabled={loading}
                        sx={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          flex: 1,
                        }}
                      >
                        {loading ? "Running..." : "Run Code"}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<ContentCopy />}
                        onClick={handleCopyCode}
                        size="small"
                      >
                        Copy
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={handleDownloadCode}
                        size="small"
                      >
                        Download
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Input & Output */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2} sx={{ height: "100%" }}>
                {/* Input Section */}
                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#667eea", mb: 2 }}>
                      Input (stdin)
                    </Typography>
                    <TextField
                      multiline
                      rows={5}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Provide input for your program here (if needed)..."
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "0.9rem",
                        width: "100%",
                        "& .MuiOutlinedInput-root": {
                          fontFamily: "monospace",
                        },
                      }}
                      variant="outlined"
                    />
                  </CardContent>
                </Card>

                {/* Output Section */}
                <Card sx={{ boxShadow: 3, borderRadius: 2, flex: 1, display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#667eea", mb: 2 }}>
                      Output (stdout)
                    </Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    {loading && (
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                        <CircularProgress />
                      </Box>
                    )}
                    {!loading && output && (
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: "#f5f5f5",
                          fontFamily: "monospace",
                          fontSize: "0.85rem",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-all",
                          flex: 1,
                          overflowY: "auto",
                          color: "#333",
                        }}
                      >
                        {output}
                      </Paper>
                    )}
                    {!loading && !output && !error && (
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, color: "#999" }}>
                        <Typography variant="body2">Click "Run Code" to see output here</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>

          {/* Info Box */}
          <Card sx={{ mt: 4, boxShadow: 2, borderRadius: 2, bgcolor: "rgba(102,126,234,0.05)" }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#667eea" }}>
                  💡 Features
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  • Support for multiple programming languages
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  • Real-time code execution with input/output handling
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  • Copy and download your code snippets
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  • Available for both students and teachers to practice coding
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}
