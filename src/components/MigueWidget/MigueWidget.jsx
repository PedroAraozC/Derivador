import { useEffect } from "react";

// =====================================================
// MigueWidget — cargador del chat de Migue
// =====================================================
// Esto ya NO es el chat: es sólo la línea que lo trae. El chat vive en el
// servidor de Migue (widget.js) y es el mismo que corre en smt.gob.ar y en el
// resto de los sitios municipales.
//
// POR QUÉ SE REEMPLAZÓ EL COMPONENTE QUE ESTABA ACÁ
//   Había DOS implementaciones del mismo chat: este componente de React y el
//   widget embebible. Cada cambio —una opción del menú, un texto del aviso, un
//   arreglo— había que hacerlo dos veces, y la segunda vez que eso pasa alguien
//   se olvida de una. Además, cualquier corrección en esta versión necesitaba
//   compilar y desplegar el portal entero; la del servidor de Migue llega sola.
//
//   Ahora hay una sola: se corrige en un lugar y se ve en todos los canales.
//
// data-sesion="true" ES LO QUE DISTINGUE A ESTE SITIO
//   Le dice al widget que acá SÍ hay sesión del Ciudadano Digital, así que
//   puede mandar el token y ofrecer la vinculación con Telegram. En smt.gob.ar
//   no se pone, porque ahí no hay sesión: sin ese permiso explícito el widget
//   no toca el localStorage de nadie.

const API_URL = (import.meta.env.VITE_MIGUE_API_URL || "https://migue.smt.gob.ar").replace(/\/$/, "");
const ID_SCRIPT = "migue-widget-script";

const MigueWidget = () => {
  useEffect(() => {
    // En desarrollo, React monta dos veces; sin esta guarda quedarían dos chats.
    if (document.getElementById(ID_SCRIPT)) return;

    const s = document.createElement("script");
    s.id = ID_SCRIPT;
    s.src = `${API_URL}/widget.js`;
    s.defer = true;
    s.dataset.api = API_URL;
    s.dataset.sesion = "true";
    document.body.appendChild(s);

    // A propósito no se limpia al desmontar: el widget se monta una vez por
    // pestaña y vive mientras el portal esté abierto. Quitarlo en cada cambio
    // de ruta cerraría la conversación que el vecino tiene a medias.
  }, []);

  return null;
};

export default MigueWidget;
