import { useRef, useState } from "react";
import { api } from "../api";
import { BACKEND_BASE } from "../../config";

/**
 * ImageUpload — reusable file-picker + drag-and-drop image uploader
 *
 * Props:
 *   value       string   current image URL (shown as preview)
 *   onChange    fn(url)  called with the new image URL after upload
 *   label       string   optional label override
 *   required    bool
 *   height      number   preview height in px (default 160)
 */
export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  required = false,
  height = 160,
}) {
  const inputRef            = useRef(null);
  const [dragging, setDrag] = useState(false);
  const [progress, setProg] = useState(0); // 0 = idle, 1-100 = uploading, -1 = error
  const [error, setError]   = useState("");

  const resolveUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("https")) return url;
    return `${BACKEND_BASE}${url}`;
  };

  const upload = async (file) => {
    if (!file) return;

    // Client-side validation
    const MAX_MB = 8;
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Fichier trop volumineux (max ${MAX_MB} Mo)`);
      return;
    }
    const allowed = ["image/jpeg","image/jpg","image/png","image/webp","image/gif","image/svg+xml"];
    if (!allowed.includes(file.type)) {
      setError("Format non supporté. Utilisez JPG, PNG, WebP, GIF ou SVG.");
      return;
    }

    setError("");
    setProg(10);

    // Fake incremental progress while uploading
    const tick = setInterval(() => setProg((p) => Math.min(p + 10, 85)), 200);

    try {
      const { url } = await api.uploadImage(file);
      clearInterval(tick);
      setProg(100);
      onChange(url);
      setTimeout(() => setProg(0), 800);
    } catch (err) {
      clearInterval(tick);
      setProg(-1);
      setError(err.message || "Échec de l'envoi");
      setTimeout(() => setProg(0), 3000);
    }
  };

  const handleFile = (e) => upload(e.target.files?.[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    upload(e.dataTransfer.files?.[0]);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const isUploading = progress > 0 && progress < 100;

  return (
    <div className="img-upload-wrap">
      {label && (
        <label className="form-label">
          {label} {required && <span>*</span>}
        </label>
      )}

      <div
        className={`img-upload-zone${dragging ? " dragging" : ""}${value ? " has-image" : ""}`}
        style={{ minHeight: height }}
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={`Choisir une image pour ${label}`}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
          style={{ display: "none" }}
          onChange={handleFile}
        />

        {value ? (
          /* ── Preview ── */
          <div className="img-upload-preview">
            <img
              src={resolveUrl(value)}
              alt="Aperçu"
              style={{ width: "100%", height, objectFit: "cover", borderRadius: 6 }}
            />
            <div className="img-upload-overlay">
              <button
                type="button"
                className="img-upload-change-btn"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              >
                🔄 Changer
              </button>
              <button
                type="button"
                className="img-upload-remove-btn"
                onClick={handleRemove}
                aria-label="Supprimer l'image"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ) : (
          /* ── Drop zone ── */
          <div className="img-upload-placeholder">
            <div className="img-upload-icon" aria-hidden="true">
              {dragging ? "📂" : "🖼️"}
            </div>
            <div className="img-upload-text">
              {dragging
                ? "Déposez l'image ici"
                : "Cliquez ou glissez une image ici"}
            </div>
            <div className="img-upload-hint">
              JPG · PNG · WebP · GIF · SVG — max 8 Mo
            </div>
            <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 10 }}
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
              📁 Choisir un fichier
            </button>
          </div>
        )}

        {/* ── Progress bar ── */}
        {isUploading && (
          <div className="img-upload-progress-wrap" aria-live="polite">
            <div className="img-upload-progress-bar">
              <div
                className="img-upload-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="img-upload-progress-text">Envoi en cours… {progress}%</span>
          </div>
        )}

        {/* ── Upload complete flash ── */}
        {progress === 100 && (
          <div className="img-upload-success" aria-live="polite">✓ Image uploadée !</div>
        )}
      </div>

      {/* ── Error message ── */}
      {error && (
        <div className="img-upload-error" role="alert">⚠️ {error}</div>
      )}
    </div>
  );
}
