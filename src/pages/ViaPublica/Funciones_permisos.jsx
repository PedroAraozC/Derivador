

////rutina llena combo mano
export async function comboMano(directorio) {

    const JSONdata = JSON.stringify({
      tarea: "llenacombomano",
    }); // Send the data to the server in JSON format.

    const endpoint = directorio+"solicitudescorreo.php"; // API endpoint where we send form data.

    // Form the request for sending data to the server.
    const options = {
      method: "POST", // The method is POST because we are sending data.
      headers: { "Content-Type": "application/json" }, // Tell the server we're sending JSON.
      body: JSONdata, // Body of the request is the JSON data we created above.
    };
    const response = await fetch(endpoint, options); // Send the form data to our forms API on Vercel and get a response.

    const result = await response.json();
    return result;
}
//////////////////////

////rutina llena combo perso
export async function combopeso(directorio) {

    const JSONdata = JSON.stringify({
      tarea: "llenacombopeso",
    }); // Send the data to the server in JSON format.

    const endpoint = directorio+"solicitudescorreo.php"; // API endpoint where we send form data.

    // Form the request for sending data to the server.
    const options = {
      method: "POST", // The method is POST because we are sending data.
      headers: { "Content-Type": "application/json" }, // Tell the server we're sending JSON.
      body: JSONdata, // Body of the request is the JSON data we created above.
    };
    const response = await fetch(endpoint, options); // Send the form data to our forms API on Vercel and get a response.

    const result = await response.json();
    return result;
}
//////////////////////




////rutina llena combo permiso///
export async function combopermiso(directorio) {

    const JSONdata = JSON.stringify({
      tarea: "llenacombotipopermiso",
    }); // Send the data to the server in JSON format.

    const endpoint = directorio+"solicitudescorreo.php"; // API endpoint where we send form data.

    // Form the request for sending data to the server.
    const options = {
      method: "POST", // The method is POST because we are sending data.
      headers: { "Content-Type": "application/json" }, // Tell the server we're sending JSON.
      body: JSONdata, // Body of the request is the JSON data we created above.
    };
    const response = await fetch(endpoint, options); // Send the form data to our forms API on Vercel and get a response.

    const result = await response.json();
    return result;
}
/////////////////////////////////////////




export async function grabarsolicitudcorreo(directorio,data) {

    const JSONdata = JSON.stringify({
      tarea:"grabasolicitudcorreo",  
      datos:data
    }); // Send the data to the server in JSON format.

    const endpoint = directorio+"solicitudescorreo.php"; // API endpoint where we send form data.

    // Form the request for sending data to the server.
    const options = {
      method: "POST", // The method is POST because we are sending data.
      headers: { "Content-Type": "application/json" }, // Tell the server we're sending JSON.
      body: JSONdata, // Body of the request is the JSON data we created above.
    };
    const response = await fetch(endpoint, options); // Send the form data to our forms API on Vercel and get a response.

    const result = await response.json();
    return result;
}




export async function token_AUT_new() {

    const token = localStorage.getItem("token");

    const JSONdata = JSON.stringify({}); // Send the data to the server in JSON format.

    const endpoint = "https://estadisticas.smt.gob.ar:5000/usuarios/authStatus"; // API endpoint where we send form data.

    // Form the request for sending data to the server.
    const options = {
      method: "GET", // The method is POST because we are sending data.
      headers: { "Content-Type": "application/json","Authorization" : token }, // Tell the server we're sending JSON.
      //body: JSONdata, // Body of the request is the JSON data we created above.
    };
    const response = await fetch(endpoint, options); // Send the form data to our forms API on Vercel and get a response.

    const result = await response.json();
    return result
}