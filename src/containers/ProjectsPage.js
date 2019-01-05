import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import ProjectItem from '../components/projects/ProjectItem';
import Dialog from '../components/cart/ConfirmDialog';
import autoBind from 'react-autobind';

import '../assets/stylesheets/_cart-page.scss';

const propTypes = {
  isAuthenticated: PropTypes.bool,
  dispatch: PropTypes.func,
  projects: PropTypes.array,
};

class ProjectsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authPage: !props.isAuthenticated,
      confirmId: null,
      popLeft: 0,
      popTop: 0,
      projects: [],
    };
    autoBind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isAuthenticated && nextProps.isAuthenticated) {
      this.setState({
        authPage: false,
      });
    }
    if (!nextProps.isAuthenticated) {
      this.setState({
        authPage: true,
      });
    }
  }

  deleteItem() {
    this.setState({
      confirmId: null,
    });
  }

  /**
   * Setup a current project so edit can work on it.  It might be
   * better to just be dealing with a photo and a product at that
   * point, but right now everything from ProductPage down uses
   * currentProject which contains the product and photo.
   */
  editItem(item) {
    this.props.dispatch({
      type: 'EDIT_PROJECT',
      current: {
        projectId: item.projectId,
        itemId: item.itemId,
        photoCustomization: item.photoCustomization,
      },
    });
    browserHistory.push(`/products/${item.productId}`);
  }

  renderItems() {
    return this.props.projects.map(item => {  // eslint-disable-line arrow-body-style
      return (
        <ProjectItem
          key={item.projectId} Item={item}
          onEdit={() => this.editItem(item)}
          onDelete={(e) => this.setState({
            confirmId: item.projectId,
            popLeft: e.clientX - 350,
            popTop: e.clientY - 40,
          })}
        />
        );
    });
  }

  render() {
    if (this.state.authPage) {
      return null;
    }
    const confirmJSX = this.state.confirmId ? (
      <Dialog
        left={this.state.popLeft} top={this.state.popTop}
        onClose={() => this.setState({
          confirmId: null,
        })}
      >
      Are you sure you want to delete this project?
        <a href="#" className="btn" onClick={this.deleteItem}>Delete Forever</a>
      </Dialog>
      ) : '';
    return (
      <div className="content cart">
        {this.renderItems()}
        {confirmJSX}
      </div>
      );
  }
}

function mapStateToProps(state) {
  return {
    projects: state.projects.list,
  };
}

ProjectsPage.propTypes = propTypes;

export default connect(mapStateToProps)(ProjectsPage);
