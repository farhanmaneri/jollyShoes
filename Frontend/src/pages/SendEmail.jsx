import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";

const API =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_PROD
    : import.meta.env.VITE_API_DEV;

 function sendEmail() {
   const productsInShoppingCart = useSelector(
     (state) => state.navbarReducer.value
   ); // products is an array
   console.log(productsInShoppingCart);

    function calculateTotalPrice() {
      let totalPrice = 0;
      for (let i = 0; i < productsInShoppingCart.length; i++) {
        totalPrice +=
          productsInShoppingCart[i].price * productsInShoppingCart[i].quantity; // Her ürünü adedi ile çarparak toplam fiyatı hesaplama
      }
      return totalPrice;
    }

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const defaultStyle = {
      color: "#9d174d",
      cursor: "pointer",
    };

    const otherStyle = {
      color: "#dcd9d9",
      cursor: "default",
    };

   async function handleSendEmail() {
     try {
       // Retrieve userEmail from localStorage
       const userEmail = localStorage.getItem("userEmail");
       // Open developer tools console
       // console.log("userEmail:", userEmail);
       // const userSubject = await products[0].price;

       if (!userEmail) {
         toast.error("User email not found in localStorage");
         return;
       }

       // Include userEmail in the data
       const requestData = {
         subject: "Thank you for Shopping Your order received",
         text: "please enter your email",
         userEmail: userEmail.replace(/["']/g, ""),
       };
       console.log("requestData:", requestData);
       const response = await axios.post(
         
      `${API}/send-email`,
         requestData
       );

       const result = response.data;
       console.log("result=====>", result);

       if (result.success) {
         console.log(result, "success");
         toast.success("Email sent successfully");
       } else {
         console.error("Error sending email:", result.message);
         toast.error("Error sending email");
       }
     } catch (error) {
       console.error("Error sending email:", error);
       toast.error("Error sending email");
     }
   }
   return (
     <>
       {" "}
       <>
         {/* <Toaster /> */}

         <h1 id="shopping-cart-heading">Your Order List</h1>
         {calculateTotalPrice() === 0 ? (
           <ZeroProduct />
         ) : (
           <>
             <AiOutlineArrowLeft
               id="back_arrow"
               onClick={() => navigate(-1)}
             />
             {productsInShoppingCart.map((eachProduct, index) => (
               <div id="single-cart-container" key={index}>
                 <img
                   src={eachProduct.image}
                   alt={"product image"}
                   onClick={() => navigate(`/details/${eachProduct._id}`)}
                 />
                 <div id="details">
                   <span id="brand">{eachProduct.brand}</span>
                   <span id="title">{eachProduct.title}</span>
                 </div>

                
               </div>
             ))}

             <div id="total-price-div">
               <span id="left">Total Price: </span>
               <span id="dolar">Rs.</span>
               <span id="right">{calculateTotalPrice()}</span>
               <span>
                 <h3 id="confirmOrder">
Send Order!                   <AiOutlineArrowRight
                     onClick={handleSendEmail}
                   />
                   {/* <button onClick={() => dispatch(clearCart())}>Clear Cart</button> */}
                 </h3>
               </span>
             </div>
           </>
         )}
       </>
       {/* <button onClick={handleSendEmail}>confirm order</button> */}
     </>
   );
 }

export default sendEmail;
