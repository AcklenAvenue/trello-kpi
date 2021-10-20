import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

export default SetupReactAdapter = () => configure({ adapter: new Adapter() });
