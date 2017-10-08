import React from 'react';
import ReactDOM from 'react-dom';
import GMCrossStreet from 'react-gm-crosstreet';

class Test extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <GMCrossStreet />
        );
    }
}

ReactDOM.render(
    <Test />,
    document.getElementById('app')
);