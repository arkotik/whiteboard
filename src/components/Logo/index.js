import React from 'react';
import './style.css';

function Index(props) {
  return (
    <div className='holder animation'>
      <div className={'logo-text'}>
        <span className='word-red'>Red</span>
        <span className='word-arrow'>Arrow</span>
      </div>
      <div className='logo-box box'>
        <div className='top triangle' />
        <div className='left-left triangle' />
        <div className='left-right triangle' />
      </div>
      {/*<h1 className='heading'>Red Arrow</h1>*/}
    </div>
  );
}

export default Index;
