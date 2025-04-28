import ReducedMotionAlert from './components/ReducedMotionAlert';
import AnimatedList from './Examples/AnimatedList';
import Benchmark from './Examples/Benchmark';
import Clipping from './Examples/Clipping';
import ContentAlignment from './Examples/ContentAlignment';
import ContentSizeChange from './Examples/ContentSizeChange';
import DynamicStates from './Examples/DynamicStates';
import Gallery from './Examples/Gallery';
import Layout from './Examples/Layout';
import Playground from './Examples/Playground';
import PreserveAspectRatio from './Examples/PreserveAspectRatio';
import ScaleContent from './Examples/ScaleContent';
import Transform from './Examples/Transform';
import TransitioningRoot from './Examples/TransitioningRoot';

const App = () => {
  return (
    <>
      <Benchmark />
      <ReducedMotionAlert />
      <AnimatedList />
      <ContentSizeChange />
      <Playground />
      <PreserveAspectRatio />
      <Clipping />
      <Gallery />
      <ContentAlignment />
      <TransitioningRoot />
      <ScaleContent />
      <Layout />
      <DynamicStates />
      <Transform />
    </>
  );
};

export default App;
