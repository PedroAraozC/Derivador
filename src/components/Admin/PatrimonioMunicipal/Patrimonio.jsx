import TablaPatrimonioMunicipal from "./TablaPatrimonioMunicipal"

const Patrimonio = () => {
    return (
        <>
            <div className="container d-flex flex-column justify-content-center align-items-center mb-3">
                <h4 className="mt-3 mb-1">
                    Registro de Patrimonios
                </h4>
                <TablaPatrimonioMunicipal />
            </div>

        </>
    )
}

export default Patrimonio