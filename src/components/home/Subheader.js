import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import '../../assets/stylesheets/_subheader.scss';
import { setMultiPhoto, setExpressMode } from '../../actions/index';

const propTypes = {
  dispatch: PropTypes.func,
};

function Subheader(props) {
  return (
    <Link
      to="/upload-photo"
      onClick={() => {
        props.dispatch(setMultiPhoto(false));
        props.dispatch(setExpressMode(true));
      }}
    >
      <div className="subheader">
        <img id="subheader_img" alt="home">
        </img>
      </div>
    </Link>
    );
}
Subheader.propTypes = propTypes;

export default Subheader;
