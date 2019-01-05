import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import PhotoPicker from '../../src/components/editor/PhotoPicker';

describe('PhotoPickerModal component', () => {
  xit('should close the modal', () => {
    const spy = expect.createSpy();
    const wrapper = shallow(<PhotoPicker closeModal={spy} />);

    wrapper.find('#cancel-btn').simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  xit('should show the photo uploader by default', () => {
    const spy = expect.createSpy();
    const wrapper = shallow(<PhotoPicker closeModal={spy} />);

    expect(wrapper.find('Connect(PhotoUploader)').length).toEqual(1);
  });

  xit('should add photos to project when Lets Build button is clicked', () => {
    const spyOne = expect.createSpy();
    const spyTwo = expect.createSpy();
    const wrapper = shallow(<PhotoPicker addPhotosToProject={spyOne} closeModal={spyTwo} />);
    const photos = [{ url: 'heyo' }];

    wrapper.setState({ selectedPhotos: photos });
    wrapper.find('#lets-build-btn').simulate('click');

    expect(spyOne).toHaveBeenCalledWith(photos);
  });
});
