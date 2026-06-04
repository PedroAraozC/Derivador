import React, { useState } from 'react';
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import axios from '../../config/axios';
import { validarClave } from '../../utils/validarClave';
import { patronEmail } from '../../utils/PatternEmail';

const FormularioBusquedaUsuario = () => {
  const [buscarPorCuil, setBuscarPorCuil] = useState(true);
  const [cuil, setCuil] = useState('');
  const [email, setEmail] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [usuariosEncontrados, setUsuariosEncontrados] = useState([]);
  const [botonState, setBotonState] = useState(false)

  const buscarUsuario = async () => {
    setBotonState(true)
    try {
      const { data } = await axios.get(`/usuarios/buscarUsuarioParaValidar?documento_persona=${cuil}&email_persona=${email}`);

      if (data.usuarios.length === 1) {
        setUsuario(data.usuarios[0]);
        setUsuariosEncontrados([]);
      } else {
        setUsuariosEncontrados(data.usuarios);
        setUsuario(null);
      }

    } catch (error) {
      setUsuario(null)
      setUsuariosEncontrados([]);
      console.error(error);
      const mensaje = error.response?.data?.message || "Ocurrió un error inesperado";
      alert(mensaje);
    }
    setBotonState(false)
  };

  const actualizarUsuario = async () => {
      setBotonState(true)
    try {

      if (usuario.clave) {
        if (!validarClave(usuario.clave) || usuario.clave < 8 || usuario.clave > 25) {
          alert("La clave debe contener al menos una mayúscula, un número Y entre 8 y 25 caracteres")
              setBotonState(false)
          return;
        }
      }

      if (!patronEmail.test(usuario.email_persona)) {
        alert("El correo electronico que ingresaste no es válido")
            setBotonState(false)
        return;
      }

      const {data} = await axios.patch("/usuarios/actualizarUsuarioValidacion", usuario)
      console.log(data);
      alert(data.message)
      setUsuario(null)
      setEmail("");
      setCuil("");
    } catch (error) {
    console.error(error);
    const mensaje = error.response?.data?.message || "Ocurrió un error inesperado";
    alert(mensaje);
    }
      setBotonState(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box p={3} maxWidth={500} mx="auto">
      <Typography variant="h5" gutterBottom>
        Buscar Usuario
      </Typography>

      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={buscarPorCuil}
              onChange={() => setBuscarPorCuil(!buscarPorCuil)}
            />
          }
          label="Buscar por CUIL"
        />
      </FormGroup>

      {buscarPorCuil ? (
        <TextField
          label="CUIL"
          variant="outlined"
          fullWidth
          margin="normal"
          value={cuil}
          onChange={(e) => setCuil(e.target.value)}
        />
      ) : (
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}

      <Button
      disabled={botonState}
        variant="contained"
        color="primary"
        fullWidth
        onClick={buscarUsuario}
        sx={{ mb: 3 }}
      >
        Buscar
      </Button>

      {usuariosEncontrados.length > 1 && (
        <Box mt={2}>
          <Typography variant="subtitle1">Hay más de una coincidencia. Seleccione una:</Typography>
          <FormControl fullWidth margin="normal">
            <Select
              value=""
              displayEmpty
              onChange={(e) => {
                const seleccionado = usuariosEncontrados.find(
                  (u) => u.id_persona === e.target.value
                );
                
                setUsuario(seleccionado);
                setUsuariosEncontrados([]);
              }}
            >
              <MenuItem value="" disabled>Seleccione...</MenuItem>
              {usuariosEncontrados.map((u) => (
                <MenuItem key={u.is_persona} value={u.id_persona}>
                  {u.apellido_persona}, {u.nombre_persona} - {u.documento_persona}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {usuario && (
        <Box component="form" noValidate autoComplete="off">
          <Typography>Usuario: {usuario.apellido_persona}, {usuario.nombre_persona}</Typography>
          <TextField
            label="CUIL"
            name="documento_persona"
            fullWidth
            margin="normal"
            value={usuario.documento_persona}
            onChange={(e) => {
              const value = e.target.value;
              // Permitir solo números enteros
              if (/^\d*$/.test(value)) {
                handleChange(e);
              }
            }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 11 }}
          />

          <TextField
            label="Email"
            name="email_persona"
            fullWidth
            type='email'
            margin="normal"
            value={usuario.email_persona}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: 80 }}
          />
          <TextField
            label="Teléfono"
            name="telefono_persona"
            fullWidth
            margin="normal"
            value={usuario.telefono_persona}
            onChange={(e) => {
              const value = e.target.value;
              // Permitir solo números enteros
              if (/^\d*$/.test(value)) {
                handleChange(e);
              }
            }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 11 }}
          />
          <TextField
          type='text'
            label="Clave"
            name="clave"
            fullWidth
            margin="normal"
            value={usuario.clave}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Validado</InputLabel>
            <Select
              name="validado"
              value={usuario.validado ? 'SI' : 'NO'}
              label="Validado"
              onChange={(e) =>
                setUsuario((prev) => ({
                  ...prev,
                  validado: e.target.value === 'SI',
                }))
              }
            >
              <MenuItem value="SI">SI</MenuItem>
              <MenuItem value="NO">NO</MenuItem>
            </Select>
          </FormControl>
          {
            !usuario?.id_empleado ?
           <FormControl fullWidth margin="normal">
            <InputLabel>Es empleado</InputLabel>
            <Select
              name="es_empleado"
              value={usuario?.esEmpleado ? 'SI' : 'NO'}
              label="Es empleado"
              onChange={(e) =>
                setUsuario((prev) => ({
                  ...prev,
                  esEmpleado: e.target.value === 'SI',
                }))
              }
            >
              <MenuItem value="SI">SI</MenuItem>
              <MenuItem value="NO">NO</MenuItem>
            </Select>
          </FormControl>
          :
          <TextField
            label="Nro de afiliado"
            fullWidth
            margin="normal"
            value={usuario?.afiliado || ''}
            InputLabelProps={{ shrink: true }}
            disabled
          />
          }
          <TextField
            label="Intentos Fallidos"
            name="ingreso_fallido"
            type="number"
            fullWidth
            margin="normal"
            value={usuario.ingreso_fallido}
            onChange={(e) => {
              const value = e.target.value;
              // Acepta solo números mayores o iguales a 0
              if (value === '' || Number(value) >= 0) {
                handleChange(e);
              }
            }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: 0 }}
          />
          <Button
          disabled={botonState}
            variant="contained"
            color="success"
            fullWidth
            onClick={actualizarUsuario}
            sx={{ mb: 3 }}
          >
            Actualizar
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FormularioBusquedaUsuario;
