import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { green500, grey900 } from 'material-ui/styles/colors';

const ContextType = {
  insertCss: PropTypes.func.isRequired,
  fetch: PropTypes.func.isRequired,
  userAgent: PropTypes.string,
  user: PropTypes.object,
};

const muiTheme = {
  palette: {
    primary1Color: green500,
    textColor: grey900,
  },
};

class App extends React.PureComponent {

  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,
  };

  static childContextTypes = ContextType;

  getChildContext() {
    return this.props.context;
  }

  render() {
    if (this.props.context.userAgent) {
      muiTheme.userAgent = this.props.context.userAgent;
    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
        {React.Children.only(this.props.children)}
      </MuiThemeProvider>
    );
  }

}

export default App;
