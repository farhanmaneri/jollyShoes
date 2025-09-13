 const Verification_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .verification-code {
              display: block;
              margin: 20px 0;
              font-size: 22px;
              color: #4CAF50;
              background: #e8f5e9;
              border: 1px dashed #4CAF50;
              padding: 10px;
              text-align: center;
              border-radius: 5px;
              font-weight: bold;
              letter-spacing: 2px;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Verify Your Email</div>
          <div class="content">
              <p>Hello,</p>
              <p>Thank you for signing up! Please confirm your email address by entering the code below:</p>
              <span class="verification-code">{verificationCode}</span>
              <p>If you did not create an account, no further action is required. If you have any questions, feel free to contact our support team.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

 const Welcome_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Community</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #007BFF;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.8;
          }
          .welcome-message {
              font-size: 18px;
              margin: 20px 0;
          }
          .button {
              display: inline-block;
              padding: 12px 25px;
              margin: 20px 0;
              background-color: #007BFF;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              transition: background-color 0.3s;
          }
          .button:hover {
              background-color: #0056b3;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Welcome to Our Community!</div>
          <div class="content">
              <p class="welcome-message">Hello {name},</p>
              <p>We're thrilled to have you join us! Your registration was successful, and we're committed to providing you with the best experience possible.</p>
              <p>Here's how you can get started:</p>
              <ul>
                  <li>Explore our features and customize your experience.</li>
                  <li>Stay informed by checking out our blog for the latest updates and tips.</li>
                  <li>Reach out to our support team if you have any questions or need assistance.</li>
              </ul>
              <a href="#" class="button">Get Started</a>
              <p>If you need any help, don't hesitate to contact us. We're here to support you every step of the way.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

// Order OTP Email Template
const Order_OTP_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Verification Code</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #FF6B35;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .verification-code {
              display: block;
              margin: 20px 0;
              font-size: 24px;
              color: #FF6B35;
              background: #fff3e0;
              border: 2px dashed #FF6B35;
              padding: 15px;
              text-align: center;
              border-radius: 8px;
              font-weight: bold;
              letter-spacing: 3px;
          }
          .order-info {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
              border-left: 4px solid #FF6B35;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
          .warning {
              color: #d32f2f;
              font-weight: bold;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Order Verification Code</div>
          <div class="content">
              <p>Hello {name},</p>
              <p>Thank you for your order! To complete your purchase, please enter the verification code below:</p>
              <span class="verification-code">{verificationCode}</span>
              <div class="order-info">
                  <p><strong>Order Details:</strong></p>
                  <p>Total Amount: Rs. {totalAmount}</p>
                  <p>Items: {itemCount} product(s)</p>
              </div>
              <p class="warning">⚠️ This code will expire in 10 minutes for security reasons.</p>
              <p>If you did not place this order, please contact our support team immediately.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Royal Fabrics. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

// Order Confirmation Email Template
const Order_Confirmation_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 700px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .order-summary {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border: 1px solid #e9ecef;
          }
          .order-details {
              margin: 20px 0;
          }
          .product-item {
              display: flex;
              align-items: center;
              padding: 15px;
              border-bottom: 1px solid #eee;
              margin-bottom: 10px;
          }
          .product-image {
              width: 80px;
              height: 80px;
              object-fit: cover;
              border-radius: 8px;
              margin-right: 15px;
          }
          .product-info {
              flex: 1;
          }
          .product-title {
                        font-weight: bold;

              font-size: 16px;
              margin-bottom: 5px;
          }
          .product-size {
              font-size: 16px;
              margin-bottom: 5px;
          }
          .product-price {
              color: #4CAF50;
              font-weight: bold;
          }
          .product-quantity {
              color: #666;
              font-size: 14px;
          }
          .total-section {
              background: #e8f5e9;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              text-align: right;
          }
          .total-amount {
              font-size: 24px;
              font-weight: bold;
              color: #2e7d32;
          }
          .shipping-info {
              background: #fff3e0;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
              border-left: 4px solid #ff9800;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
          .success-message {
              color: #4CAF50;
              font-weight: bold;
              font-size: 18px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Order Confirmed! 🎉</div>
          <div class="content">
              <p class="success-message">Thank you for your order, {customerName}!</p>
              <p>Your order has been successfully placed and confirmed. Here are your order details:</p>
              
              <div class="order-summary">
                  <h3>Order Summary</h3>
                  <p><strong>Order Date:</strong> {orderDate}</p>
                  <p><strong>Order ID:</strong> {orderId}</p>
                  <p><strong>Email:</strong> {customerEmail}</p>
                  <p><strong>Contact:</strong> {customerContact}</p>
              </div>

              <div class="shipping-info">
                  <h4>Shipping Address:</h4>
                  <p>{shippingAddress}</p>
              </div>

              <div class="order-details">
                  <h3>Order Items:</h3>
                  {productItems}
              </div>

              <div class="total-section">
                  <p><strong>Total Amount:</strong> <span class="total-amount">Rs. {totalAmount}</span></p>
              </div>

              <p>We'll send you updates about your order status via email. You can also track your order through our website.</p>
              <p>If you have any questions about your order, please don't hesitate to contact our customer support team.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Royal Fabrics. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

module.exports = {
  Welcome_Email_Template, 
  Verification_Email_Template,
  Order_OTP_Email_Template,
  Order_Confirmation_Email_Template
}