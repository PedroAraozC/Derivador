import { Grid, TextField, Typography, FormControl, TextareaAutosize, Box, Autocomplete } from '@mui/material';
import { useEffect, useState } from 'react';
import { listarCategorias, listarOrigenes, listarTipoReclamo } from './funciones';
import MapaEditable from '../MapaEditable/MapaEditable';
import Volver from '../../../common/Volver';
import useStore from '../../../Zustand/Zustand';
// import MapaGoogle from '../MapaEditable/MapaGoogle';

const AgregarReclamo = () => {
    const user = useStore((state) => state.user);
    const [categorias, setCategorias] = useState([]);
    const [origenes, setOrigenes] = useState([]);
    const [tipoReclamos, setTipoReclamos] = useState([]);
    const [filteredTipoReclamos, setFilteredTipoReclamos] = useState([]);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [errors, setErrors] = useState({});
    const [formularioValues, setFormularioValues] = useState({
        id_categoria: null,
        id_oreclamo: null,
        id_treclamo: null,
        id_prioridad: null,
        asunto: '',
        detalle: '',
        descripcion_lugar: '',
        cuit: '',
        apellido_nombre: '',
        telefono: '',
        email: '',
    });

    useEffect(() => {
        listarCategorias().then((data) =>
            setCategorias(data.sort((a, b) => a.nombre_categoria.localeCompare(b.nombre_categoria)).filter(cat => cat.habilita === 1))
        );
        listarOrigenes().then((data) => {
            const habilitados = data.sort((a, b) => a.nombre_oreclamo.localeCompare(b.nombre_oreclamo)).filter(ori => ori.habilita === 1);
            setOrigenes(habilitados);
            const normalizar = (str) => str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
            const appMovil = habilitados.find(ori => normalizar(ori.nombre_oreclamo).includes('aplicaci') && normalizar(ori.nombre_oreclamo).includes('movil'));
            if (appMovil) {
                setFormularioValues((prev) => ({ ...prev, id_oreclamo: appMovil.id_oreclamo }));
            }
        });
        listarTipoReclamo().then((data) =>
            setTipoReclamos(data.sort((a, b) => a.nombre_treclamo.localeCompare(b.nombre_treclamo)).filter(tr => tr.habilita === 1))
        );
    }, []);

    // Autocompletar datos del ciudadano desde el usuario logueado
    useEffect(() => {
        if (!user) return;
        setFormularioValues((prev) => ({
            ...prev,
            apellido_nombre: `${user.apellido_persona ?? ''} ${user.nombre_persona ?? ''}`.trim(),
            telefono: user.telefono_persona ?? '',
            email: user.email_persona ?? '',
            cuit: user.documento_persona ?? '',
        }));
    }, [user]);

    const handleSelectChange = (name, value) => {
        setFormularioValues((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'id_categoria' && { id_treclamo: null })
        }));
        if (name === 'id_categoria') {
            setFilteredTipoReclamos(tipoReclamos.filter(tr => tr.id_categoria === value));
        }
        console.log(formularioValues)
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormularioValues({
            ...formularioValues,
            [name]: value,
        });
    };

    return (
        <Box p={2}>
            <Volver />
            <Typography variant="h6" gutterBottom>Datos del Reclamo</Typography>
            <Grid container spacing={3}>
                {/* Columna Izquierda */}
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="none">
                        <Autocomplete
                            options={origenes}
                            disabled
                            getOptionLabel={(option) => option.nombre_oreclamo}
                            value={origenes.find(cat => cat.id_oreclamo === formularioValues.id_oreclamo) || null}
                            onChange={(event, value) => handleSelectChange("id_oreclamo", value ? value.id_oreclamo : null)}
                            renderInput={(params) => <TextField
                                {...params}
                                margin="none"
                                label="Origen"
                                fullWidth
                                error={!!errors.id_oreclamo}
                                helperText={errors.id_oreclamo}
                            />}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <Autocomplete
                            options={categorias}
                            getOptionLabel={(option) => option.nombre_categoria}
                            value={categorias.find(cat => cat.id_categoria === formularioValues.id_categoria) || null}
                            onChange={(event, value) => handleSelectChange("id_categoria", value ? value.id_categoria : null)}
                            renderInput={(params) => <TextField {...params} margin="none" label="Categoría" fullWidth error={!!errors.id_categoria}
                                helperText={errors.id_categoria} />}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <Autocomplete
                            options={filteredTipoReclamos}
                            getOptionLabel={(option) => option.nombre_treclamo}
                            value={filteredTipoReclamos.find(cat => cat.id_treclamo === formularioValues.id_treclamo) || null}
                            onChange={(event, value) => handleSelectChange("id_treclamo", value ? value.id_treclamo : null)}
                            renderInput={(params) => <TextField {...params} margin="none" label="Tipo" fullWidth error={!!errors.id_treclamo}
                                helperText={errors.id_treclamo} />}
                        />
                    </FormControl>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Asunto"
                        value={formularioValues.asunto}
                        onChange={handleInputChange}
                        name='asunto'
                        error={!!errors.asunto}
                        helperText={errors.asunto}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Descripción del Lugar"
                        value={formularioValues.descripcion_lugar}
                        onChange={handleInputChange}
                        name='descripcion_lugar'
                        error={!!errors.descripcion_lugar}
                        helperText={errors.descripcion_lugar}
                    />
                    <TextareaAutosize
                        minRows={3}
                        placeholder="Detalle"
                        style={{ width: '100%', marginTop: 12, padding: 6 }}
                        onChange={handleInputChange}
                        name='detalle'
                        value={formularioValues.detalle}
                    />
                    {errors.detalle && (
                        <Typography variant="caption" color="error">
                            {errors.detalle}
                        </Typography>
                    )}
                    <Typography variant="h6" gutterBottom sx={{ marginTop: 1 }}>Datos del Ciudadano</Typography>
                    <TextField
                        fullWidth
                        margin="none"
                        label="Apellidos y Nombres"
                        value={formularioValues.apellido_nombre}
                        onChange={handleInputChange}
                        name='apellido_nombre'
                        error={!!errors.apellido_nombre}
                        helperText={errors.apellido_nombre}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Teléfono 3815-123456"
                        value={formularioValues.telefono}
                        onChange={handleInputChange}
                        name='telefono'
                    />
                    <TextField
                        fullWidth
                        margin="none"
                        label="Email"
                        value={formularioValues.email}
                        onChange={handleInputChange}
                        name='email'
                    />
                    <TextField
                        fullWidth
                        className='mt-2'
                        margin="none"
                        label="Cuil"
                        value={formularioValues.cuit}
                        onChange={handleInputChange}
                        name='cuit'
                    />
                </Grid>

                {/* Columna Derecha */}
                <Grid item xs={12} md={6}>
                    <Box borderRadius={2} display="flex" alignItems="center" justifyContent="center">
                        <MapaEditable
                            datos={formularioValues}
                            markerPosition={markerPosition}
                            setMarkerPosition={setMarkerPosition}
                            setFormularioValues={setFormularioValues}
                            setErrors={setErrors}
                        />

                        {/* <MapaGoogle
                            datos={formularioValues}
                            markerPosition={markerPosition}
                            setMarkerPosition={setMarkerPosition}
                            setFormularioValues={setFormularioValues}
                        /> */}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AgregarReclamo;
