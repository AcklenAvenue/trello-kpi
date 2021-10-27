import { shallow } from "enzyme";
import chai, { expect } from "chai";
import sinon from 'sinon';
import ReleasePlanForm from "../../imports/ui/ReleasePlanForm";
import SetupReactAdapter from "./../ReactTestSetup";

SetupReactAdapter();

describe("ReleasePlan", () => {
  const props = {
    onSubmit: () => {},
    boards: [],
    boardInfo: { name: "Yes", downloadUrl: "" },
    setBoardInfo: () => {}
  };
  it("should render Generate Release Plan button", () => {
    const wrapper = shallow(
      <ReleasePlanForm {...props} />
    );
    const successButtonCount = wrapper.find(".btn-success").length;
    chai.assert.isTrue(successButtonCount === 1);
  });
  
  it("should call backend when Generate Release Plan button is clicked", () => {
    sinon.stub(props, 'onSubmit');
    
    const wrapper = shallow(
      <ReleasePlanForm {...props} />
      );
      
    const successButtonCount = wrapper.find(".btn-success").at(0);
    successButtonCount.simulate('click');

    sinon.assert.calledOnce(props.onSubmit);

    props.onSubmit.restore();
  })
});

describe("TrelloReleasePlan: With boards", () => {
  const props = {
    onSubmit: () => {},
    boards: [{ name: "First Board" }],
    boardInfo: { name: "", downloadUrl: "" },
    setBoardInfo: () => {},
  };

  const wrapper = shallow(<ReleasePlanForm {...props} />);
  const dropDownButton = wrapper.find("#dropdownMenu1");

  it("Has dropdown menu", () => {
    expect(dropDownButton.length).equal(1);
  });

  it("Amount of Dropdown menu items equal the amount of board props", () => {
    const dropDownMenuItems = wrapper.find(".dropdown-item");

    expect(dropDownMenuItems.length).equal(props.boards.length);
  });

  it('When no board is selected it should display "Select Board" in button', () => {
    expect(dropDownButton.text()).contains("Select Board");
  });

  xit("When clicking menu item it should display boardInfo name in button", () => {
    const firstDropDownMenuItem = wrapper.find(".dropdown-item").at(0);

    firstDropDownMenuItem.simulate("click");
    const dropDownButtonClicked = wrapper.find("#dropdownMenu1");

    expect(firstDropDownMenuItem.text()).equal(props.boards[0].name);
    expect(dropDownButtonClicked.text()).equal(props.boards[0].name);
  });
});

describe("TrelloReleasePlan: Empty boards", () => {
  const props = {
    boards: [],
    boardInfo: { name: "TestBoard", downloadUrl: "" },
    onSubmit: () => {},
    setBoardInfo: () => {},
  };

  const wrapper = shallow(<ReleasePlanForm {...props} />);
  const dropDownMenu = wrapper.find(".dropdown-menu");

  it("Has dropdown menu", () => {
    expect(dropDownMenu.length).equal(1);
  });

  it("Dropdown menu is empty", () => {
    const dropDownMenuItems = dropDownMenu.at(0).find(".dropdown-item");

    expect(dropDownMenuItems.length).equal(0);
  });
});
