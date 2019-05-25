import React from 'react';
import { hot } from 'react-hot-loader';
import './app.scss';
import Index from './pages/Index';

const App = () => {
  return (
    <>
      <header>Header</header>
      <section>
        <Index />
      </section>
      <footer>Footer</footer>
    </>
  );
};

export default hot(module)(App);
