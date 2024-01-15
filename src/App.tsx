import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container } from '@mui/material';
import CustomerGrid from './Grid/grid';

function App() {
  return (
      <Container>
          <h1>Customer Management</h1>
          <CustomerGrid />
      </Container>
  );
}

export default App;
