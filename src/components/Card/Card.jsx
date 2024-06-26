import React from "react";
import "./Card.css";

const Card = ({onClick, titulo, descripcion, Icono }) => {
  return (
    <div className="cardHome" onClick={onClick}>
      <div className="card-bodyHome">
        <div className="card-icon-contHome">
          {typeof Icono === "string" ? (
            <img src={Icono} alt="icono" className="card-iconHome" />
          ) : (
            <div className="card-iconHome">{Icono}</div>
          )}
        </div>
        <p className="card-textHome">{titulo}</p>
        <p className="card-descripcionHome">{descripcion}</p>
      </div>
    </div>
  );
};

export default Card;
