import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

/**
 * Autocomplete component
 * @description This React Cmp. will render an input field. Expects Google Maps API to be loaded in page
 */
class LocationAutocomplete extends React.Component {

    constructor(props) {
        super(props);

        this.state = { predictions: [] };

        // Instantiate Google Maps services
        this.geocoder = new google.maps.Geocoder();
        this.autoCompleteService = new google.maps.places.AutocompleteService();
        this.placesService = new google.maps.places.PlacesService(document.createElement('span'));

        this.calculateCrossStreets = this.calculateCrossStreets.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        if (this.props.inputText) {
            //Initialize input field with passed text
            this.refs.inputField.value = this.props.inputText;
        }

        // Click event for outside clicking
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        // Clean up click event on unmount
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    componentWillReceiveProps(nextProps) {
        // Check if the passed input text has changed
        if (nextProps.inputText !== this.props.inputText) return;

        this.refs.inputField.value = nextProps.inputText;
    }

    handleClickOutside() {
        const domNode = ReactDOM.findDOMNode(this.refs.toggle);

        if ((!domNode || !domNode.contains(event.target)) && this.props.toggled) {
            this.props.toggle(false);
        }
    };


    /**
     * Input event handler
     */
    inputChanged() {
        const field = this.refs.inputField;
        const query = field.value;

        if (query === '' || query == null) {
            this.setState({ predictions: [], active: false });
            this.props.onClearInput && this.props.onClearInput();
            return;
        }

        this.setState({ active: true });
        const params = { input: query };

        this.autoCompleteService.getPlacePredictions(params, (predictions, status) => {
            if (status === google.maps.GeocoderStatus.OK && typeof(predictions) !== 'undefined') {
                this.setState({ predictions });
            } else {
                // Calculate cross streets if no suggestions from google maps
                this.calculateCrossStreets(query);
            }
        });
    }

    /**
     * Calculates cross street in area using geocoder, called if no results from place suggestions
     */
    calculateCrossStreets(query) {
        const params = { address: query };

        if (!isEmpty(this.props.bounds)) {
            params.bounds = this.props.bounds;
        }

        this.geocoder.geocode(params, (predictions, status) => {
            if (status === google.maps.GeocoderStatus.OK && predictions[0]) {
                this.setState({ predictions });
            } else {
                this.setState({ predictions: [] });
            }
        });
    }

    /**
     * OnClick for selecting a prediction from the list
     */
    predictionSelected(prediction) {
        const sendPrediction = () => {
            const location = {
                lat: prediction.geometry.location.lat(),
                lng: prediction.geometry.location.lng(),
            };

            this.setState({ predictions: [], active: false });

            this.props.updateAutocompleteData({
                prediction,
                location,
                address: prediction.description || prediction.formatted_address,
            });
        };

        if (typeof(prediction.geometry) === 'undefined') {
            this.placesService.getDetails({ reference: prediction.reference }, (details) => {
                if (details) {
                    // Inherit description from initial object
                    details.description = prediction.description;

                    // Set prediciton to details result
                    prediction = details;
                }

                sendPrediction();
            });
        } else {
            sendPrediction();
        }
    }

    renderPredictions() {
        const { predictions } = this.state;
        if (!predictions.length) return '';

        return (
            <ul className="predictions">
                {
                    predictions.map((prediction, i) => (
                        <li onClick={() => this.predictionSelected(prediction)} key={i}>
                            <p>{prediction.description || prediction.formatted_address}</p>
                        </li>
                    ))
                }
            </ul>
        );
    }

    render() {
        const active = this.state.active && this.props.transition;
        const autocompleteClass = `autocomplete ${this.props.className} ${active ? 'active' : ''}`;

        return (
            <div
                className={autocompleteClass}
                ref="autocompleteWrap"
            >
                <div>
                    <input
                        placeholder="Location"
                        defaultValue={this.props.inputText}
                        ref="inputField"
                        type="text"
                        className={this.props.inputClass}
                        onChange={(e) => this.inputChanged(e)}
                        disabled={this.props.disabled}
                    />
                </div>

                {this.renderPredictions()}
            </div>
        );
    }
}

LocationAutocomplete.defaultProps = {
    updateAutocompleteData() {},
    transition: true,
    className: '',
    inputClass: '',
    inputText: ''
};

LocationAutocomplete.propTypes = {
    className: PropTypes.string,
    inputText: PropTypes.string,
    inputClass: PropTypes.string,
    disabled: PropTypes.bool,
    transition: PropTypes.bool,
    updateAutocompleteData: PropTypes.func,
    bounds: PropTypes.object,
    onClearInput: PropTypes.func,
};

export default LocationAutocomplete;