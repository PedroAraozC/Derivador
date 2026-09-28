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

// Texto de respaldo, sólo si el backend no contesta el menú (está caído o el
// menú guiado está apagado). El saludo REAL viene de GET /api/menu: si se
// escribiera acá, al primer cambio del árbol el portal y los demás canales
// estarían diciendo cosas distintas.
const SALUDO_RESPALDO =
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

// El aviso aceptado se recuerda por VERSIÓN, no con un simple "ya lo vio". Si
// el texto cambia de fondo, en el backend se sube la versión y al vecino se le
// vuelve a pedir: sin eso, un cambio silencioso dejaría a todo el mundo habiendo
// aceptado algo que nunca leyó.
const CLAVE_AVISO = "migueAvisoAceptado";

function avisoAceptado(version) {
  try {
    return localStorage.getItem(CLAVE_AVISO) === version;
  } catch {
    // Modo incógnito o storage bloqueado: se vuelve a pedir cada vez, que es
    // el lado correcto en el que equivocarse.
    return false;
  }
}

function guardarAviso(version) {
  try {
    localStorage.setItem(CLAVE_AVISO, version);
  } catch {
    /* sin storage el aviso reaparece la próxima; no es motivo para frenar */
  }
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

  // Botones del menú guiado. Vienen del backend (GET /api/menu y el campo
  // `menu` de cada respuesta): acá no hay ninguna lista de opciones escrita a
  // mano, justamente para que no se desincronice del árbol real.
  const [menu, setMenu] = useState(null); // { camino, opciones:[...], volver }

  // Aviso previo. Mientras `aviso` tenga contenido, es lo único que se ve: el
  // vecino no puede escribir ni elegir hasta aceptarlo.
  const [aviso, setAviso] = useState(null); // { version, titulo, encabezado, puntos, boton }

  // Vinculación de Telegram en curso, para no disparar dos enlaces seguidos.
  const [vinculando, setVinculando] = useState(false);

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

  // --- Menú de bienvenida al abrir por primera vez ---
  // Se pide al backend en vez de escribirlo acá: es el mismo menú que ve el
  // vecino por Telegram y por WhatsApp. El endpoint es estático y no pasa por
  // el límite de mensajes, así que abrir el chat no le come el cupo a nadie.
  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current && inputRef.current.focus(), 150);
    if (messages.length > 0) return;

    let vigente = true;
    (async () => {
      // Primero el aviso: si esta persona no aceptó la versión vigente, no se
      // carga el menú todavía. Que el aviso no cargue no puede dejar el chat
      // inutilizable, así que ante un error se sigue de largo.
      try {
        const av = await (await fetch(`${API_URL}/api/aviso`)).json();
        if (!vigente) return;
        if (av && av.version && !avisoAceptado(av.version)) {
          setAviso(av);
          return;
        }
      } catch {
        /* sin aviso disponible, se sigue al menú */
      }
      if (vigente) cargarMenu();
    })();
    return () => { vigente = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const cargarMenu = async () => {
    try {
      const data = await (await fetch(`${API_URL}/api/menu`)).json();
      if (data.habilitado && data.texto) {
        setMessages([{ from: "bot", text: data.texto }]);
        setMenu({ camino: data.camino, opciones: data.opciones, volver: data.volver });
      } else {
        setMessages([{ from: "bot", text: SALUDO_RESPALDO }]);
      }
    } catch {
      setMessages([{ from: "bot", text: SALUDO_RESPALDO }]);
    }
  };

  // Vincular Telegram. Sólo tiene sentido con sesión iniciada: el vínculo se
  // crea a partir de la identidad del token, que es lo que hace que el vecino
  // no tenga que escribir ninguna credencial en el chat de Telegram.
  const vincularTelegram = async () => {
    const token = localStorage.getItem("token");
    if (!token || vinculando) return;
    setVinculando(true);
    try {
      const res = await fetch(`${API_URL}/api/telegram/codigo`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
      });
      const data = await res.json();
      if (!res.ok || !data.enlace) throw new Error(data.error || "No se pudo generar el enlace");
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text:
            "Te abrí Telegram para vincular tu cuenta. Si no se abrió solo, entrá desde este enlace:\n" +
            `${data.enlace}\n\n` +
            "El enlace vale por 5 minutos y se usa una sola vez.",
        },
      ]);
      window.open(data.enlace, "_blank", "noopener,noreferrer");
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "No pude generar el enlace para vincular Telegram. Probá de nuevo en un momento." },
      ]);
    } finally {
      setVinculando(false);
    }
  };

  // Aceptar el aviso. Se guarda del lado del vecino para no volver a mostrarlo,
  // y se avisa al backend, que es el registro que sirve del lado del municipio.
  // Si ese registro falla, el vecino pasa igual: no tiene por qué pagar él un
  // problema nuestro de red.
  const aceptarAviso = () => {
    const version = aviso.version;
    guardarAviso(version);
    setAviso(null);
    fetch(`${API_URL}/api/aviso/aceptar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sessionId.current }),
    }).catch(() => {});
    cargarMenu();
  };

  const toggleOpen = () => {
    setTeaserDismissed(true);
    setTeaserVisible(false);
    setOpen((o) => !o);
  };

  // Mandar al backend. `cuerpo` es { mensaje } cuando el vecino escribió, o
  // { opcion: { camino, clave } } cuando tocó un botón. En el segundo caso el
  // texto de la consulta lo resuelve el backend contra su propio árbol: el
  // front no lo conoce y por eso no puede quedar desincronizado.
  const consultar = async (cuerpo, textoMostrado) => {
    setMessages((prev) => [...prev, { from: "user", text: textoMostrado }]);
    setMenu(null);
    setLoading(true);

    try {
      // Si el ciudadano está logueado, mandamos su token (mismo SSO de CidiTuc) para
      // que Migue pueda operar identificado (consultar turnos, etc.). Sin token, el
      // backend responde en modo anónimo/informativo.
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
        body: JSON.stringify({ ...cuerpo, sessionId: sessionId.current }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Error de servidor");
      }

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: data.respuesta || "Disculpá, no pude generar una respuesta." },
      ]);
      // Si la respuesta es un nodo del menú, vienen los botones para pintarlo.
      if (data.menu) setMenu(data.menu);
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

  const enviar = async () => {
    const texto = input.trim();
    if (!texto || loading) return;
    setInput("");
    await consultar({ mensaje: texto }, texto);
  };

  // Abrir un submenú o volver al menú principal: es texto que el backend ya
  // tiene armado, así que no pasa por el chat ni por el modelo. Se ve al toque.
  const abrirMenu = async (camino) => {
    if (loading) return;
    setLoading(true);
    try {
      const url = camino ? `${API_URL}/api/menu?camino=${encodeURIComponent(camino)}` : `${API_URL}/api/menu`;
      const data = await (await fetch(url)).json();
      if (data.texto) {
        setMessages((prev) => [...prev, { from: "bot", text: data.texto }]);
        setMenu({ camino: data.camino, opciones: data.opciones, volver: data.volver });
      }
    } catch {
      /* si falla, el vecino sigue teniendo el campo de texto */
    } finally {
      setLoading(false);
    }
  };

  // Tocar una opción. Un camino del menú principal puede abrir un submenú o
  // disparar la consulta directo; el backend nos dijo cuál en el campo `submenu`.
  const elegir = async (opcion) => {
    if (loading) return;
    if (menu && menu.camino === null) {
      if (opcion.submenu) return abrirMenu(opcion.clave);
      return consultar({ opcion: { camino: opcion.clave } }, `${opcion.icono} ${opcion.titulo}`);
    }
    return consultar(
      { opcion: { camino: menu.camino, clave: opcion.clave } },
      `${opcion.icono} ${opcion.titulo}`
    );
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

          {/* Aviso previo. Mientras esté, ocupa el lugar de los mensajes y del
              campo de texto: la aceptación tiene que ser una decisión, no algo
              que se saltea escribiendo por al lado. */}
          {aviso && (
            <div className="migue-aviso">
              <h3 className="migue-aviso-titulo">{aviso.titulo}</h3>
              <p className="migue-aviso-texto">{aviso.encabezado}</p>
              <ul className="migue-aviso-puntos">
                {aviso.puntos.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
              <button className="migue-aviso-btn" onClick={aceptarAviso}>
                {aviso.boton}
              </button>
            </div>
          )}

          {!aviso && (
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

            {/* Caminos del menú guiado. No obligan a nada: el campo de texto
                sigue habilitado y el vecino puede escribir lo que quiera. */}
            {!loading && menu && menu.opciones && menu.opciones.length > 0 && (
              <div className="migue-opciones">
                {menu.opciones.map((o) => (
                  <button
                    key={o.clave}
                    className="migue-opcion"
                    onClick={() => elegir(o)}
                    title={o.detalle || o.titulo}
                  >
                    <span className="migue-opcion-icono">{o.icono}</span>
                    <span>{o.titulo}</span>
                  </button>
                ))}
                {/* Vincular Telegram: sólo en el menú principal y sólo con
                    sesión iniciada, porque el vínculo se arma con la identidad
                    del token. Sin sesión no habría de dónde sacarla. */}
                {menu.camino === null && !!localStorage.getItem("token") && (
                  <button
                    className="migue-opcion migue-opcion-vincular"
                    onClick={vincularTelegram}
                    disabled={vinculando}
                  >
                    <span className="migue-opcion-icono">✈️</span>
                    <span>{vinculando ? "Generando enlace..." : "Vincular mi Telegram"}</span>
                  </button>
                )}
                {menu.volver && (
                  <button className="migue-opcion migue-opcion-volver" onClick={() => abrirMenu(null)}>
                    <span className="migue-opcion-icono">←</span>
                    <span>Volver al menú</span>
                  </button>
                )}
              </div>
            )}

            {/* Después de una respuesta no queda ningún botón, y el vecino que
                venía navegando se queda sin salida visible. Este "volver" suelto
                se la devuelve sin llenar la pantalla de opciones. */}
            {!loading && !menu && messages.length > 1 && (
              <div className="migue-opciones">
                <button className="migue-opcion migue-opcion-volver" onClick={() => abrirMenu(null)}>
                  <span className="migue-opcion-icono">←</span>
                  <span>Volver al menú</span>
                </button>
              </div>
            )}
          </div>
          )}

          {!aviso && (
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
          )}
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
