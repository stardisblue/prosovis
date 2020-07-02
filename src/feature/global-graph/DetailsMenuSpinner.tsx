import styled from 'styled-components/macro';
import React from 'react';
import { HourglassIcon } from '@primer/octicons-react';
import { animated, Keyframes } from 'react-spring/renderprops';

const AnimatedDiv = animated(styled.div`
  text-align: center;
  line-height: 0;
`);

const Container = Keyframes.Spring<{}, {}>(async (next: any) => {
  while (true) {
    await next({
      reset: true,
      from: { transform: `rotate(0deg)` },
      to: { transform: `rotate(180deg)` },
    });
    await next({ to: { transform: `rotate(360deg)` } });
  }
}) as any;

const config = { tension: 50, friction: 10 };
export function DetailsMenuSpinner() {
  return (
    <Container native config={config}>
      {(styles: any) => (
        <AnimatedDiv style={styles}>
          <HourglassIcon />
        </AnimatedDiv>
      )}
    </Container>
  );
}
