import React, { PropTypes } from 'react';
import autoBind from 'react-autobind';
// import _ from 'lodash';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

const propTypes = {
  name: PropTypes.string,
  options: PropTypes.any,
  callback: PropTypes.func,
  value: PropTypes.number,
};
export class ProductOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || 0,
      options: props.options,
      name: props.name,
    };
    autoBind(this);
  }
  componentWillMount() {
    if (this.props.value) this.props.callback({ value: this.props.value }, this.props.name);
  }
  render() {
    return (
      <div>
        <span>{this.state.name.toUpperCase()}:</span>
        <Select
          value={this.state.value}
          placeholder={`Select a ${this.state.name.toLowerCase()}`}
          clearable={false}
          options={this.state.options}
          onChange={(option) => {
            this.setState({ value: option.value });
            this.props.callback(option, this.state.name);
          }}
        />
      </div>);
  }
}
ProductOptions.propTypes = propTypes;

export default ProductOptions;
