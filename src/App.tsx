import AnimatedList from './Examples/AnimatedList';
import ContentSizeChange from './Examples/ContentSizeChange';
import Modal from './Examples/Modal';
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
      <Modal />
      <PreserveAspectRatio />
    </>
  );
};

export default App;
