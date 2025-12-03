import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { connectMQTT, sendCommand } from "./mqtt";

function App() {
  const [client, setClient] = useState<any>(null);
  const [state, setState] = useState("UNKNOWN");
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    const mqttClient = connectMQTT((data) => {
      setState(data.state);
      setDistance(data.distance_cm);
    });

    setClient(mqttClient);
  }, []);

  return (
    <div style={{ padding: "30px", color: "white" }}>
      <h1>HomeGuard Control Panel</h1>

      <h2>Status: {state}</h2>
      <h3>Distance: {distance !== null ? distance + " cm" : "N/A"}</h3>

      <button
        onClick={() => client && sendCommand(client, "ARM")}
        style={{ padding: "10px", marginRight: "10px" }}
      >
        ARM
      </button>

      <button
        onClick={() => client && sendCommand(client, "DISARM")}
        style={{ padding: "10px" }}
      >
        DISARM
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
