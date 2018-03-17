import React from 'react';
import PropTypes from 'prop-types';
import { RaisedButton, TextField } from 'material-ui';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.css';

class Login extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.emailInput = null;
    this.passwordInput = null;
    this.state = {
      isLoading: false,
      errors: {
        email: null,
        password: null,
      },
    };
  }

  handleFormSubmit = (e) => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    this.context.fetch(`/graphql?query=
      mutation {
       adminLogin(
         email:"${email}",
         password:"${password}"
       ) { 
         token, 
         errors { 
           key, 
           message 
         } 
       }
      }
    `).then(response => response.json()).then((data) => {
      const result = data.data.adminLogin;

      if (result.errors.length > 0) {
        const errors = { email: null, password: null };

        result.errors.forEach((error) => {
          errors[error.key] = error.message;
        });

        this.setState({
          errors,
        });

        return;
      }

      if (result.token) {
        localStorage.setItem('token', result.token);
        window.location.href = '/admin';
      }
    });

    e.preventDefault();
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <p className={s.lead}>Log in with your email address.</p>
          <form onSubmit={this.handleFormSubmit}>
            <TextField
              id="email"
              type="text"
              name="email"
              floatingLabelText="Email"
              errorText={this.state.errors.email}
              floatingLabelFixed
              fullWidth
            />
            <TextField
              id="password"
              type="password"
              name="password"
              floatingLabelText="Password"
              errorText={this.state.errors.password}
              floatingLabelFixed
              fullWidth
            />
            <RaisedButton type="submit" className={s.submitBtn} label="Log in" primary fullWidth />
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Login);
