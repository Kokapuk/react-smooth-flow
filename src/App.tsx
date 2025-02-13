import AnimatedList from './Examples/AnimatedList';
import Clipping from './Examples/Clipping';
import ContentSizeChange from './Examples/ContentSizeChange';
import Gallery from './Examples/Gallery';
import Playground from './Examples/Playground';
import PreserveAspectRatio from './Examples/PreserveAspectRatio';

const App = () => {
  return (
    <>
      <AnimatedList />
      <ContentSizeChange />
      <Playground />
      <PreserveAspectRatio />
      <Clipping />
      <Gallery />
    </>
  );
};

export default App;
