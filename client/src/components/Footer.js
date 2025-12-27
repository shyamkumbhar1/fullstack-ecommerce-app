import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-auto py-4">
      <Container>
        <div className="text-center">
          <p className="mb-0">&copy; 2024 ShopEasy. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

