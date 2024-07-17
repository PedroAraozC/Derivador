// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "./registro.css";
import Swal from "sweetalert2";
import { Button, Form, Modal, ModalBody, ModalFooter } from "react-bootstrap";
//import { Navigate } from 'react-router';
// import logo from '../assets/Logo_Muni200x200.png';
// import logo2 from '../assets/logo_municipalidad.png';
// import logo3 from '../assets/logomuni_piedepagina.png';
import cdigitalApi from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { ReenviarValidacion } from "../Login/ReenviarValidacion";

export const Validacion = (props) => {
  // eslint-disable-next-line react/prop-types
  const { email, cerrarModal, setModalAbierto } = props;
  // eslint-disable-next-line react/prop-types
  const [datos, setDatos] = useState({
    email_persona: email,
    codigo_verif: undefined,
  });
  const navigate = useNavigate();

  const [botonState, setBotonState] = useState(true);

  const validar = async (e) => {
    e.preventDefault();

    ValidarCiudadanoDB();
  };

  const ValidarCiudadanoDB = async () => {
    setBotonState(false);
    try {
      const resp = await cdigitalApi.put("/usuarios/validar", datos);

      if (resp.data.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Código correcto! Registro validado!`,
          showConfirmButton: false,
          timer: 2000,
        });

        setTimeout(() => {
          //  navigate("/");
          //  window.location.reload();
          // window.location.href = `https://ciudaddigital.smt.gob.ar/#/login`;
         // window.location.reload()
          // = `http://localhost:5173/#/login`;
           navigate("/*");
        }, 1500);
        cerrarModal(true);
        setBotonState(true);

        //   setTimeout(() => {
        //     window.location.href = "http://172.16.8.209/";
        // }, 2500);
      } else {
        Swal.fire({
          icon: "error",
          title: "¡Ups!",
          text: resp.data.message,
          showCancelButton: true,
          confirmButtonText: "Intentar de nuevo",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#6495ED",
          cancelButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) {
            // Si el usuario hace clic en "Intentar de nuevo"
            setModalAbierto(false);
          } else {
            setModalAbierto(false);
          }
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
  };

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: parseInt(e.target.value.slice(0, 4)),
    });
  };

  const [abrirModalReenviarValidacion, setAbrirModalReenviarValidacion] =
    useState(false);
  const abrirModalReenviarEmailValidacion = () => {
    setAbrirModalReenviarValidacion(true);
  };

  return (
    <div>
      <Modal
        className={`${abrirModalReenviarValidacion ? "d-none" : "d-block"}`}
        show={true}
        onHide={cerrarModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>
            Le enviamos un email de validación a{" "}
            <strong>{datos.email_persona}</strong> con un código numérico
          </Modal.Title>
        </Modal.Header>

        <ModalBody>
          <p>* Si no recibió el email revise la casilla de spam</p>

          <Form onSubmit={validar} className="m-1 p-3 ">
            <Form.Group className="mb-3" controlId="telefono">
              <Form.Label>
                {" "}
                <strong>Código de validación</strong>{" "}
              </Form.Label>
              <Form.Control
                type="number"
                name="codigo_verif"
                onChange={handleChange}
                value={datos.codigo_verif}
                required
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
        <div className="text-center">
          <p
            className="punteroMouse"
            onClick={abrirModalReenviarEmailValidacion}
          >
            Si no recibió el email haga click aquí
          </p>
        </div>

        <ModalFooter></ModalFooter>
      </Modal>

      {abrirModalReenviarValidacion && (
        <ReenviarValidacion
          cerrarModal={cerrarModal}
          titulo={"Verifique sus datos para reenviar email"}
        />
      )}
    </div>
  );
};
