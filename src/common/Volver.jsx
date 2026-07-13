import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


const Volver = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
    }

    return (
        <Button onClick={handleClick} variant="contained" sx={{ mb: 2, mt: 2, backgroundColor: '#1f89f6', color: 'white', '&:hover': { backgroundColor: '#1875d1' } }}>
            Volver
        </Button>
    )
}

export default Volver