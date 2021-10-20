import { shallow } from "enzyme"
import chai from "chai"
import ReleasePlanForm from "../../imports/ui/ReleasePlanForm";
import SetupReactAdapter from './../ReactTestSetup';

SetupReactAdapter();

describe('ReleasePlan', () => {
  it('should render Generate Release Plan button', () => {
    const wrapper = shallow(<ReleasePlanForm />);
    const successButtonCount = wrapper.find(".btn-success").length

    chai.assert.isTrue(successButtonCount === 1 );
  });
});