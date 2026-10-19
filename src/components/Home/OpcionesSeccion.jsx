/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { registrarAccesoExterno } from "../../helpers/registrarAccesoExterno";

// Lista de opciones de una sección del Home.
// La lógica de apertura de cada opción es la misma que tenía NuevaCard.
const OpcionesSeccion = ({
  titulo,
  subtitulo,
  icono: Icono,
  color = "azul",
  options,
  user,
  mensajeVacio = "No tenés opciones habilitadas en esta sección.",
}) => {
  const navigate = useNavigate();

  const opcionesOrdenadas = options?.slice().sort((a, b) =>
    (a.descripcion || "").localeCompare(b.descripcion || "", "es", {
      sensitivity: "base",
    })
  );

  const handleOptionClick = (option) => {
    const token = localStorage.getItem("token");

    if (option.sistema_externo == null) {
      navigate(`/${option.nombre_proceso}`);
      return;
    }

    registrarAccesoExterno(option.id_proceso, option.id_opcion, user);

    if (option.id_opcion === 6) {
      switch (option.nombre_proceso) {
        case "tarjeta_sube":
          irATURNOS(1710);
          break;
        case "castracion_animal":
          // irATURNOS(1800);
          irACASTRACION();
          break;
        case "campus_ambiental":
          irATURNOS(1510);
          break;
        case "catastro":
          irATURNOS(515);
          break;
        case "licencia_conducir":
          irATURNOS(1721);
          break;
        case "ficha_medica":
          irATURNOS(241);
          break;
        case "asistencia_publica":
          irAAsitPubica();
          break;
        case "revision_medica_ledesma":
          irATURNOS(1812);
          break;
        default:
          break;
      }
    } else if (option.nombre_proceso === "carnet_sanidad") {
      const url = new URL(`${option.sistema_externo}`);
      window.open(url.toString(), "_blank");
    } else {
      const url = new URL(`${option.sistema_externo}/?auth=${token}`);
      url.searchParams.append("auth", token);
      window.open(url.toString(), "_blank");
    }
  };

  const irACASTRACION = () => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://animales.smt.gob.ar/`
    );
    url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };
  const irATURNOS = (reparticion) => {
    const token = localStorage.getItem("token");
    const url = new URL(
      `https://turnos.smt.gob.ar/?auth=${token}&destino=turnero&rep=${reparticion}`
    );
    url.searchParams.append("auth", token);
    window.open(url.toString(), "_blank");
  };

  const irAAsitPubica = async () => {
    const tokenAsitencia = "f64b5a5a3efd8ade6bbf6c0b595d08aeef25c5fa";
    const documentoRecortado = user.documento_persona.toString().slice(2, -1);

    const resp = await fetch(
      "https://asistenciapublica.bymovi.com/api/v3/turnero/link_acceso_paciente",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `${tokenAsitencia}`,
        },
        body: JSON.stringify({
          nombre: `${user.nombre_persona} ${user.apellido_persona}`,
          documento: documentoRecortado,
          cuil: user.documento_persona,
          telefono: user.telefono_persona,
          email: user.email_persona,
          fecha_nacimiento: user.fecha_nacimiento_persona
            ? user.fecha_nacimiento_persona.toString().slice(0, 10)
            : "",
          genero: user.id_genero == 1 ? "F" : "M",
        }),
      }
    );
    const data = await resp.json();
    const url = new URL(`${data.url}`);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const iframe = document.createElement("iframe");
      iframe.src = url.toString();
      iframe.style.position = "fixed";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.style.zIndex = "9999";

      const closeBtn = document.createElement("button");
      closeBtn.innerHTML = "✕";
      closeBtn.style.position = "fixed";
      closeBtn.style.top = "50px";
      closeBtn.style.right = "5px";
      closeBtn.style.zIndex = "10000";
      closeBtn.style.padding = "10px 15px";
      closeBtn.style.backgroundColor = "#1976d2";
      closeBtn.style.color = "white";
      closeBtn.style.border = "none";
      closeBtn.style.borderRadius = "4px";
      closeBtn.style.cursor = "pointer";

      const closeIframe = () => {
        document.body.removeChild(iframe);
        document.body.removeChild(closeBtn);
        window.removeEventListener("popstate", closeIframe);
      };

      closeBtn.addEventListener("click", closeIframe);
      window.addEventListener("popstate", closeIframe);

      document.body.appendChild(iframe);
      document.body.appendChild(closeBtn);
    } else {
      window.open(url.toString(), "_blank");
    }
  };

  return (
    <section className="cd-lista cd-aparecer" aria-label={titulo}>
      <div className="cd-lista__cabecera">
        {Icono && (
          <span className={`cd-tile cd-tile--${color}`}>
            <Icono />
          </span>
        )}
        <div>
          <h2 className="cd-lista__titulo">{titulo}</h2>
          {subtitulo && <p className="cd-lista__sub">{subtitulo}</p>}
        </div>
      </div>

      {opcionesOrdenadas?.length ? (
        <div className="cd-opciones">
          {opcionesOrdenadas.map((option) => {
            const IconoOpcion = option.seccionIcono || Icono;
            return (
              <button
                key={option.id_proceso}
                type="button"
                className="cd-opcion"
                onClick={() => handleOptionClick(option)}
              >
                <span
                  className={`cd-tile cd-tile--${option.seccionColor || color}`}
                >
                  {IconoOpcion && <IconoOpcion />}
                </span>
                <span className="cd-opcion__textos">
                  <span className="cd-opcion__nombre">
                    {option.descripcion || "S/N"}
                  </span>
                  {option.sistema_externo != null && (
                    <span className="cd-opcion__meta">
                      <OpenInNewRoundedIcon />
                      Se abre en una pestaña nueva
                    </span>
                  )}
                </span>
                <ChevronRightRoundedIcon className="cd-chevron" />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="cd-vacio">{mensajeVacio}</div>
      )}
    </section>
  );
};

export default OpcionesSeccion;
