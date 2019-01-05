import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';

import '../assets/stylesheets/base.scss';

const propTypes = {
  children: PropTypes.any,
  dispatch: PropTypes.func,
};

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { children } = this.props;
    return (
      <div>
        <Navbar />
        {children}
        <Footer />
      </div>
      );
  }
}

App.propTypes = propTypes;

export default connect()(App);
