import React from "react";
import renderer from "react-test-renderer";

import { Menu } from "..";

describe("Menu", () => {
  const spies = [];
  const dispatch = jest.fn();
  const handleSelectOption = jest.fn();
  const options = ["Option 1", "Option 2", "Option 3"];
  const headingText = "What is your favourite song?";

  describe("renders", () => {
    it("renders with minimum required props", () => {
      const component = renderer.create(<Menu options={options} />);

      expect(component).toMatchSnapshot();
    });

    it("renders the correct UI based on props", () => {
      const component = renderer.create(
        <Menu headingText={headingText} options={options} />
      );
      const { root } = component;
      const targetComponent = root.findByProps({
        testID: "Menu.headingText"
      });

      expect(targetComponent).toBeDefined();
    });

    it("renders the correct UI based on state", () => {
      const selectedOption = options[1];
      const component = renderer.create(
        <Menu
          headingText={headingText}
          selectedOption={selectedOption}
          options={options}
          dispatch={dispatch}
        />
      );

      expect(component).toMatchSnapshot();
    });
  });

  describe("methods", () => {
    it("should work", () => {
      spies[0] = jest.spyOn(Menu.prototype, "setSelectedOption"); // NB that this is called before creating comoponent
      const component = renderer.create(
        <Menu
          options={options}
          dispatch={dispatch}
          handleSelectOption={handleSelectOption}
        />
      );
      const instance = component.getInstance();
      const selectedOption = options[1];

      instance.onSelectOption(selectedOption);

      expect(spies[0]).toHaveBeenCalledWith(selectedOption);
      expect(handleSelectOption).toHaveBeenCalledWith(selectedOption);
      expect(dispatch).toHaveBeenCalled();
      expect(dispatch).toMatchSnapshot();
    });

    it("should update state correctly", () => {
      const component = renderer.create(<Menu options={options} />);
      const instance = component.getInstance();
      const selectedOption = options[2];

      instance.setSelectedOption(selectedOption);

      expect(instance.state.selectedOption).toEqual(selectedOption);
    });
  });

  describe("lifecycle methods", () => {
    it("should handle componentDidMount correctly", () => {
      spies[0] = jest.spyOn(Menu.prototype, "onSelectOption");
      const selectedOption = options[1];
      renderer.create(
        <Menu selectedOption={selectedOption} options={options} />
      );

      expect(spies[0]).toHaveBeenCalledWith(selectedOption);
    });

    it("should handle componentDidUpdate correctly", () => {
      spies[0] = jest.spyOn(Menu.prototype, "onSelectOption");
      const initialOption = options[1];
      const component = renderer.create(
        <Menu selectedOption={initialOption} options={options} />
      );

      expect(spies[0]).toHaveBeenCalledWith(initialOption);

      spies[0].mockClear();

      const nextOption = options[2];

      component.update(<Menu selectedOption={nextOption} options={options} />);

      expect(spies[0]).toHaveBeenCalledWith(nextOption);
    });
  });

  describe("actions", () => {
    it("should call onSelectOption on menu option button click", () => {
      spies[0] = jest.spyOn(Menu.prototype, "onSelectOption");
      const component = renderer.create(<Menu options={options} />);
      const { root } = component;
      const optionIndex = 2;
      const targetComponent = root.findByProps({
        testID: `Menu.button.${optionIndex}`
      });

      targetComponent.props.onClick();

      expect(spies[0]).toHaveBeenCalledWith(options[optionIndex]);
    });
  });

  afterEach(() => {
    spies.forEach(spy => {
      if (spy) {
        spy.mockClear();
      }
    });
    dispatch.mockClear();
  });
});
