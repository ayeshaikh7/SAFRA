import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./styles.css";

const routes = [
  {
    id: "A",
    name: "Fastest",
    duration: 15,
    distance: 3.2,
    baseScore: 82,
    color: "#2563eb",
    points: [[19.076,72.8777],[19.078,72.883],[19.082,72.887],[19.086,72.891],[19.09,72.895]],
    reports: 7, lighting: "Low", activity: "Low",
    note: "Fastest route, but several night-time reports are nearby."
  },
  {
    id: "B",
    name: "Safer",
    duration: 18,
    distance: 3.7,
    baseScore: 76,
    color: "#16a34a",
    points: [[19.076,72.8777],[19.074,72.884],[19.077,72.890],[19.083,72.895],[19.09,72.895]],
    reports: 2, lighting: "Good", activity: "High",
    note: "A little longer, with fewer reported incidents and stronger activity."
  },
  {
    id: "C",
    name: "Alternative",
    duration: 21,
    distance: 4.1,
    baseScore: 69,
    color: "#f59e0b",
    points: [[19.076,72.8777],[19.070,72.883],[19.071,72.891],[19.079,72.899],[19.09,72.895]],
    reports: 1, lighting: "Good", activity: "Medium",
    note: "Avoids the reported stretch but adds more travel time."
  }
];

function scoreFor(route, hour) {
  // Demo-only time model. Replace with backend/data-driven calculations.
  const nightPenalty = hour >= 21 || hour < 6 ? 16 : hour >= 19 ? 7 : 0;
  const activityBoost = route.id === "B" ? (hour >= 20 || hour < 6 ? 6 : 2) : route.id === "C" ? 2 : -2;
  const lighting = route.lighting === "Good" ? 4 : route.lighting === "Average" ? 0 : -7;
  return Math.max(0, Math.min(100, Math.round(route.baseScore - nightPenalty + activityBoost + lighting)));
}

function App() {
  const [destination, setDestination] = useState("Home");
  const [time, setTime] = useState(23);
  const [selected, setSelected] = useState("B");
  const [reports, setReports] = useState([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportType, setReportType] = useState("Poor lighting");

  const analyzed = useMemo(() => routes.map(r => ({...r, score: scoreFor(r, time)})), [time]);
  const selectedRoute = analyzed.find(r => r.id === selected) || analyzed[1];

  const formatTime = h => {
    const suffix = h >= 12 ? "PM" : "AM";
    const hh = h % 12 || 12;
    return `${hh}:00 ${suffix}`;
  };

  const submitReport = () => {
    setReports(prev => [...prev, { type: reportType, time: formatTime(time) }]);
    setReportOpen(false);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="shield">🛡️</div>
          <div><strong>SAFRA</strong><span>Navigate beyond distance.</span></div>
        </div>
        <div className="status">● Prototype mode</div>
      </header>

      <main className="layout">
        <section className="panel">
          <div className="eyebrow">TIME-AWARE SAFETY LAYER</div>
          <h1>Find a route with more context.</h1>
          <p className="sub">Compare travel time with reported incidents, lighting and area activity for your selected time.</p>

          <label>Starting point</label>
          <div className="input fake">📍 College</div>

          <label>Destination</label>
          <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Enter destination" />

          <div className="time-row">
            <div>
              <label>Travel time</label>
              <div className="time-value">🕒 {formatTime(time)}</div>
            </div>
            <button className="ghost" onClick={() => setReportOpen(true)}>＋ Report</button>
          </div>

          <input className="slider" type="range" min="6" max="23" value={time} onChange={e => setTime(Number(e.target.value))}/>
          <div className="slider-labels"><span>6 PM</span><span>11 PM</span></div>

          <div className="route-list">
            {analyzed.map(r => (
              <button className={`route-card ${selected === r.id ? "selected" : ""}`} key={r.id} onClick={() => setSelected(r.id)}>
                <div className="route-line">
                  <span className="route-dot" style={{background:r.color}}></span>
                  <span>{r.name}</span>
                  <b>{r.duration} min</b>
                </div>
                <div className="route-meta">{r.distance} km · {r.score}/100 prototype score</div>
                <div className="mini-tags">
                  <span>{r.lighting} lighting</span><span>{r.reports} reports</span><span>{r.activity} activity</span>
                </div>
              </button>
            ))}
          </div>

          <div className="explain">
            <div className="explain-title">🛡️ SAFRA suggests {selectedRoute.name}</div>
            <div className="explain-time">{selectedRoute.duration} minutes · {selectedRoute.duration - 15 > 0 ? `${selectedRoute.duration - 15} minutes slower than fastest` : "fastest route"}</div>
            <ul>
              <li>Better lighting coverage</li>
              <li>Fewer reported incidents</li>
              <li>{selectedRoute.activity} area activity</li>
              <li>{selectedRoute.note}</li>
            </ul>
            <small>Scores are experimental prototype indicators, not a guarantee of personal safety.</small>
          </div>

          <button className="primary" onClick={() => alert(`Route ${selectedRoute.id} selected for ${destination} at ${formatTime(time)}.`)}>Use this route</button>
        </section>

        <section className="map-wrap">
          <MapContainer center={[19.082,72.889]} zoom={14} scrollWheelZoom={true} className="map">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {analyzed.map(r => (
              <Polyline key={r.id} positions={r.points} pathOptions={{ color: r.color, weight: selected===r.id ? 8 : 4, opacity: selected===r.id ? 1 : .55 }} />
            ))}
            <CircleMarker center={[19.076,72.8777]} radius={9} pathOptions={{color:"#111827",fillColor:"#fff",fillOpacity:1}}>
              <Popup><b>START</b><br/>College</Popup>
            </CircleMarker>
            <CircleMarker center={[19.09,72.895]} radius={9} pathOptions={{color:"#111827",fillColor:"#fff",fillOpacity:1}}>
              <Popup><b>DESTINATION</b><br/>{destination || "Home"}</Popup>
            </CircleMarker>
          </MapContainer>

          <div className="map-overlay">
            <div><b>SAFETY BY TIME</b><span>{formatTime(time)}</span></div>
            <div className="legend"><span>● Fastest</span><span>● Safer</span><span>● Alternative</span></div>
          </div>
        </section>
      </main>

      {reportOpen && (
        <div className="modal-backdrop" onClick={() => setReportOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Report a local concern</h2>
            <p>For the prototype, this report is stored only in the current browser session.</p>
            <select value={reportType} onChange={e => setReportType(e.target.value)}>
              <option>Poor lighting</option><option>Harassment report</option><option>Isolated area</option><option>Other</option>
            </select>
            <div className="modal-actions"><button className="ghost" onClick={() => setReportOpen(false)}>Cancel</button><button className="primary" onClick={submitReport}>Submit report</button></div>
          </div>
        </div>
      )}

      <footer>{reports.length ? `${reports.length} report submitted in this demo session.` : "Demo data is illustrative. A production app should use carefully sourced, privacy-preserving datasets."}</footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);