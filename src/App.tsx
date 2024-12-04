import AnimatedList from './Examples/AnimatedList';
import Clipping from './Examples/Clipping';
import ContentSizeChange from './Examples/ContentSizeChange';
import Gallery from './Examples/Gallery';
import PreserveAspectRatio from './Examples/PreserveAspectRatio';
import Switch from './Examples/Switch/Switch';
import ViewTransition from './Examples/ViewTransition';

const App = () => {
  return (
    <>
      <AnimatedList />
      <ContentSizeChange />
      <Switch />
      <ViewTransition />
      <PreserveAspectRatio />
      <Clipping />
      <Gallery />
    </>
  );
};

export default App;
