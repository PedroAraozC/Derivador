// eslint-disable-next-line no-unused-vars
import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const Terminos = (props) => {

    // eslint-disable-next-line react/prop-types
    const {  cerrarModal } = props;



  return (
    <div>


<Modal
      show={true} onHide={cerrarModal}
      //aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
        Términos y Condiciones de Acceso
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}>
       
        <p>
        <h6>INFORMACIÓN RELEVANTE</h6>
        Es requisito necesario para acceder a este sitio oficial de la Municipalidad de San Miguel de Tucumán a que el usuario lea y acepte los siguientes Términos y Condiciones que a continuación se redactan. <br /> <br />
  <h6>CIUDADANO DIGITAL</h6>
El acceso a la página requiere el registro del usuario causante como ciudadano digital, para ello deberán consignarse datos personales tales como: nombre, apellido, cuil, mail, género, fecha de nacimiento, número de celular y clave de usuario, la cual deberá ser generada por el usuario.
Cabe destacar que la clave generada por el usuario es intransferible, toda vez que será encriptada y el municipio no podrá tener acceso a ella, por lo cual no asumirá la responsabilidad en caso de extravío, olvido o utilización de la clave por terceros.
La registración exitosa implicará que el usuario ha leído y aceptado los Términos y Condiciones de Acceso en el presente documento, el cual tendrá el carácter de Declaración Jurada.
A partir de su registración el ciudadano digital queda habilitado para acceder al sitio web de la Municipalidad y realizar diferentes trámites, los mismos están sujetos a un proceso de confirmación, verificación y validación. En algunos casos puede que se requiera una verificación por medio de correo electrónico.   <br /> <br />


 <h6>USO NO AUTORIZADO</h6>
 Queda prohibido transferir el nombre de usuario y contraseña a un tercero para realizar cualquier tipo de trámite, toda vez que el carácter de ciudadano digital es intransferible. En tal caso no da derecho al usuario a iniciar reclamo alguno contra el Municipio. <br /> <br />



 <h6>MULTAS Y NOTIFICACIONES</h6>
 El ciudadano digital acepta que el medio de notificación legal fehaciente de la multa/sanción como consecuencia de alguna violación y/o incumplimiento, debidamente comprobado y tipificado en el Código de Faltas Municipal - Ordenanza 758/82- será el mail registrado oportunamente en esta página. Entendiéndose como fecha cierta de notificación, la fecha de envío de notificación vía mail desde el municipio al destinatario (ciudadano digital).
<br /> <br />

 <h6>PRIVACIDAD</h6>
 La información personal requerida a los fines de la registración del ciudadano digital, cuenta con la seguridad necesaria, conforme la normativa vigente Ley Nº 25.326 de datos personales. Los datos ingresados por el usuario no serán entregados a terceros, salvo que deba ser revelada en cumplimiento a una orden judicial o requerimiento legal.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={cerrarModal}>Aceptar</Button>
      </Modal.Footer>
    </Modal>








    </div>
  )
}