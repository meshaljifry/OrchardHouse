import React from 'react';
import './Help.css';

const faqs = [
  {
    question: "What are your orchard’s hours of operation?",
    answer: (
      <>
        <ul className="hours-list">
          <li>Monday: 8 AM to 5 PM</li>
          <li>Tuesday: 8 AM to 5 PM</li>
          <li>Wednesday: 8 AM to 5 PM</li>
          <li>Thursday: 8 AM to 5 PM</li>
          <li>Friday: 8 AM to 5 PM</li>
          <li>Saturday: 8 AM to 5 PM</li>
        </ul>
        <p className="hours-note">
          Hours are subject to change due to weather and/or events. Please check our website for updates regarding our hours.
        </p>
      </>
    )
  },
  {
    question: "Is the orchard open year-round?",
    answer: "No, our orchard is open during the harvest season, typically from September to November. We also offer other seasonal events, so check our website for updates."
  },
  {
    question: "Do I need a reservation to visit?",
    answer: "Reservations are generally not required, but we may require them during peak times, so check our website beforehand."
  },
  {
    question: "What types of apples are available for picking?",
    answer: "We grow Honeycrisp, Fuji, Gala, and Granny Smith apples. Availability depends on the season, so please call ahead or check our website."
  },
  {
    question: "Are we allowed to eat apples while picking?",
    answer: "Yes, visitors are welcome to sample apples while picking, but please pay for the apples you pick."
  },
  {
    question: "Do you host events such as weddings or private gatherings?",
    answer: "Yes, we host private events, including weddings, birthdays, and corporate gatherings. Contact us for event packages and availability."
  },
  {
    question: "Can I bring my pet?",
    answer: "Pets are allowed in some areas on a leash, but not in the orchard fields. Please check our pet policy before visiting."
  }
];

const HelpPage = () => {
  return (
    <div className="help-container">
      <h1 className="help-title">Apple Orchard Help & FAQs</h1>
      <p className="help-description">
        Welcome to our help page! Here you’ll find answers to commonly asked questions. If you don’t see your question here, please contact us directly.
      </p>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3 className="faq-question">{faq.question}</h3>
            <p className="faq-answer">{faq.answer}</p>
          </div>
        ))}
      </div>
      <div className="contact-info">
        <h2>Contact Us</h2>
        <p>Phone: (123) 456-7890</p>
        <p>Email: info@appleorchard.com</p>
      </div>
    </div>
  );
};

export default HelpPage;
