import { useParams } from "react-router-dom";
const Licitacion = () => {

    const { id } = useParams();
    //Hacer un get con la consulta sql para poder armar el componente mandando el id sacado del params
    //Tambien hay que hacer el controlador 🙄🙄😫😡😡😡
  return (
    <div>
        <h2>Licitación {id}</h2>
    </div>
  )
}

export default Licitacion