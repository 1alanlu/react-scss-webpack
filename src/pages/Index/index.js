import React from 'react';
import Button from '../../components/Button';
import style from './index.module.scss';

const Index = () => {
  return (
    <div className={style.app}>
      React Starter
      <span role="img" aria-label="rocket ship">
        🚀
      </span>
      <Button />
      <div className={style.sassyDiv}>Get Sassy!</div>
    </div>
  );
};

export default Index;
