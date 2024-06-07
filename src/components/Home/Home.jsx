import { useNavigate } from 'react-router-dom';
import './Home.css'
import { Button } from '@mui/material';

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className='d-flex justify-content-center align-items-center'>
        <div className='d-flex flex-column '>
          <h2 className='mt-4 text-center'>Estadísticas</h2>
            <Button variant='outlined' className='mt-4' onClick={()=>navigate("/cap-humano")}>Capital Humano</Button>
            <Button variant='outlined' className='mt-4' onClick={()=>navigate("/reclamos-estadisticas")}>Atención Ciudadana</Button>
        </div>
    </div>
  )
}

export default Home