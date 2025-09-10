const transporter = require('./EmailCofiq.js');
const {
  Verification_Email_Template,
  Welcome_Email_Template,
  Order_OTP_Email_Template,
  Order_Confirmation_Email_Template,
} = require('./EmailTemplate.js');

 const sendVerificationEamil = async (email, verificationToken) => {
  try {
    const response = await transporter.sendMail({
      from: '"Zia Zergary House" <farhanmaneri@gmail.com>',

      to: email, // list of receivers
      subject: "Verify your Email", // Subject line
      text: "Verify your Email", // plain text body
      html: Verification_Email_Template.replace("{verificationCode}",  verificationToken), //),
    });
    // console.log("Email send Successfully", response);
  } catch (error) {
    // console.log("Email error", error);
  }
};

 const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: '"Zia Zergary House" <farhanmaneri@gmail.com>',

      to: email, // list of receivers
      subject: "Welcome Email", // Subject line
      text: "Welcome Email", // plain text body
      html: Welcome_Email_Template.replace("{name}", name),
    });
    // console.log("Email send Successfully", response);
  } catch (error) {
    // console.log("Email error", error);
  }
};

// Send Order OTP Email
const sendOrderOTPEmail = async (email, name, verificationCode, totalAmount, itemCount) => {
  try {
    const response = await transporter.sendMail({
      from: '"Zia Zergary House" <farhanmaneri@gmail.com>',
      to: email,
      subject: "Order Verification Code - Zia Zergary House",
      text: "Order Verification Code",
      html: Order_OTP_Email_Template
        .replace("{name}", name)
        .replace("{verificationCode}", verificationCode)
        .replace("{totalAmount}", totalAmount)
        .replace("{itemCount}", itemCount),
    });
    // console.log("Order OTP Email sent successfully", response);
  } catch (error) {
    // console.log("Order OTP Email error", error);
  }
};

// Send Order Confirmation Email
const sendOrderConfirmationEmail = async (orderData) => {
  try {
    // Generate product items HTML
    const productItemsHTML = orderData.products.map(product => `
      <div class="product-item">
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <div class="product-info">
          <div class="product-title">${product.title}</div>
          <div class="product-price">Rs. ${product.price}</div>
          <div class="product-quantity">Quantity: ${product.quantity}</div>
        </div>
      </div>
    `).join('');

    const response = await transporter.sendMail({
      from: '"Zia Zergary House" <farhanmaneri@gmail.com>',
      to: orderData.email,
      subject: "Order Confirmed - Zia Zergary House",
      text: "Order Confirmation",
      html: Order_Confirmation_Email_Template
        .replace("{customerName}", orderData.userName)
        .replace("{orderDate}", new Date().toLocaleDateString())
        .replace("{orderId}", orderData._id || "N/A")
        .replace("{customerEmail}", orderData.email)
        .replace("{customerContact}", orderData.contact)
        .replace("{shippingAddress}", orderData.address)
        .replace("{productItems}", productItemsHTML)
        .replace("{totalAmount}", orderData.totalPrice),
    });
    // console.log("Order confirmation email sent successfully", response);
  } catch (error) {
    // console.log("Order confirmation email error", error);
  }
};

module.exports = {
  sendVerificationEamil,
  sendWelcomeEmail,
  sendOrderOTPEmail,
  sendOrderConfirmationEmail
};