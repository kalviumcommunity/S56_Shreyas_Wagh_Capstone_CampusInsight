import React from 'react';
import './Styles/Landing.css'; 

function Landing() {
  return (
    <div className="container">
      <div className="titleContainer">
        <p className="title">Trusted by students at colleges</p>
      </div>
      <div className="boxContainer">
        <div className="row">
          <StudentBox name="Harvard" />
          <StudentBox name="Stanford" />
          <StudentBox name="MIT" />
          <StudentBox name="Yale" />
        </div>
        <div className="row">
          <StudentBox name="MIT ADT" />
          <StudentBox name="MIT WPU" />
          <StudentBox name="PICT" />
        </div>
      </div>
    </div>
  );
}

function StudentBox({ name }) {
  return (
    <div className="box">
      {name}
    </div>
  );
}

export default Landing;
