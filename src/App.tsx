import AlarmControl from './components/AlarmControl'
import TelemetryPanel from './components/TelemetryPanel'
import { useState, useEffect } from 'react'

function App() {
  const [state, setState] = useState("DISARMED")

  // Listen for global MQTT updates
  useEffect(() => {
    window.addEventListener("alarm-state-update", (e: any) => {
      setState(e.detail.state)
    })
  }, [])

  const emoji =
    state === "DISARMED" ? "🔓" :
    state === "ARMED" ? "🔒" :
    state === "ALARM" ? "🚨" :
    "⏳"

  const color =
    state === "DISARMED" ? "text-green-400" :
    state === "ARMED" ? "text-yellow-300" :
    state === "ALARM" ? "text-red-500" :
    "text-gray-300"

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-8 gap-10">

      {/* STATE INDICATOR */}
      <div className="flex flex-col items-center">
        <div className={`text-7xl ${color}`}>{emoji}</div>
        <p className="text-xl mt-2 tracking-wide font-light">{state}</p>
      </div>

      {/* CONTROLS */}
      <div className="w-full max-w-xl flex flex-col gap-6">
        <AlarmControl />
        <TelemetryPanel />
      </div>

    </div>
  )
}

export default App
