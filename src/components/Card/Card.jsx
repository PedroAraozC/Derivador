import React from "react";
import "./Card.css";

const Card = ({onClick, titulo, descripcion, Icono }) => {
  return (
    <div className="card" onClick={onClick}>
      <div className="card-body">
        <div className="card-icon-cont">
          {typeof Icono === "string" ? (
            <img src={Icono} alt="icono" className="card-icon" />
          ) : (
            <div className="card-icon">{Icono}</div>
          )}
        </div>
        <p className="card-text">{titulo}</p>
        <p className="card-descripcion">{descripcion}</p>
      </div>
    </div>
  );
};

export default Card;
