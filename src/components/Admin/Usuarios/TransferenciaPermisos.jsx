/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import KeyboardDoubleArrowLeftRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftRounded";
import "./TransferenciaPermisos.css";

const normalizar = (texto = "") =>
  texto
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Una de las dos columnas de la transfer list.
const PanelLista = ({
  titulo,
  tono,
  items,
  totalSinFiltro,
  seleccion,
  onToggle,
  onToggleTodos,
  onDobleClic,
  filtro,
  setFiltro,
  textoVacio,
}) => {
  const idsVisibles = items.map((item) => item.id);
  const seleccionadosVisibles = idsVisibles.filter((id) => seleccion.includes(id));
  const todos = idsVisibles.length > 0 && seleccionadosVisibles.length === idsVisibles.length;
  const algunos = seleccionadosVisibles.length > 0 && !todos;

  return (
    <section className={`cd-transfer__panel cd-transfer__panel--${tono}`} aria-label={titulo}>
      <header className="cd-transfer__cabecera">
        <Checkbox
          size="small"
          checked={todos}
          indeterminate={algunos}
          disabled={idsVisibles.length === 0}
          onChange={() => onToggleTodos(idsVisibles, !todos)}
          inputProps={{ "aria-label": `Seleccionar todo en ${titulo}` }}
        />
        <span className="cd-transfer__titulo">{titulo}</span>
        <span className="cd-transfer__contador">
          {seleccionadosVisibles.length > 0
            ? `${seleccionadosVisibles.length} / ${totalSinFiltro}`
            : totalSinFiltro}
        </span>
      </header>

      <div className="cd-transfer__buscador">
        <TextField
          size="small"
          fullWidth
          placeholder="Buscar…"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <ul className="cd-transfer__lista" role="listbox" aria-multiselectable="true">
        {items.length === 0 ? (
          <li className="cd-transfer__vacio">
            {filtro ? "Sin coincidencias para la búsqueda." : textoVacio}
          </li>
        ) : (
          items.map((item) => {
            const seleccionado = seleccion.includes(item.id);
            return (
              <li
                key={item.id}
                role="option"
                aria-selected={seleccionado}
                className={`cd-transfer__fila${seleccionado ? " cd-transfer__fila--seleccionada" : ""}`}
                onClick={() => onToggle(item.id)}
                onDoubleClick={() => onDobleClic(item.id)}
                title="Doble clic para mover"
              >
                <Checkbox
                  size="small"
                  checked={seleccionado}
                  tabIndex={-1}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => onToggle(item.id)}
                />
                <span className="cd-transfer__texto">
                  <span className="cd-transfer__nombre">{item.descripcion}</span>
                  {item.detalle && <span className="cd-transfer__detalle">{item.detalle}</span>}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
};

/**
 * Transfer list de permisos.
 * - items: [{ id, descripcion, detalle? }]
 * - estaAsignado(id): boolean
 * - onMover(ids, ver): ver = 1 asigna, 0 quita
 */
const TransferenciaPermisos = ({
  items = [],
  estaAsignado,
  onMover,
  etiquetaDisponibles = "Disponibles",
  etiquetaAsignados = "Asignados",
}) => {
  const [seleccionDisponibles, setSeleccionDisponibles] = useState([]);
  const [seleccionAsignados, setSeleccionAsignados] = useState([]);
  const [filtroDisponibles, setFiltroDisponibles] = useState("");
  const [filtroAsignados, setFiltroAsignados] = useState("");

  const ordenados = useMemo(
    () =>
      [...items].sort((a, b) =>
        (a.descripcion || "").localeCompare(b.descripcion || "", "es", { sensitivity: "base" })
      ),
    [items]
  );

  const disponibles = ordenados.filter((item) => !estaAsignado(item.id));
  const asignados = ordenados.filter((item) => estaAsignado(item.id));

  const coincide = (item, filtro) => {
    const termino = normalizar(filtro.trim());
    if (!termino) return true;
    return (
      normalizar(item.descripcion).includes(termino) ||
      normalizar(item.detalle).includes(termino)
    );
  };

  const disponiblesVisibles = disponibles.filter((item) => coincide(item, filtroDisponibles));
  const asignadosVisibles = asignados.filter((item) => coincide(item, filtroAsignados));

  const toggleEn = (setSeleccion) => (id) =>
    setSeleccion((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleTodosEn = (setSeleccion) => (ids, marcar) =>
    setSeleccion((prev) =>
      marcar ? [...new Set([...prev, ...ids])] : prev.filter((id) => !ids.includes(id))
    );

  const mover = (ids, ver) => {
    if (!ids.length) return;
    onMover(ids, ver);
    setSeleccionDisponibles((prev) => prev.filter((id) => !ids.includes(id)));
    setSeleccionAsignados((prev) => prev.filter((id) => !ids.includes(id)));
  };

  const asignarSeleccion = () => mover(seleccionDisponibles, 1);
  const quitarSeleccion = () => mover(seleccionAsignados, 0);
  const asignarTodos = () => mover(disponiblesVisibles.map((item) => item.id), 1);
  const quitarTodos = () => mover(asignadosVisibles.map((item) => item.id), 0);

  return (
    <div className="cd-transfer">
      <PanelLista
        titulo={etiquetaDisponibles}
        tono="neutro"
        items={disponiblesVisibles}
        totalSinFiltro={disponibles.length}
        seleccion={seleccionDisponibles}
        onToggle={toggleEn(setSeleccionDisponibles)}
        onToggleTodos={toggleTodosEn(setSeleccionDisponibles)}
        onDobleClic={(id) => mover([id], 1)}
        filtro={filtroDisponibles}
        setFiltro={setFiltroDisponibles}
        textoVacio="No quedan permisos por asignar."
      />

      <div className="cd-transfer__controles" aria-label="Mover permisos">
        <Tooltip title="Asignar seleccionados" placement="top">
          <span>
            <IconButton
              color="primary"
              className="cd-transfer__boton"
              onClick={asignarSeleccion}
              disabled={seleccionDisponibles.length === 0}
              aria-label="Asignar seleccionados"
            >
              <KeyboardArrowRightRoundedIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Quitar seleccionados" placement="top">
          <span>
            <IconButton
              color="primary"
              className="cd-transfer__boton"
              onClick={quitarSeleccion}
              disabled={seleccionAsignados.length === 0}
              aria-label="Quitar seleccionados"
            >
              <KeyboardArrowLeftRoundedIcon />
            </IconButton>
          </span>
        </Tooltip>
        <span className="cd-transfer__separador" />
        <Tooltip title="Asignar todos los visibles" placement="top">
          <span>
            <Button
              size="small"
              variant="text"
              className="cd-transfer__boton cd-transfer__boton--texto"
              onClick={asignarTodos}
              disabled={disponiblesVisibles.length === 0}
              startIcon={<KeyboardDoubleArrowRightRoundedIcon />}
            >
              Todos
            </Button>
          </span>
        </Tooltip>
        <Tooltip title="Quitar todos los visibles" placement="top">
          <span>
            <Button
              size="small"
              variant="text"
              className="cd-transfer__boton cd-transfer__boton--texto"
              onClick={quitarTodos}
              disabled={asignadosVisibles.length === 0}
              startIcon={<KeyboardDoubleArrowLeftRoundedIcon />}
            >
              Ninguno
            </Button>
          </span>
        </Tooltip>
      </div>

      <PanelLista
        titulo={etiquetaAsignados}
        tono="activo"
        items={asignadosVisibles}
        totalSinFiltro={asignados.length}
        seleccion={seleccionAsignados}
        onToggle={toggleEn(setSeleccionAsignados)}
        onToggleTodos={toggleTodosEn(setSeleccionAsignados)}
        onDobleClic={(id) => mover([id], 0)}
        filtro={filtroAsignados}
        setFiltro={setFiltroAsignados}
        textoVacio="Todavía no tiene permisos asignados."
      />
    </div>
  );
};

export default TransferenciaPermisos;
