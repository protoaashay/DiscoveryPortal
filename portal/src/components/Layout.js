import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import Logout from './Logout';
import Profile from './Profile.js';

import './Layout.css';
const dotenv = require('dotenv');
dotenv.config({ path: './../.env' });

class Layout extends Component {
  state = {
    isLoggedIn: false,
    user: '',
    email: '',
    image: '',
  };

  constructor(props) {
    super(props);
  }

  successResponseGoogle = (response) => {
    const emailUsed = response.profileObj.email;
    const index = emailUsed.indexOf('@');
    const domain = emailUsed.substr(index);

    this.setState({
      user: response.profileObj.name,
      email: response.profileObj.email,
    });

    if (domain !== '@iitbbs.ac.in') {
      alert('Use your iit bbs email id');
    } else {
      // console.log(response.tokenId);
      this.setState({ isLoggedIn: true });
      this.props.callFunc();

      axios
        .post(
          '/v1/user/googleLogin',
          { tokenId: response.tokenId },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log('login');
          console.log(response);
          this.setState({ image: response.data.user.image });
        })
        .catch((err) => console.log(err));
    }
  };

  logout = () => {
    this.setState({ isLoggedIn: false });
    axios
      .get('/v1/user/logout', {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
    this.props.callFunc();
  };

  failureResponseGoogle = (response) => {
    console.log(response);
    alert('Use your IIT BBS email for login');
  };

  render = () => {
    // console.log(`${__dirname}../../.env`);
    // console.log(process.env);

    if (!this.state.isLoggedIn) {
      return (
        <div className="Login">
          <GoogleLogin
            clientId={process.env.REACT_APP_CLIENT_ID}
            buttonText="Login with google"
            isSignedIn={true}
            onSuccess={this.successResponseGoogle}
            onFailure={this.failureResponseGoogle}
            cookiePolicy={'single_host_origin'}
          />
        </div>
      );
    } else
      return (
        <div className="page">
          <Logout img={this.state.image} onLogout={this.logout} />
          <Profile user={this.state.user} email={this.state.email} />
        </div>
      );
  };
}

export default Layout;