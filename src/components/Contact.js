// src/components/ContactUs.js

import React from 'react';

const ContactUs = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1>Contact Us</h1>
      <p>If you have any questions or need assistance, feel free to reach out to us:</p>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li><strong>Email:</strong> support@mockcompany.com</li>
        <li><strong>Phone:</strong> +1 (555) 123-4567</li>
        <li><strong>Address:</strong> 123 Mock Street, Mock City, MC 12345</li>
      </ul>
    </div>
  );
};

export default ContactUs;
