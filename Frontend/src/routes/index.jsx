import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../pages/Login";
import Home from "../components/Home";
import React from "react";
import Signup from "../pages/Signup";
import ShoppingCart from "../components/ShoppingCart";
import SendEmail from "../pages/SendEmail";
import Navbar from "../components/Navbar";
import UpdateData from "../pages/UpdateData";
import { BsSendExclamation } from "react-icons/bs";
import Checkout from "../components/Checkout";
import EditData from "../pages/EditData";
import NotFound from "../pages/NotFound";
import ResetPassword from "../pages/ResetPassword";
import ForgotPassword from "../pages/ForgotPassword";
import About from "../pages/About";
import Contact from "../pages/Contact"
import UsersPage from "../pages/UsersPage";
import OrdersPage from "../pages/OrdersPages";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import OAuthCallback from "../pages/OAuthCallback";
import LayoutWithNavbar from "../components/LayoutWithNavbar";
import SingleProduct from "../components/SingleProduct";
import Details from "../components/Details";

const Routes = () => {
  const { token } = useAuth();
  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/", // root path
      element: <LayoutWithNavbar />, // 👈 wrap everything with layout
      children: [
        {
          index: true, // 👈 default page under "/"
          element: <Home />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "details/:id",
          element: <Details />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "checkout",
          element: <Checkout />,
        },
        {
          path: "shopping-cart",
          element: <ShoppingCart />,
        },
        {
          path: "reset-password/:token",
          element: <ResetPassword />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "about",
          element: <About />,
        },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "privacy",
          element: <PrivacyPolicy />,
        },
        {
          path: "oauth/callback",
          element: <OAuthCallback />,
        },
      ],
    },
  ];


  // Define routes accessible only to authenticated users
const routesForAuthenticatedOnly = [
  {
    path: "/", // protected root
    element: <ProtectedRoute />,
    children: [
      {
        element: <LayoutWithNavbar />, // 👈 layout wraps child routes
        children: [
         
          {
            path: "upload",
            element: <UpdateData />,
          },
          {
            path: "edit/:id",
            element: <EditData />,
          },
          {
            path: "orders",
            element: <OrdersPage />,
          },
          {
            path: "send-email",
            element: <SendEmail />,
          },
          {
            path: "users",
            element: <UsersPage />,
          },
         
        ],
      },
    ],
  },
];


  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    // {
    //   path: "/",
    //   element: <Home />,
    // },
    {
      path: "/login",
      element: <Login />,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
