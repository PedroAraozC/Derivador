/* eslint-disable react/prop-types */
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import privado from '../../assets/Licitaciones/user-shield.svg'
import publico from '../../assets/Licitaciones/public.svg'
import azar from '../../assets/Licitaciones/dice-3.svg'
import directo from '../../assets/Licitaciones/location-arrow.svg'
import { useNavigate } from 'react-router-dom';

const CardLicitacion = ({contratacion}) => {

    const navigate = useNavigate()
    const handleNavigation = (id) => {
        navigate(`/licitacion/${id}`);
    };
    // Función para obtener la imagen según el tipo de contratación
    const obtenerImagen = (tipo) => {
        switch (tipo) {
            case 1:
                return privado;
            case 2:
                return publico;
            case 3:
                return directo;
            case 4:
                return azar;
            default:
                return null;
        }
    }

    // Obtener la imagen correspondiente al tipo de contratación
    const imagen = obtenerImagen(contratacion.id_tcontratacion);

    return (
        <Card sx={{ minWidth: 250, maxWidth: 350 }}>
            <img
                style={{objectFit: 'contain', display: 'flex', justifyContent: 'center', width: '100%', height: 50, marginTop: 20, marginBottom: 20}}
                src={imagen}
                // title="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{textAlign: 'center'}}>
                    {contratacion.nombre_contratacion}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{textAlign: 'center'}}>
                    Numero de EXPTE : <b>{contratacion.expte}</b>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{textAlign: 'center'}}>
                    Numero de instrumento : <b>{contratacion.num_instrumento}</b>
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => handleNavigation(contratacion.id_contratacion)}>Ver más</Button>
            </CardActions>
        </Card>
    )
}

export default CardLicitacion