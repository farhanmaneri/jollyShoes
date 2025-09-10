import React from "react";
import { ImSad } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import "../styles/ZeroProduct.css";
import { AiOutlineArrowLeft } from "react-icons/ai";

function ZeroProduct() {
  const navigate = useNavigate();
  return (
    <>
      <AiOutlineArrowLeft id="back_arrow" onClick={() => navigate("/")} />
      <div id="zero-product-container">
        <h4>There is no product in your cart!</h4>
        <ImSad id="sad-icon" />
      </div>
    </>
  );
}

export default ZeroProduct;
