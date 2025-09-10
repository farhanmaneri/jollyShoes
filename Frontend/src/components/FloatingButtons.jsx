import React, { useState, useEffect } from "react";
import { ArrowUp, ShoppingCart, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";

const FloatingButtons = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  // Get cart count from Redux (same as Navbar)
  const products = useSelector((state) => state.navbarReducer.value);
  const cartCount = products
    ? products.reduce((total, item) => total + item.quantity, 0)
    : 0;

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWhatsAppClick = () => {
    const message = "Hi! I'm interested in your products. Can you help me?";
    const whatsappUrl = `https://wa.me/923326033144?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCartClick = () => {
    window.location.href = "/shopping-cart";
  };

  const buttons = [
    {
      id: "cart",
      icon: ShoppingCart,
      bg: "rgba(99,102,241,0.15)",
      hoverBg: "rgba(99,102,241,0.25)",
      tooltip: "View Cart",
      onClick: handleCartClick,
      show: true,
      iconColor: "#6366f1",
      border: "none",
      shadow: "0 2px 8px rgba(99,102,241,0.10)",
      rounded: true,
    },
    {
      id: "whatsapp",
      icon: MessageCircle,
      bg: "rgba(37,211,102,0.13)",
      hoverBg: "rgba(37,211,102,0.22)",
      tooltip: "Chat with us on WhatsApp!",
      onClick: handleWhatsAppClick,
      show: true,
      iconColor: "#25D366",
      border: "none",
      shadow: "0 2px 8px rgba(37,211,102,0.10)",
      rounded: true,
    },
    {
      id: "scroll",
      icon: ArrowUp,
      bg: "rgba(255,255,255,0.7)",
      hoverBg: "rgba(255,255,255,0.95)",
      tooltip: "Back to Top",
      onClick: scrollToTop,
      show: showScroll,
      iconColor: "#6366f1",
      border: "none",
      shadow: "0 2px 8px rgba(99,102,241,0.08)",
      rounded: true,
    },
  ];

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3"
      style={{ zIndex: 1001 }}
    >
      {buttons.map((button) => {
        const Icon = button.icon;
        if (!button.show) return null;
        return (
          <div
            key={button.id}
            className="relative group"
            onMouseEnter={() => setHoveredButton(button.id)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {/* Tooltip */}
            <div
              className={`absolute right-14 top-1/2 transform -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-medium text-white whitespace-nowrap transition-all duration-300 pointer-events-none shadow-lg ${
                hoveredButton === button.id
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-2"
              }`}
              style={{
                background:
                  button.id === "scroll"
                    ? "#6366f1"
                    : button.iconColor,
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.13)",
                letterSpacing: "0.01em",
              }}
            >
              {button.tooltip}
              <div
                className="absolute left-full top-1/2 transform -translate-y-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "7px solid transparent",
                  borderBottom: "7px solid transparent",
                  borderLeft: `7px solid ${
                    button.id === "scroll" ? "#6366f1" : button.iconColor
                  }`,
                }}
              />
            </div>

            {/* Button */}
            <button
              onClick={button.onClick}
              className={`relative transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none ${
                button.rounded ? "rounded-full" : ""
              }`}
              style={{
                width: "44px",
                height: "44px",
                background: hoveredButton === button.id ? button.hoverBg : button.bg,
                border: button.border,
                boxShadow: button.shadow,
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
                transition: "background 0.2s, box-shadow 0.2s, border 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                size={20}
                color={button.iconColor}
                className="relative z-10"
                style={{
                  filter: button.id === "scroll" ? "drop-shadow(0 1px 2px #6366f133)" : "none",
                }}
              />
              {/* Cart count badge */}
              {button.id === "cart" && cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    background: "#ef4444",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold",
                    borderRadius: "9999px",
                    padding: "2px 6px",
                    minWidth: "20px",
                    textAlign: "center",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                    zIndex: 20,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Pulse animation for WhatsApp */}
            {button.id === "whatsapp" && (
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  animation: "floating-pulse 2.2s infinite cubic-bezier(.4,0,.2,1)",
                  background: "rgba(37,211,102,0.13)",
                  zIndex: 0,
                }}
              />
            )}
          </div>
        );
      })}

      {/* Bottom indicator line */}
      <div
        className="w-0.5 h-8 bg-gradient-to-t from-transparent to-gray-300 opacity-30 mt-2"
        style={{ display: showScroll ? "block" : "none" }}
      />
      {/* Animations */}
      <style>{`
        @keyframes floating-pulse {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.25); opacity: 0.15; }
          100% { transform: scale(1); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default FloatingButtons;
