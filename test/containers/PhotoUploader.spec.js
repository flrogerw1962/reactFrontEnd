import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import { PhotoUploader } from '../../src/containers/PhotoUploader';

describe('PhotoUploader component', () => {
  xit('should preview photos that are upload', () => {
    const wrapper = shallow(<PhotoUploader />);

    expect(wrapper.find('.photopicker__image').length).toEqual(0);
    wrapper.setState({ files: [
      { preview: 'photo1' },
      { preview: 'photo2' },
    ] });
    expect(wrapper.find('.photopicker__image').length).toEqual(2);
  });
});
