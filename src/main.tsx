import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { connectMQTT, sendCommand } from "./mqtt";

function App() {
  const [client, setClient] = useState<any>(null);
  const [state, setState] = useState("UNKNOWN");
  const [distance, setDistance] = useState<number | null>(null);

  // --- MQTT logic (unchanged, just wrapped in nicer UI) ---
  useEffect(() => {
    const mqttClient = connectMQTT((data) => {
      setState(data.state);
      setDistance(data.distance_cm);
    });

    setClient(mqttClient);
  }, []);

  // Map state -> emoji + color
  let emoji = "❔";
  let stateColor = "#e5e7eb"; // gray-200

  if (state === "DISARMED") {
    emoji = "🔓";
    stateColor = "#22c55e"; // green-500
  } else if (state === "ARMED") {
    emoji = "🔒";
    stateColor = "#eab308"; // yellow-500
  } else if (state === "ALARM") {
    emoji = "🚨";
    stateColor = "#ef4444"; // red-500
  } else if (state === "EXIT_DELAY") {
    emoji = "⏳";
    stateColor = "#38bdf8"; // sky-400
  }

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: "#000000",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#111827", // gray-900
    borderRadius: "16px",
    padding: "20px 24px",
    width: "100%",
    maxWidth: "480px",
    border: "1px solid #1f2933",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  };

  const headerStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: "24px",
  };

  const emojiStyle: React.CSSProperties = {
    fontSize: "64px",
    lineHeight: 1,
    marginBottom: "8px",
  };

  const statusTextStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: stateColor,
  };

  const distanceTextStyle: React.CSSProperties = {
    marginTop: "6px",
    fontSize: "14px",
    color: "#9ca3af", // gray-400
  };

  const buttonRowStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  };

  const buttonStyle: React.CSSProperties = {
    flex: 1,
    padding: "12px 0",
    borderRadius: "9999px",
    border: "1px solid #374151",
    backgroundColor: "#111827",
    color: "#f9fafb",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background-color 0.15s ease, transform 0.1s ease, border-color 0.15s ease",
  };

  const armButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    borderColor: "#22c55e33",
  };

  const disarmButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    borderColor: "#ef444433",
  };

  const footerStyle: React.CSSProperties = {
    marginTop: "16px",
    fontSize: "12px",
    textAlign: "center",
    color: "#6b7280", // gray-500
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={emojiStyle}>{emoji}</div>
          <div style={statusTextStyle}>{state}</div>
          <div style={distanceTextStyle}>
            Distance:{" "}
            {distance !== null && distance >= 0
              ? `${distance} cm`
              : "N/A"}
          </div>
        </div>

        <div style={buttonRowStyle}>
          <button
            style={armButtonStyle}
            onClick={() => client && sendCommand(client, "ARM")}
          >
            🔒 ARM
          </button>

          <button
            style={disarmButtonStyle}
            onClick={() => client && sendCommand(client, "DISARM")}
          >
            🔓 DISARM
          </button>
        </div>

        <div style={footerStyle}>
          HomeGuard • MQTT over EMQX • ESP32
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
