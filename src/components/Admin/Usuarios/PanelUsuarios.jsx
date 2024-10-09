import TablaUsuarios from "./TablaUsuarios"

const PanelUsuarios = () => {
  return (
    <>
        <div className="container mt-5">
            <h2>Panel Usuarios</h2>
        </div>
        <div className="mt-5 container">
            <TablaUsuarios/>
        </div>
    </>
  )
}

export default PanelUsuarios