import { Button } from "@mui/material"

const Licitaciones = () => {
  return (
    <>
        <div className="container mt-5 mb-5">
            <h2>Licitaciones y Compras</h2>
            <div className="d-flex gap-3 mt-5 align-items-center">
                Filtros:
                <Button size="large" color="success" variant="contained">Privadas</Button>
                <Button size="large" variant="contained">Públicas</Button>
                <Button size="large" color="secondary" variant="contained">Concursos de Precio</Button>
                <Button size="large" color="error" variant="contained">Compra Directa</Button>
            </div>
            <div>

            </div>
        </div>
    </>
  )
}

export default Licitaciones