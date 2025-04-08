import { constructTransition, startTransition } from '@lib/main';
import cn from 'classnames';
import { useState } from 'react';
import Button from '../../components/Button';
import Example from '../../components/Example';
import styles from './ContentAlignment.module.scss';

const springEasing =
  'linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.723 12.9%, 0.938, 1.077 20.4%, 1.121,1.149 24.3%, 1.163 27%, 1.154, 1.129 32.8%, 1.017 43.1%, 0.991, 0.977 51%,0.975 57.1%, 0.997 69.8%, 1.003 76.9%, 1)';
// https://linear-easing-generator.netlify.app/?codeType=js&code=const+%5Bduration%2C+func%5D+%3D+createSpring%28%7B%0A++mass%3A+1%2C%0A++stiffness%3A+100%2C%0A++damping%3A+10%2C%0A++velocity%3A+0%2C%0A%7D%29%3B%0A%0A%2F*%0A++Export+your+easing+function+as+a+global.%0A++The+name+you+use+here+will+appear+in+the+output.%0A++The+easing+function+must+take+a+number+as+input%2C%0A++where+0+is+the+start%2C+and+1+is+the+end.%0A++It+must+return+the+%27eased%27+value.%0A*%2F%0Aself.spring+%3D+func%3B%0A%2F*%0A++Some+easings+have+an+ideal+duration%2C+like+this+one.%0A++You+can+export+it+to+the+global%2C+in+milliseconds%2C%0A++and+it+will+be+used+in+the+output.%0A++This+is+optional.%0A*%2F%0Aself.duration+%3D+duration%3B%0A%0Afunction+createSpring%28%7B+mass%2C+stiffness%2C+damping%2C+velocity+%7D%29+%7B%0A++const+w0+%3D+Math.sqrt%28stiffness+%2F+mass%29%3B%0A++const+zeta+%3D+damping+%2F+%282+*+Math.sqrt%28stiffness+*+mass%29%29%3B%0A++const+wd+%3D+zeta+%3C+1+%3F+w0+*+Math.sqrt%281+-+zeta+*+zeta%29+%3A+0%3B%0A++const+b+%3D+zeta+%3C+1+%3F+%28zeta+*+w0+%2B+-velocity%29+%2F+wd+%3A+-velocity+%2B+w0%3B%0A%0A++function+solver%28t%29+%7B%0A++++if+%28zeta+%3C+1%29+%7B%0A++++++t+%3D%0A++++++++Math.exp%28-t+*+zeta+*+w0%29+*%0A++++++++%281+*+Math.cos%28wd+*+t%29+%2B+b+*+Math.sin%28wd+*+t%29%29%3B%0A++++%7D+else+%7B%0A++++++t+%3D+%281+%2B+b+*+t%29+*+Math.exp%28-t+*+w0%29%3B%0A++++%7D%0A%0A++++return+1+-+t%3B%0A++%7D%0A%0A++const+duration+%3D+%28%28%29+%3D%3E+%7B%0A++++const+step+%3D+1+%2F+6%3B%0A++++let+time+%3D+0%3B%0A%0A++++while+%28true%29+%7B%0A++++++if+%28Math.abs%281+-+solver%28time%29%29+%3C+0.001%29+%7B%0A++++++++const+restStart+%3D+time%3B%0A++++++++let+restSteps+%3D+1%3B%0A++++++++while+%28true%29+%7B%0A++++++++++time+%2B%3D+step%3B%0A++++++++++if+%28Math.abs%281+-+solver%28time%29%29+%3E%3D+0.001%29+break%3B%0A++++++++++restSteps%2B%2B%3B%0A++++++++++if+%28restSteps+%3D%3D%3D+16%29+return+restStart%3B%0A++++++++%7D%0A++++++%7D%0A++++++time+%2B%3D+step%3B%0A++++%7D%0A++%7D%29%28%29%3B%0A%0A++return+%5Bduration+*+1000%2C+%28t%29+%3D%3E+solver%28duration+*+t%29%5D%3B%0A%7D&simplify=0.00303831101956746&round=3

const ContentAlignment = () => {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <Example title="Content alignment" style={{ width: 250, height: 300 }}>
      <div className={styles.container}>
        <div
          className={cn(styles.panel, isExpanded && styles.expanded)}
          {...constructTransition({
            contentAlignmentPanel: {
              contentAlign: 'bottomCenter',
              duration: 800,
              easing: springEasing,
              contentEnterKeyframes: { transform: ['translateY(75px)', 'translateY(0)'], opacity: [0, 1] },
              contentExitKeyframes: 'reversedEnter',
            },
          })}
        >
          {isExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <Button>1</Button>
              <Button>2</Button>
              <Button>3</Button>
            </div>
          )}
          <Button
            onClick={() =>
              startTransition(['contentAlignmentPanel', 'contentAlignmentPanelButton'], () =>
                setExpanded((prev) => !prev)
              )
            }
            {...constructTransition({
              contentAlignmentPanelButton: { duration: 800, easing: springEasing },
            })}
          >
            ...
          </Button>
        </div>
      </div>
    </Example>
  );
};

export default ContentAlignment;
