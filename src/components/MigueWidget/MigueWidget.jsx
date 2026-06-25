import { useEffect, useRef, useState } from "react";
import "./MigueWidget.css";

// =====================================================
// CONFIG
// =====================================================
// URL pública del backend de Migue (el que expone POST /api/chat).
const API_URL = (import.meta.env.VITE_MIGUE_API_URL || "http://localhost:3000").replace(/\/$/, "");

// Avatar de Migue. Por defecto usa el sticker "Migue saludando" ya hosteado.
// Para usar tu propio PNG: poné VITE_MIGUE_AVATAR_URL en el .env, o importá un
// asset local y reemplazá esta constante.
const AVATAR_URL =
  import.meta.env.VITE_MIGUE_AVATAR_URL ||
  "https://raw.githubusercontent.com/lucianobonilla27/stickers-Migue/refs/heads/main/MigueSaludoOpt.webp";

// Mensajitos que aparecen y se ocultan junto al avatar cuando el chat está cerrado.
const TEASERS = [
  "¡Hola! Soy Migue 👋",
  "¿Necesitás ayuda?",
  "Preguntame sobre trámites municipales",
  "¿Buscás una oficina o dirección?",
  "Estoy para ayudarte 😊",
];

const SALUDO_INICIAL =
  "¡Hola! Soy Migue, el asistente virtual de la Municipalidad de San Miguel de Tucumán. ¿En qué puedo ayudarte?";

// =====================================================
// HELPERS
// =====================================================
// Convierte las URLs dentro del texto en enlaces clickeables (el resto queda
// como texto plano). En WhatsApp las URLs se autoenlazan; en la web hay que hacerlo.
function renderConLinks(texto) {
  const partes = String(texto).split(/(https?:\/\/[^\s]+|www\.[^\s]+)/g);
  return partes.map((parte, i) => {
    if (/^(https?:\/\/|www\.)/.test(parte)) {
      // Separar puntuación final pegada a la URL (ej: "...gob.ar." o "...gob.ar)")
      const m = parte.match(/^(.*?)([.,;:!?)\]]*)$/);
      const url = m ? m[1] : parte;
      const cola = m ? m[2] : "";
      const href = url.startsWith("http") ? url : `https://${url}`;
      return (
        <span key={i}>
          <a href={href} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
          {cola}
        </span>
      );
    }
    return parte;
  });
}

function getSessionId() {
  let id = localStorage.getItem("migueSessionId");
  if (!id) {
    id =
      (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
      "web-" + Date.now() + "-" + Math.random().toString(36).slice(2);
    localStorage.setItem("migueSessionId", id);
  }
  return id;
}

// =====================================================
// COMPONENTE
// =====================================================
const MigueWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { from: 'user' | 'bot', text }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Teaser (burbujita que aparece/desaparece)
  const [teaserText, setTeaserText] = useState("");
  const [teaserVisible, setTeaserVisible] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(false);

  const sessionId = useRef(getSessionId());
  const listRef = useRef(null);
  const inputRef = useRef(null);

  // --- Ciclo de teasers cuando el chat está cerrado ---
  useEffect(() => {
    if (open || teaserDismissed) {
      setTeaserVisible(false);
      return;
    }

    let idx = 0;
    let hideTimer = null;

    const showNext = () => {
      setTeaserText(TEASERS[idx % TEASERS.length]);
      setTeaserVisible(true);
      idx++;
      hideTimer = setTimeout(() => setTeaserVisible(false), 4500);
    };

    // Primer teaser al toque, después cada ~9s
    const firstTimer = setTimeout(showNext, 1500);
    const cycle = setInterval(showNext, 9000);

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(hideTimer);
      clearInterval(cycle);
    };
  }, [open, teaserDismissed]);

  // --- Auto-scroll al último mensaje ---
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // --- Saludo inicial al abrir por primera vez ---
  useEffect(() => {
    if (open) {
      if (messages.length === 0) {
        setMessages([{ from: "bot", text: SALUDO_INICIAL }]);
      }
      // Foco en el input
      setTimeout(() => inputRef.current && inputRef.current.focus(), 150);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggleOpen = () => {
    setTeaserDismissed(true);
    setTeaserVisible(false);
    setOpen((o) => !o);
  };

  const enviar = async () => {
    const texto = input.trim();
    if (!texto || loading) return;

    setMessages((prev) => [...prev, { from: "user", text: texto }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: texto, sessionId: sessionId.current }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Error de servidor");
      }

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: data.respuesta || "Disculpá, no pude generar una respuesta." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Disculpá, en este momento no puedo responder. Por favor, intentá de nuevo en unos minutos.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <div className="migue-widget">
      {/* Ventana de chat */}
      {open && (
        <div className="migue-panel" role="dialog" aria-label="Chat con Migue">
          <div className="migue-panel-header">
            <img src={AVATAR_URL} alt="Migue" className="migue-header-avatar" />
            <div className="migue-header-info">
              <strong>Migue</strong>
              <span>Asistente virtual · CiDiTuc</span>
            </div>
            <button className="migue-close-btn" onClick={toggleOpen} aria-label="Cerrar chat">
              ×
            </button>
          </div>

          <div className="migue-messages" ref={listRef}>
            {messages.map((m, i) => (
              <div key={i} className={`migue-msg migue-msg-${m.from}`}>
                {renderConLinks(m.text)}
              </div>
            ))}
            {loading && (
              <div className="migue-msg migue-msg-bot migue-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>

          <div className="migue-input-bar">
            <textarea
              ref={inputRef}
              className="migue-input"
              placeholder="Escribí tu consulta..."
              value={input}
              rows={1}
              maxLength={1000}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <button
              className="migue-send-btn"
              onClick={enviar}
              disabled={loading || !input.trim()}
              aria-label="Enviar mensaje"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Burbuja teaser */}
      {!open && teaserVisible && (
        <div className="migue-teaser" onClick={toggleOpen}>
          {teaserText}
        </div>
      )}

      {/* Botón flotante (FAB) con el avatar de Migue */}
      <button
        className={`migue-fab ${open ? "migue-fab-open" : ""}`}
        onClick={toggleOpen}
        aria-label={open ? "Cerrar chat de Migue" : "Abrir chat de Migue"}
      >
        {open ? (
          <span className="migue-fab-close">×</span>
        ) : (
          <img src={AVATAR_URL} alt="Migue" className="migue-fab-avatar" />
        )}
      </button>
    </div>
  );
};

export default MigueWidget;
