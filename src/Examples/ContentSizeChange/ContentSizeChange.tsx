import Button from '../../components/Button';
import Example from '../../components/Example';
import LayoutTransition from '../../utils/LayoutTransition';
import useDelayedState from '../../utils/useDelayedState';

const ContentSizeChange = () => {
  const [isLoading, setLoading] = useDelayedState(false);

  return (
    <Example title="Content size change">
      <div style={{ width: 250, display: 'flex', justifyContent: 'center' }}>
        <LayoutTransition duration={300} deps={[isLoading.relevant]} delayedDeps={[isLoading.delayed]}>
          <Button style={{ overflow: 'hidden' }} onClick={() => setLoading((prev) => !prev)}>
            {isLoading.delayed ? 'Loading...' : 'Load'}
          </Button>
        </LayoutTransition>
      </div>
    </Example>
  );
};

export default ContentSizeChange;
