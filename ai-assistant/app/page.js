"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  function isImageRequest(text) {
    const keywords = ["image", "picture", "photo", "draw", "generate a", "banao", "tasveer"];
    const lower = text.toLowerCase();
    return keywords.some((k) => lower.includes(k));
  }

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    const currentInput = input;
    setInput("");

    try {
      if (isImageRequest(currentInput)) {
        const res = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: currentInput }),
        });
        const data = await res.json();

        if (data.imageUrl) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", type: "image", content: data.imageUrl },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", type: "text", content: "Image generate nahi ho payi, dobara try karo." },
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "text",
            content: "Ye ek normal chat message hai. Yahan tum apna chat AI API connect karoge.",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", type: "text", content: "Error aaya, dobara try karo." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <h1>AI Assistant</h1>

      <div
        style={{
          minHeight: 400,
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong>
            <div>
              {msg.type === "image" ? (
                <img
                  src={msg.content}
                  alt="Generated"
                  style={{ maxWidth: "100%", borderRadius: 8, marginTop: 8 }}
                />
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {loading && <p>Generating response...</p>}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Message likho... (e.g. 'generate a image of a sunset')"
          style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            padding: "10px 20px",
            borderRadius: 6,
            border: "none",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
