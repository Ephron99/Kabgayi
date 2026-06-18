import { useState, useCallback } from "react";

let _setToasts = null;

export function showToast(msg, type = "success") {
  if (_setToasts) {
    const id = Date.now();
    _setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      _setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  _setToasts = setToasts;

  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.type === "success" ? "✓" : "✕"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
