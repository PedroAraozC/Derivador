// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
//import './registro.css';
import Swal from "sweetalert2";
import { Button, Form, Modal, ModalBody, ModalFooter } from "react-bootstrap";
import cdigitalApi from "../../config/axios";
import { Validacion } from "../Registro/Validacion";

export const ReenviarValidacion = (props) => {
  // eslint-disable-next-line react/prop-types
  const { cerrarModal, titulo } = props;
  // eslint-disable-next-line react/prop-types
  const [email, setEmail] = useState("");
  const [cuil, setCuil] = useState("");
  const [botonState, setBotonState] = useState(true);

  const [modalAbiertoValidar, setModalAbiertoValidar] = useState(false);

  const abrirModalValidar = () => {
    setModalAbiertoValidar(true);
  };

  const cerrarModalValidar = () => setModalAbiertoValidar(false);

  const validar = async (e) => {
    e.preventDefault();
    setBotonState(false);

    try {
      const resp = await cdigitalApi.put(`/usuarios/email`, {
        email_persona: email,
        documento_persona: cuil,
      });

      if (resp.data.ok) {
        abrirModalValidar();
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: resp.data.mge,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: `¡Ups! `,
        text: "Algo salió mal!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    setBotonState(true);
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <Modal show={true} onHide={cerrarModal}>
        <Modal.Header >
          <Modal.Title>{titulo}</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Form onSubmit={validar} className="m-1 p-3 ">
            <Form.Group className="mb-3" controlId="email">
              <Form.Label> Ingrese su cuil</Form.Label>
              <Form.Control
                type="number"
                name="cuil"
                onChange={(e) => {
                  setCuil(e.target.value);
                }}
                value={cuil}
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label> Ingrese su email </Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={handleChange}
                value={email}
                required
                autoFocus
              />
            </Form.Group>

            <div className="text-center">
              {botonState ? (
                <Button
                  size="md"
                  variant="primary"
                  type="submit"
                  className="w-50"
                >
                  Validar
                </Button>
              ) : (
                <Button size="md" variant="primary" className="w-50" disabled>
                  Validar
                </Button>
              )}
            </div>
          </Form>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </Modal>

      {modalAbiertoValidar && (
        <>
          <Validacion
            email={email}
            cerrarModal={cerrarModalValidar}
            setModalAbierto={setModalAbiertoValidar}
            titulo={"Enviar email de reactivación de cuenta"}
          />
        </>
      )}
    </>
  );
};
