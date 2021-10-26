import React from "react";

const Square = ({value, hightLight, onClick}) => { 
    return (
        <button
          className={hightLight === true ? "square-hightLight" : "square"}
          onClick={onClick}
        >
          {value}
        </button>
      );
  };

export default Square;