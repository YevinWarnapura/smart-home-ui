import AlarmControl from './components/AlarmControl'
import TelemetryPanel from './components/TelemetryPanel'

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col items-center justify-center gap-10 p-6 font-sans">
      <AlarmControl />
      <TelemetryPanel />
    </div>
  )
}

export default App
