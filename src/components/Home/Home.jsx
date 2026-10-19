import "./Home.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import useStore from "../../Zustand/Zustand";
import OpcionesSeccion from "./OpcionesSeccion";
import { construirSecciones } from "../../helpers/seccionesHome";
import isotipo from "../../assets/logoMuni-sm.png";

const normalizar = (texto = "") =>
  texto
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const Home = () => {
  const { user, obtenerPermisos, permisos } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [busqueda, setBusqueda] = useState("");
  const listaRef = useRef(null);

  useEffect(() => {
    obtenerPermisos(user?.id_tusuario, user?.id_persona);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const secciones = useMemo(
    () => construirSecciones(permisos, user),
    [permisos, user]
  );

  const seccionParam = searchParams.get("seccion");
  const seccionActiva =
    secciones.find((seccion) => seccion.id === seccionParam) ||
    secciones.find((seccion) => seccion.options.length > 0) ||
    secciones[0];

  const seleccionarSeccion = (id) => {
    setBusqueda("");
    setSearchParams({ seccion: id }, { replace: true });
  };

  const desplazarALista = () => {
    if (!listaRef.current) return;
    const reducirMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    listaRef.current.scrollIntoView({
      behavior: reducirMovimiento ? "auto" : "smooth",
      block: "start",
    });
  };

  // Al elegir una sección (tarjeta o barra de navegación) se baja hasta la lista
  useEffect(() => {
    if (seccionParam) desplazarALista();
  }, [seccionParam]);

  // Búsqueda visual sobre todas las opciones habilitadas
  const termino = normalizar(busqueda.trim());
  const resultados = termino
    ? secciones.flatMap((seccion) =>
        seccion.options
          .filter(
            (opcion) =>
              normalizar(opcion.descripcion).includes(termino) ||
              normalizar(opcion.nombre_proceso).includes(termino)
          )
          .map((opcion) => ({
            ...opcion,
            seccionColor: seccion.color,
            seccionIcono: seccion.icono,
          }))
      )
    : null;

  const handleBuscar = (evento) => {
    evento.preventDefault();
    desplazarALista();
  };

  return (
    <div className="cd-shell cd-home">
      <div className="cd-home__contenedor">
        <section className="cd-hero">
          <div className="cd-hero__arte" aria-hidden="true" />
          <img className="cd-hero__isotipo" src={isotipo} alt="" aria-hidden="true" />

          <div className="cd-hero__contenido">
            <div className="cd-hero__sup">Hola, {user?.nombre_persona}</div>
            <h1 className="cd-hero__titulo">
              Municipalidad de
              <br />
              <span>la Ciudad de San Miguel de Tucumán</span>
            </h1>
            <p className="cd-hero__texto">
              Realizá tus trámites, sacá turnos y accedé a toda la información
              municipal desde un solo lugar.
            </p>

            <form className="cd-buscador" role="search" onSubmit={handleBuscar}>
              <SearchRoundedIcon className="cd-buscador__icono" />
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="¿Qué trámite estás buscando?"
                aria-label="Buscar trámites, turnos o información"
              />
              <button
                type="submit"
                className="cd-buscador__boton"
                aria-label="Buscar"
              >
                <ArrowForwardRoundedIcon />
              </button>
            </form>
          </div>
        </section>

        <div className="cd-secciones">
          {secciones.map((seccion) => {
            const Icono = seccion.icono;
            const activa = !resultados && seccionActiva?.id === seccion.id;
            return (
              <button
                key={seccion.id}
                type="button"
                className={`cd-seccion${activa ? " cd-seccion--activa" : ""}`}
                onClick={() => seleccionarSeccion(seccion.id)}
                aria-pressed={activa}
              >
                <span className={`cd-tile cd-tile--${seccion.color}`}>
                  <Icono />
                </span>
                <span className="cd-seccion__textos">
                  <span className="cd-seccion__titulo">{seccion.titulo}</span>
                  <span className="cd-seccion__sub">{seccion.subtitulo}</span>
                </span>
                <ChevronRightRoundedIcon className="cd-chevron" />
              </button>
            );
          })}
        </div>

        <div ref={listaRef}>
          {resultados ? (
            <OpcionesSeccion
              key="busqueda"
              titulo="Resultados"
              subtitulo={`Coincidencias para “${busqueda.trim()}”`}
              icono={SearchRoundedIcon}
              color="azul"
              options={resultados}
              user={user}
              mensajeVacio="No encontramos opciones con ese nombre. Probá con otra palabra."
            />
          ) : (
            seccionActiva && (
              <OpcionesSeccion
                key={seccionActiva.id}
                titulo={seccionActiva.titulo}
                subtitulo={seccionActiva.subtitulo}
                icono={seccionActiva.icono}
                color={seccionActiva.color}
                options={seccionActiva.options}
                user={user}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
