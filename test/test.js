import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import GMCrossStreet from 'react-gm-crosstreet';

describe('<GMCrossStreet />', () => {
    it('renders three <GMCrossStreet /> components', () => {
        const wrapper = shallow(<GMCrossStreet />);
        wrapper.find('.autocomplete').to.have.length(1)
    });
});