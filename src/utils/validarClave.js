 export function validarClave(clave) {
    // La expresión regular busca al menos un número (\d) y al menos una letra mayúscula ([A-Z])
    const regex = /^(?=.*\d)(?=.*[A-Z])/;
    return regex.test(clave);
  }