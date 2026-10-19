/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

// Encabezado estándar de las páginas internas.
// `volver` acepta true (navigate(-1)) o una ruta destino.
const EncabezadoPagina = ({ sup, titulo, subtitulo, acciones, volver, className = "" }) => {
  const navigate = useNavigate();

  const handleVolver = () => {
    if (typeof volver === "string") navigate(volver);
    else navigate(-1);
  };

  return (
    <header className={`cd-encabezado ${className}`.trim()}>
      <div className="cd-encabezado__izquierda">
        {volver && (
          <button type="button" className="cd-encabezado__volver no-print" onClick={handleVolver}>
            <ArrowBackIosNewRoundedIcon />
            Volver
          </button>
        )}
        {sup && <span className="cd-encabezado__sup">{sup}</span>}
        <h1 className="cd-encabezado__titulo">{titulo}</h1>
        {subtitulo && <p className="cd-encabezado__sub">{subtitulo}</p>}
      </div>
      {acciones && <div className="cd-encabezado__acciones">{acciones}</div>}
    </header>
  );
};

export default EncabezadoPagina;
