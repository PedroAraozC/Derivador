/* eslint-disable react/prop-types */
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const CardLicitacion = ({ contratacion }) => {

    const navigate = useNavigate()
    const handleNavigation = (id) => {
        navigate(`/licitacion/${id}`);
    };
    // Función para obtener la imagen según el tipo de contratación
    const obtenerTipo = (tipo) => {
        switch (tipo) {
            case 1:
                return <p><b>Licitación Privada</b></p>;
            case 2:
                return <p><b>Licitación Pública</b></p>;
            case 3:
                return <p><b>Compra Directa</b></p>;
            case 4:
                return <p><b>Concurso de Precio</b></p>;
            default:
                return null;
        }
    }
    const Tipo = obtenerTipo(contratacion.id_tcontratacion);

    const obtenerInstrumento = (tipo) => {
        switch (tipo) {
            case 1:
                return <p>N° DECRETO</p>;
            case 2:
                return <p>N° ORDENANZA </p>;
            case 3:
                return <p>N° RESOLUCIÓN </p>;
            default:
                return null;
        }
    }
    const Instrumento = obtenerInstrumento(contratacion.id_tinstrumento);

    return (
        <Card sx={{ minWidth: 350, maxWidth: 350, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <p style={{ objectFit: 'contain', display: 'flex', justifyContent: 'center', width: '100%', height: 20, marginTop: 20 }}>
                {Tipo}
            </p>
            <CardContent>
                <Typography gutterBottom variant="p" component="div" sx={{ textAlign: 'center', marginBottom: 4 }}>
                    {contratacion.nombre_contratacion}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', marginBottom: 1 }}>
                    N° EXPEDIENTE: <b>{contratacion.expte}</b>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                    {Instrumento}: <p className='ms-1'><b>{contratacion.num_instrumento}</b></p>
                </Typography>
            </CardContent>
            <div className='pb-3 px-3 d-flex justify-content-end'>
                <Button size="small" onClick={() => handleNavigation(contratacion.id_contratacion)}>Ver más</Button>
            </div>
        </Card>
    )
}

export default CardLicitacion