/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Modal } from '@mui/base';
import { Button, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import AgregarProceso from './AgregarProceso';
import useStore from '../../../Zustand/Zustand';
import axios from '../../../config/axios';

// eslint-disable-next-line react/prop-types
export default function TablaOpciones() {
  const [openRows, setOpenRows] = useState({});
  const { opciones, obtenerOpciones } = useStore();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [opcionValues, setOpcionValues] = useState({
    nombre_opcion: "", // Nombre de la opcion
    habilita: 1
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;

    setOpcionValues({
      ...opcionValues,
      [name]: newValue,
    });
    console.log(opcionValues);
  };
  useEffect(() => {
    obtenerOpciones()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRowClick = (nombre_opcion) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [nombre_opcion]: !prevOpenRows[nombre_opcion]
    }));
  };

  const groupedOptions = Array.isArray(opciones.opciones) ? opciones.opciones.reduce((acc, opcion) => {
    const { nombre_opcion } = opcion;
    const existingOption = acc.find(item => item.nombre_opcion === nombre_opcion);
    if (existingOption) {
      // Si ya existe la opción en el array, agregamos el subítem
      existingOption.subItems.push(opcion);
    } else {
      // Si no existe la opción, la agregamos al array con su subítem
      acc.push({ nombre_opcion, subItems: [opcion] });
    }
    return acc;
  }, []) : [];

  const groupedOptionsWithId = groupedOptions.map((option, index) => ({
    id: index + 1, // El índice comienza desde 0, por lo que sumamos 1 para obtener un ID que comience desde 1
    nombre_opcion: option.nombre_opcion,
    subItems: option.subItems
  }));

  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    height: '50%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleAgregar = async(event, opcion) => {
    event.preventDefault()
    // const formularioValido = validarFormulario();
        try {
            const response = await axios.post("/admin/altaOpcion", opcion );
            console.log(response.data)
            return response.data;

          } catch (error) {
            console.error("Error al agregar la opcion:", error);
            throw new Error("Error al agregar la opcion");
          }
  };
  
  const handleBorrar = async (option) => {
    let id = option.subItems[0].id_opcion
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, bórralo"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post("/admin/borrarOpcion", { id });
          console.log(response.data);
          // Si deseas hacer algo después de eliminar el elemento, puedes hacerlo aquí
          // Por ejemplo, actualizar la tabla o mostrar una notificación
          Swal.fire({
            title: "¡Eliminado!",
            text: "Tu opción ha sido eliminado.",
            icon: "success"
          });
        } catch (error) {
          console.error("Error al borrar la opción:", error);
          throw new Error("Error al borrar la opción");
        }
      }
    });
  };

  return (
    <>
    <div className='d-flex justify-content-end my-2'>
      <button className='btn btn-primary' onClick={handleOpen}>Agregar OPCION</button>
    </div>
      <TableContainer component={Paper} sx={{ marginBottom: 10 }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Opciones menú</TableCell>
              <TableCell></TableCell>
              {/* Agrega celdas vacías para mantener la estructura */}
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedOptionsWithId.map((option, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => handleRowClick(option.nombre_opcion)}
                    >
                      {openRows[option.nombre_opcion] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{option.nombre_opcion}</TableCell>
                  <TableCell>
                    <button className='btn' onClick={()=> handleBorrar(option)}>
                      <DeleteIcon/>
                    </button>
                    <button className='btn'>
                      <EditIcon/>
                    </button>
                    <button className='btn'>
                      <AgregarProceso option={option}/>
                    </button>
                  </TableCell>
                  {/* Agrega celdas vacías */}
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                    <Collapse in={openRows[option.nombre_opcion]} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="sub-items">
                          <TableBody>
                            {option.subItems.map((subItem, subIndex) => (
                              <TableRow key={subIndex}>
                                {/* Agrega celdas vacías */}
                                <TableCell>Proceso:</TableCell>
                                <TableCell></TableCell>
                                <TableCell>{subItem.nombre_proceso}</TableCell>
                                <TableCell>
                                  <button className='btn'>
                                    <DeleteIcon/>
                                  </button>
                                  <button className='btn'>
                                    <EditIcon/>
                                  </button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModal}>
          <div>
            <div className='d-flex justify-content-between mb-4'>
              <h2>
                Agregar Opcion 
              </h2>
              <button className='btn' onClick={handleClose}>
                <CancelIcon/>
              </button>
            </div>
            <form className='container d-flex flex-column' onSubmit={(event) => handleAgregar(event, opcionValues)}>
              <TextField 
                placeholder='Ingrese el nombre de la opcion'
                onChange={handleInputChange}
                name="nombre_opcion"
                value={opcionValues.nombre_opcion}
                sx={{width: 300, marginBottom: 2}}
                required={true}
              />
              <Button variant='outlined' sx={{width: 300}}>Aceptar</Button>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
    </>
  );
}
