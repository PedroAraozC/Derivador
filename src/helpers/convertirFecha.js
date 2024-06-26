export function formatearFecha(fechaEnFormatoISO) {
    const fecha = new Date(fechaEnFormatoISO + "T12:34:56Z");

    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // El mes se indexa desde 0
    const anio = fecha.getFullYear();

    return `${dia}/${mes}/${anio}`;
}

export function formatearFechaHora(fechaISO) {
    // Convertir la fecha de formato ISO a objeto de fecha
    const fecha = new Date(fechaISO);
  
    // Obtener partes de la fecha
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
  
    // Formatear la fecha en el formato yyyy-mm-dd
    const fechaFormateada = `${anio}-${mes}-${dia}`;
  
    // Devolver el resultado final
    return fechaFormateada;
  }