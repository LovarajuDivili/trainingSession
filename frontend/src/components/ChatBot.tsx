import React, { useEffect, useState, useRef, useContext } from "react";
import ReactMarkdown from "react-markdown";
import { UserContext } from "../components/UserContext";

interface ChatMessage {
  _id?: string;
  role: "user" | "assistant";
  message: string;
  createdAt?: string;
}

const ChatBot: React.FC = () => {
  const { token } = useContext(UserContext);

  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, loading]);

  useEffect(() => {
    if (!token) {
      setChats([]);
      return;
    }

    const loadChats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/chat/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setChats(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load chats", err);
      }
    };

    loadChats();
  }, [token]);

  const sendMessage = async () => {
    if (!input.trim() || !token || loading) return;

    setChats(prev => [...prev, { role: "user", message: input }]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await res.json();
      setChats(prev => [
        ...prev,
        { role: "assistant", message: data.reply || "No reply" },
      ]);
    } catch {
      setChats(prev => [
        ...prev,
        { role: "assistant", message: "Error occurred 😢" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (text: string) => {
    return (
      <ReactMarkdown
        components={{
          h2: ({ node, ...props }) => (
            <h2
              style={{
                fontSize: 16,
                fontWeight: 800,
                margin: "10px 0 6px 0",
                display: "block",
              }}
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                margin: "8px 0 4px 0",
                display: "block",
              }}
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              style={{
                lineHeight: 1.5,
                margin: "4px 0",
              }}
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              style={{
                margin: "0 0 4px 16px",
                paddingLeft: 12,
              }}
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li
              style={{
                lineHeight: 1.5,
                marginBottom: 2,
              }}
              {...props}
            />
          ),
          code: ({ node, ...props }) => {
            const { inline, className, children, ...rest } = props as any;

            if (inline) {
              return (
                <code
                  style={{
                    background: "#f0f0f0",
                    padding: "2px 4px",
                    borderRadius: 4,
                  }}
                  className={className}
                  {...rest}
                >
                  {children}
                </code>
              );
            }

            return (
              <pre
                style={{
                  background: "#f0f0f0",
                  padding: 8,
                  borderRadius: 6,
                  fontSize: 13,
                  overflowX: "auto",
                }}
              >
                <code className={className} {...rest}>
                  {children}
                </code>
              </pre>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>🤖 AI Chatbot</div>

      <div style={styles.chatArea}>
        {chats.map((c, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: c.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: c.role === "user" ? "#906aff" : "#e5e5e5",
              color: c.role === "user" ? "#fff" : "#000",
            }}
          >
            {c.role === "assistant" ? renderMessage(c.message) : c.message}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.message, alignSelf: "flex-start" }}>
            Typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          disabled={!token}
          placeholder={token ? "Type a message..." : "Login to chat"}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          style={styles.input}
        />
        <button onClick={sendMessage} disabled={!token} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#f5f7fb",
  },
  header: {
    padding: "12px",
    backgroundColor: "#906aff",
    color: "#fff",
    fontWeight: 600,
  },
  chatArea: {
    flex: 1,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
  },
  message: {
    maxWidth: "75%",
    padding: "10px 14px",
    borderRadius: 16,
    fontSize: 14,
  },
  inputArea: {
    display: "flex",
    padding: 12,
    gap: 8,
    borderTop: "1px solid #ddd",  
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: 20,
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 18px",
    borderRadius: 20,
    backgroundColor: "#906aff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default ChatBot;
