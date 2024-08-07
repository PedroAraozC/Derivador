export function cuilToDni(cuil) {
 
    // Asegurarse de que el CUIL tenga exactamente 11 caracteres
    if (cuil.length != 11) {
        throw new Error("El CUIL debe tener 11 dígitos");
    }
    // Extraer el DNI del CUIL (dígitos del 3 al 10)
    const dni = cuil.substring(2, 10);
    return dni;
}