import ReducedMotionAlert from './components/ReducedMotionAlert';
import AnimatedList from './Examples/AnimatedList';
import Benchmark from './Examples/Benchmark';
import Clipping from './Examples/Clipping';
import ContentAlignment from './Examples/ContentAlignment';
import ContentSizeChange from './Examples/ContentSizeChange';
import Gallery from './Examples/Gallery';
import Layout from './Examples/Layout';
import Playground from './Examples/Playground';
import PreserveAspectRatio from './Examples/PreserveAspectRatio';
import ScaleContent from './Examples/ScaleContent/ScaleContent';
import TransitioningRoot from './Examples/TransitioningRoot';

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
      <Benchmark />
      <TransitioningRoot />
      <ScaleContent />
      <Layout />
    </>
  );
};

export default App;
