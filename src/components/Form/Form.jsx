import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from '../../config/axios';

const Form = ()=> {
  const [procedimientos, setProcedimientos] = React.useState([]);
  const [procedimientoElegido, setProcedimientoElegido] = React.useState({procedimientoElegido : ""});


  const obtenerProcedimientosAlmacenados = async () => {
    try {
      const resultado = await axios.get("/listar/listarProcedimientos");
      console.log(resultado)
      setProcedimientos(resultado.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    obtenerProcedimientosAlmacenados();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProcedimientoElegido(value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 180 }}>
        <InputLabel id="">Procedimientos</InputLabel>
        <Select
          value={procedimientoElegido.value}
          onChange={handleChange}
          autoWidth
          label="Procedimientos"
        >
          {procedimientos?.length > 0 ?
                procedimientos
                  ?.filter(
                    (sp) =>
                        sp.ROUTINE_NAME.includes("sp_plantaporreparticion") ||
                        sp.ROUTINE_NAME.includes("sp_plantamunicipal") 
                  )
                  .map((st, index) => (
                    <MenuItem value={st.ROUTINE_NAME} key={index}>
                      {/* {formatProcedimientoName(st.routine_name)} */}
                      {st.ROUTINE_NAME}
                    </MenuItem>
                  )) : <p></p>} 
        </Select>
      </FormControl>
    </div>
  );
}

export default Form;