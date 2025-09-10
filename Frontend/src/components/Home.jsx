import React ,{useEffect}from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loading from './Loading';
import Products from './Products';
import { getProducts } from "../redux/features/products/productsSlice";
import Hero from './Hero';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Home() {
    const dispatch = useDispatch();
    // Sayfa yüklendiğinde ürünler axios ile çekilecek.
    useEffect(() => {
      dispatch(getProducts());
    }, [dispatch]);
  
    const loading = useSelector((state) => state.productsReducer.loading);
if (loading){
    return <Loading/>
}else{
    return (
      <>
        <Products/>
       
         <Footer />
        {/* <h1 className="text-4xl font-bold text-blue-600">
          Tailwind v4 is working 🚀
        </h1> */}
      </>
    );
}

}
