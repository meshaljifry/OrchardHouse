// src/components/ContactUs.js

import React from 'react';
import './contact.css';

const ContactUs = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-description">
        If you have any questions or need assistance, feel free to reach out to us:
      </p>
      <ul className="contact-list">
        <li className="contact-item">
          <strong>Email:</strong> support@OrchardHouse.com
        </li>
        <li className="contact-item">
          <strong>Phone:</strong> +1 (555) 123-4567
        </li>
        <li className="contact-item">
          <strong>Address:</strong> 123 6th Street, Menomonie, WI 54751
        </li>
      </ul>
    </div>
  );
};

export default ContactUs;
