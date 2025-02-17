import ReducedMotionAlert from './components/ReducedMotionAlert';
import AnimatedList from './Examples/AnimatedList';
import Clipping from './Examples/Clipping';
import ContentAlignment from './Examples/ContentAlignment';
import ContentSizeChange from './Examples/ContentSizeChange';
import Gallery from './Examples/Gallery';
import Playground from './Examples/Playground';
import PreserveAspectRatio from './Examples/PreserveAspectRatio';

const App = () => {
  return (
    <>
      <ReducedMotionAlert />
      <AnimatedList />
      <ContentSizeChange />
      <Playground />
      <PreserveAspectRatio />
      <Clipping />
      <Gallery />
      <ContentAlignment />
    </>
  );
};

export default App;
