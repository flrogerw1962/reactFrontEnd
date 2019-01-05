import React, { PropTypes } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { assign } from 'lodash';

const propTypes = {
  address: PropTypes.object,
  onSave: PropTypes.func,
};

export class Address extends React.Component {
  constructor(props) {
    super(props);
    const { address } = props;
    this.state = {
      id: address.id,
      name: address.name,
      address1: address.address1,
      address2: address.address2,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      error: false,
    };
    this.stateList = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'DC', label: 'District Of Columbia' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' },
    ];
    autoBind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.address.id && nextProps.address.id) {
      this.setState(assign({
        error: this.state.error,
      }, nextProps.address));
    }
  }

  validateName() {
    this.setState({
      error: assign(this.state.error, {
        name: !this.validName(),
      }),
    });
    this.props.onSave({
      name: this.state.name,
    });
  }

  validateStreet() {
    this.setState({
      error: assign(this.state.error, {
        address1: !this.validStreet(),
      }),
    });
    this.props.onSave({
      address1: this.state.address1,
    });
  }

  updateAddress2() {
    this.props.onSave({
      address2: this.state.address2,
    });
  }

  validateCity() {
    this.setState({
      error: assign(this.state.error, {
        city: !this.validCity(),
      }),
    });
    this.props.onSave({
      city: this.state.city,
    });
  }

  validateState() {
    this.setState({
      error: assign(this.state.error, {
        state: !this.validState(),
      }),
    });
    this.props.onSave({
      state: this.state.state,
    });
  }

  validateZip() {
    this.setState({
      error: assign(this.state.error, {
        zipCode: !this.validZip(),
      }),
    });
    this.props.onSave({
      zipCode: this.state.zipCode,
    });
  }

  validName() {
    return this.state.name !== '';
  }

  validStreet() {
    return this.state.address1 !== '';
  }

  validCity() {
    return this.state.city !== '';
  }

  validState() {
    return this.state.state !== '';
  }

  validZip() {
    return this.state.zipCode !== '';
  }

  formValid() {
    return (
      this.validName() &&
      this.validStreet() &&
      this.validCity() &&
      this.validState() &&
      this.validZip()
    );
  }

  renderNameErrors() {
    return this.state.error.name ? <div className="checkout-page__alert">* Please enter a name</div> : null;
  }

  renderStreetErrors() {
    return this.state.error.address1 ? <div className="checkout-page__alert">* Please enter a street address</div> : null;
  }

  renderCityErrors() {
    return this.state.error.city ? <div className="checkout-page__alert">* Please enter a city</div> : null;
  }

  renderStateErrors() {
    return this.state.error.state ? <div className="checkout-page__alert">* Please select a state</div> : null;
  }

  renderZipErrors() {
    return this.state.error.zipCode ? <div className="checkout-page__alert">* Please enter a zip code</div> : null;
  }

  render() {
    return (
      <div className="checkout-page content">
        <input
          className="checkout-page__input"
          value={this.state.name}
          onChange={e => this.setState({ name: e.target.value })}
          onBlur={this.validateName}
          type="text"
          placeholder="Name"
          required
        />
        <br />
        {this.renderNameErrors()}
        <input
          className="checkout-page__input"
          value={this.state.address1}
          onChange={e => this.setState({ address1: e.target.value })}
          onBlur={this.validateStreet}
          type="text"
          placeholder="Street Address"
          required
        />
        <br />
        {this.renderStreetErrors()}
        <input
          className="checkout-page__input"
          value={this.state.address2}
          onChange={e => this.setState({ address2: e.target.value })}
          onBlur={this.updateAddress2}
          type="text"
          placeholder="Optional: Apt, Unit, Suite, etc"
        />
        <br />
        <input
          className="checkout-page__input"
          value={this.state.zipCode}
          onChange={e => this.setState({ zipCode: e.target.value })}
          onBlur={this.validateZip}
          placeholder="Zip Code"
          maxLength={6}
          required
        />
        <br />
        {this.renderZipErrors()}
        <input
          className="checkout-page__input"
          value={this.state.city}
          onChange={e => this.setState({ city: e.target.value })}
          onBlur={this.validateCity}
          placeholder="City"
          required
        />
        {this.renderCityErrors()}
        <Select
          onBlur={this.validateState}
          clearable={false}
          value={this.state.state}
          onChange={id => this.setState({ state: id.value })}
          placeholder="State"
          options={this.stateList}
        />
        {this.renderStateErrors()}
      </div>
      );
  }
}

Address.propTypes = propTypes;

export default connect()(Address);
