import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [shifts, setShifts] = useState([]);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [mode, setMode] = useState("login");

  const API_BASE = "https://timeclock-round2.onrender.com";

  async function call(path, method = "GET", body) {
    const r = await fetch(API_BASE + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  const login = async () => {
    const d = await call("/api/login", "POST", form);
    localStorage.setItem("token", d.token);
    setToken(d.token);
  };

  const register = async () => {
    const d = await call("/api/register", "POST", form);
    localStorage.setItem("token", d.token);
    setToken(d.token);
  };

  const clockIn = () => call("/api/clock/in", "POST");
  const clockOut = () => call("/api/clock/out", "POST");
  const refresh = () => call("/api/shifts").then(setShifts);

  useEffect(() => {
    if (token) refresh();
  }, [token]);

  if (!token)
    return (
      <div style={{ padding: 40 }}>
        <h2>{mode === "login" ? "Login" : "Register"}</h2>
        <input
          placeholder="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {mode === "register" && (
          <input
            placeholder="name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        <div style={{ marginTop: 10 }}>
          {mode === "login" ? (
            <button onClick={login}>Login</button>
          ) : (
            <button onClick={register}>Register</button>
          )}
          <button
            style={{ marginLeft: 10 }}
            onClick={() =>
              setMode(mode === "login" ? "register" : "login")
            }
          >
            Switch
          </button>
        </div>
      </div>
    );

  return (
    <div style={{ padding: 40 }}>
      <h2>Employee Clock</h2>
      <button onClick={clockIn}>Clock In</button>
      <button onClick={clockOut}>Clock Out</button>
      <button onClick={refresh}>Refresh</button>
      <pre>{JSON.stringify(shifts, null, 2)}</pre>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
