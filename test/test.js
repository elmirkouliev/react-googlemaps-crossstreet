import React from 'react';
import GMCrossStreet from 'react-gm-crosstreet';

import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('<GMCrossStreet />', () => {
    it('renders one <GMCrossStreet /> component', () => {
        const wrapper = shallow(<GMCrossStreet />);
        wrapper.find('.autocomplete').to.have.length(1)
    });
});