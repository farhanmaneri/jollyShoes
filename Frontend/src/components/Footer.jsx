import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faWhatsapp,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faPhone,
  faMapPin,
  faEnvelope,
  faClock,
  faHeart,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../styles/Footer.css"; // Ensure you have the correct path to your CSS file
import FloatingButtons from "./FloatingButtons"; // <-- import your new floating buttons component

export default function Footer() {
  const [showScroll, setShowScroll] = useState(false);
  const navigate = useNavigate();

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
    const whatsappUrl = `https://wa.me/9239516658?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Footer */}
      <footer className="modern-footer">
        <div className="footer-container">
          {/* Main Footer Content */}
          <div className="footer-content">
            {/* Company Info Section */}
            <div className="footer-section company-info">
              <div className="company-logo">
                <h2 className="company-name">Jolly Shoes</h2>
                <p className="company-tagline">
                  Your trusted Shoes Partner
                </p>
              </div>
              <p className="company-description">
                Providing quality Shoes and exceptional service since our
                establishment. We're committed to bringing you the latest
                technology at the best prices.
              </p>

              {/* Social Media */}
              <div className="social-media">
                <h4>Follow Us</h4>
                <div className="social-links">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link facebook"
                  >
                    <FontAwesomeIcon icon={faFacebook} />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link instagram"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link twitter"
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <button
                    onClick={handleWhatsAppClick}
                    className="social-link whatsapp"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="footer-section">
              <h3 className="section-title">Quick Links</h3>
              <ul className="footer-links">
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/products">Products</a>
                </li>
                <li>
                  <a href="/about">About Us</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
                <li>
                  <a href="/privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms">Terms of Service</a>
                </li>
              </ul>
            </div>

            {/* Contact Info Section */}
            <div className="footer-section">
              <h3 className="section-title">Contact Info</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                  <div>
                    <p className="contact-label">Phone</p>
                    <a href="tel:+923326033144" className="contact-value">
                      0332-6033144
                    </a>
                  </div>
                </div>

                <div className="contact-item">
                  <FontAwesomeIcon
                    icon={faWhatsapp}
                    className="contact-icon whatsapp-icon"
                  />
                  <div>
                    <p className="contact-label">WhatsApp</p>
                    <button
                      onClick={handleWhatsAppClick}
                      className="contact-value whatsapp-btn"
                    >
                      Chat with us
                    </button>
                  </div>
                </div>

                <div className="contact-item">
                  <FontAwesomeIcon icon={faMapPin} className="contact-icon" />
                  <div>
                    <p className="contact-label">Address</p>
                    <p className="contact-value">
                      Shop No. 1 PukhtunKhwa Plaza
                      <br />
                      Link Road, Swabi
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <FontAwesomeIcon icon={faClock} className="contact-icon" />
                  <div>
                    <p className="contact-label">Store Hours</p>
                    <p className="contact-value">
                      Mon - Sunday: 8:00 AM - 6:00 PM
                      <br />
                      Friday : Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="footer-section">
              <h3 className="section-title">Stay Updated</h3>
              <p className="newsletter-text">
                Get notified about new products and exclusive deals!
              </p>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">Subscribe</button>
              </div>

              {/* Features */}
              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">🚚</span>
                  <span>Free Delivery</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🛡️</span>
                  <span>Warranty Included</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💳</span>
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <h3 className="section-title">Find Our Store</h3>
            <div className="map-container">
              <iframe
                title="Jolly Shoes"
                src="https://www.google.com/maps?q=Royal Electronics, Swabi Adda&output=embed"
                width="100%"
                height="250"
                style={{ border: "0", borderRadius: "16px" }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="copyright">
                &copy; 2025 Jolly Shoes. All rights reserved.
              </p>
              <p className="made-with-love">
                Made with{" "}
                <FontAwesomeIcon icon={faHeart} className="heart-icon" />
                for our valued customers
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Buttons */}
      <FloatingButtons />
    </>
  );
}
    
       