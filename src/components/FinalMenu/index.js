import React from "react";
import PropTypes from "prop-types";

export class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.onSelectOption = this.onSelectOption.bind(this);
    this.setSelectedOption = this.setSelectedOption.bind(this);

    this.state = {
      selectedOption: null
    };
  }

  static propTypes = {
    headingText: PropTypes.string, // if supplied, render a heading
    selectedOption: PropTypes.string, // can be controlled externally
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleSelectOption: PropTypes.func,
    dispatch: PropTypes.func
  };

  static defaultProps = {};

  componentDidMount() {
    const { selectedOption } = this.props;

    if (selectedOption) {
      this.onSelectOption(selectedOption);
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedOption } = this.props;

    // If the selected option changed externally
    // Handle the change by setting it to state
    if (selectedOption !== prevProps.selectedOption) {
      this.onSelectOption(selectedOption);
    }
  }

  onSelectOption(option) {
    const { handleSelectOption, dispatch } = this.props;

    // Calls other method
    this.setSelectedOption(option);

    // Calls external prop
    if (handleSelectOption) {
      handleSelectOption(option);
    }

    // Calls dispatch with action
    if (dispatch) {
      dispatch({
        type: "someAction",
        payload: {
          option
        }
      });
    }
  }

  setSelectedOption(selectedOption) {
    this.setState({
      selectedOption
    });
  }

  render() {
    const { selectedOption } = this.state;
    const { headingText, options } = this.props;

    // If headingText was supplied
    // Render heading text
    const headingTextComponent = headingText ? (
      <h1 testID="Menu.headingText">{headingText}</h1>
    ) : null;

    return (
      <div>
        {headingTextComponent}

        <ul>
          {options.map((option, index) => {
            const isActive = option === selectedOption;
            const testID = `Menu.button.${index}`;

            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => this.onSelectOption(option)}
                  style={{ color: isActive ? "red" : "black" }}
                  testID={testID}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Menu;
