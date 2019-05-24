import React from 'react';
import { hot } from 'react-hot-loader';
import Button from './components/presentational/Button';
import style from './app.module.scss';

const App = () => {
  return (
    <div>
      <div className={style.app}>
        React Starter
        <span role="img" aria-label="rocket ship">
          🚀
        </span>
        <Button />
        <div className={style.sassyDiv}>Get Sassy!</div>
      </div>
      <div className={style.sassyDiv}>Get Sassy!</div>
    </div>
  );
};

export default hot(module)(App);
