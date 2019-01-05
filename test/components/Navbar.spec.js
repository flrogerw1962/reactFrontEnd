import React from 'react';
import { shallow, mount } from 'enzyme';
import expect from 'expect';
import Navbar from '../../src/components/home/Navbar';
import configureStore from '../../src/store/configureStore';

describe('Navbar component', () => {
  xit('displays Sign In and Sign Up buttons when not logged in', () => {
    const store = configureStore();
    const spy = expect.createSpy();
    const wrapper = shallow(<Navbar isAuthenticated={false} store={store} logout={spy} showDropdown />);

    wrapper.setState({ showDropdown: true });
    expect(wrapper.find('.navbar__dropdown #sign-in-btn').length).toEqual(1);
    expect(wrapper.find('.navbar__dropdown #sign-up-btn').length).toEqual(1);
  });

  xit('displays Sign Out buttons when logged in', () => {
    const spy = expect.createSpy();
    const store = configureStore();
    const wrapper = mount(<Navbar isAuthenticated store={store} logout={spy} />);
    wrapper.setState({ showDropdown: true });

    expect(wrapper.find('#sign-out-btn').length).toEqual(1);
    wrapper.find('#sign-out-btn').simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  xit('shows and hides the dropdown', () => {
    const spy = expect.createSpy();
    const wrapper = mount(<Navbar isAuthenticated logout={spy} />);

    expect(wrapper.find('.navbar__dropdown').length).toEqual(0);

    wrapper.find('#navbar_dropdown_link').simulate('click');
    expect(wrapper.find('.navbar__dropdown').length).toEqual(1);

    wrapper.find('#navbar_dropdown_link').simulate('click');
    expect(wrapper.find('.navbar__dropdown').length).toEqual(0);
  });
});
