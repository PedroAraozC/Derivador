/* eslint-disable react/prop-types */
import { useState } from "react";
import { Form, InputGroup, Modal } from "react-bootstrap"
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Switch } from "@mui/material";
import Swal from "sweetalert2";
import axios from "../../../config/axios";

const AgregarProceso = ({ option }) => {

    const [isModalAttachOpen, setIsModalAttachOpen] = useState(false);
    const [nombre_proceso, setNombre_proceso] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [habilita, setHabilita] = useState(false);

    const limpia_campos = () => {
        setNombre_proceso("");
        setDescripcion("");
        setHabilita(false);
    };
    const closeModalAttach = () => {
        limpia_campos();
        setIsModalAttachOpen(false);
    };
    const agregar = async () => {
        const datos = {
            id_opcion: option.subItems[0].id_opcion,
            nombre_proceso: nombre_proceso,
            descripcion: descripcion,
            habilita: habilita ? "1" : "0",
        };

        if (nombre_proceso.trim() === "" || descripcion.trim() === "") {
            alert('Formulario incorrecto');
            return;
        }
        console.log(datos)
        try {
            const response = await axios.post("/admin/altaProceso", datos);
            console.log(response.data);
            Swal.fire({
                title: "¡Agregado!",
                text: "Tu proceso ha sido agregado.",
                icon: "success"
            });
        } catch (error) {
            console.error("Error al agregar el proceso:", error);
            throw new Error("Error al agregar el proceso");
        }
        setIsModalAttachOpen(false);
    };


    return (
        <>
            <Modal
                show={isModalAttachOpen}
                onHide={closeModalAttach}
                size="lg"
                backdrop="static"
                centered
                keyboard={false}
                scrollable={true}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Agregar PROCESO para {option.nombre_opcion}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <InputGroup>
                        <Form.Control
                            id="nombre_proceso"
                            placeholder="Nombre del Proceso"
                            value={nombre_proceso}
                            onChange={(e) => setNombre_proceso(e.target.value)}
                            className="mb-2"
                        />
                    </InputGroup>
                    <InputGroup>
                        <Form.Control
                            id="descripcion"
                            placeholder="Descripcion del Proceso"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="mb-2"
                        />
                    </InputGroup>
                    <p className="m-0 px-2">HABILITA</p>
                    <Switch
                        id={"habilita"}
                        checked={habilita}
                        label="Habilita"
                        onChange={(e) => setHabilita(e.target.checked)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <div className="justify-content-center mt-2">
                        <button
                            onClick={agregar}
                            className="btn btn-primary btn-sm m-2"
                            style={{
                                float: "right",
                                backgroundColor: "green",
                                borderColor: "green",
                            }}
                        >
                            ACEPTAR
                        </button>
                        <button
                            onClick={closeModalAttach}
                            className="btn btn-secondary btn-sm m-2"
                            style={{
                                float: "right",
                                backgroundColor: "#990000",
                                borderColor: "#990000",
                            }}
                        >
                            CANCELAR
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>

            <AddCircleOutlineOutlinedIcon
                onClick={() => setIsModalAttachOpen(true)}
                sx={{ fontSize: '25px' }}
                style={{ cursor: "pointer" }} />
        </>

    )
}

export default AgregarProceso