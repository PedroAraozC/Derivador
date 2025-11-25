export const formatNumber = (number) => {
  if(number != ""){

    const number2=parseFloat(number)
    return number2.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return "";
  };

// Nueva función para formatear números con separadores argentinos
export const formatNumberAR = (number) => {
  if (number === null || number === undefined || number === "") {
    return "0,00";
  }
  
  const parsedNumber = parseFloat(number);
  if (isNaN(parsedNumber)) {
    return "0,00";
  }
  
  return parsedNumber.toLocaleString('es-AR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};