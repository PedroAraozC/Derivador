import axios from "../config/axios";

// Registra el acceso (o intento de acceso) a un sistema externo.
// Fire-and-forget: nunca bloquea ni interrumpe la redirección, aunque el endpoint falle.
export const registrarAccesoExterno = (idProceso, id_opcion, user) => {
  axios
    .post("/usuarios/registrarAccesoExterno", {
      id_proceso: idProceso ?? null,
      id_opcion: id_opcion ?? null,
      id_persona: user?.id_persona ?? null,
      es_empleado: user?.id_tusuario === 3 ? 0 : 1,
    })
    .catch((error) =>
      console.error("No se pudo registrar el acceso externo:", error)
    );
};
