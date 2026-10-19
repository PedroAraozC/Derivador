import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";

// Secciones que se muestran en el Home y en la barra de navegación.
// Los filtros replican exactamente los que usaba el Home original.
const opcion = (p) => p.nombre_opcion?.toUpperCase();

export const SECCIONES = [
  {
    id: "tramites",
    titulo: "Trámites",
    subtitulo: "Iniciá y seguí tus trámites",
    color: "azul",
    icono: DescriptionOutlinedIcon,
    filtro: (p) => opcion(p) === "TRÁMITES" || opcion(p) === "TRAMITES",
  },
  {
    id: "turnos",
    titulo: "Turnos",
    subtitulo: "Reservá un turno",
    color: "violeta",
    icono: EventAvailableOutlinedIcon,
    filtro: (p) => opcion(p) === "TURNOS",
  },
  {
    id: "consultas",
    titulo: "Consultas",
    subtitulo: "Obtené información",
    color: "verde",
    icono: HelpOutlineRoundedIcon,
    filtro: (p) => opcion(p) === "CONSULTAS",
  },
  {
    id: "aplicaciones",
    titulo: "Aplicaciones",
    subtitulo: "Accedé a sistemas y herramientas",
    color: "naranja",
    icono: GridViewRoundedIcon,
    filtro: (p) => opcion(p) === "APLICACIONES" || p.sistema_externo === 1,
    soloEmpleados: true,
  },
];

// Permisos habilitados que se listan en el Home (excluye perfil y configuración).
export const permisosHome = (permisos = []) =>
  permisos.filter(
    (permiso) =>
      permiso.ver === 1 &&
      permiso.nombre_opcion !== "EDICION DE PERFIL" &&
      permiso.nombre_opcion !== "CONFIGURACIÓN"
  );

// Devuelve las secciones visibles para el usuario con sus opciones.
export const construirSecciones = (permisos = [], user) => {
  const habilitados = permisosHome(permisos);
  return SECCIONES.filter(
    (seccion) => !(seccion.soloEmpleados && user?.id_tusuario === 3)
  ).map((seccion) => ({
    ...seccion,
    options: habilitados.filter(seccion.filtro),
  }));
};

// Permisos habilitados de una opción puntual (ej. "CONFIGURACIÓN"), ordenados.
export const permisosPorOpcion = (permisos = [], nombreOpcion) =>
  permisos
    .filter(
      (permiso) => permiso.ver === 1 && permiso.nombre_opcion === nombreOpcion
    )
    .slice()
    .sort((a, b) =>
      (a.descripcion || "").localeCompare(b.descripcion || "", "es", {
        sensitivity: "base",
      })
    );
