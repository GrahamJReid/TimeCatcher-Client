/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Button } from 'react-bootstrap';
import { signIn } from '../utils/auth';

function Signin() {
  return (
    <div className="SignInPageContainer">
      <div className="homePageTitleDiv">
        <img src="/TimeCatcherLogo.png" className="SignInPageLogo" />
        <h1 className="SignInPageTitle">TimeCatcher</h1>
      </div>
      <Button type="button" size="lg" className="SignInPageButton" onClick={signIn}>
        Sign In
      </Button>
    </div>
  );
}

export default Signin;
