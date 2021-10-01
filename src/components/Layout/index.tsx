import React from 'react';
import styled from 'styled-components';
import Footer from './Footer';
import Header, { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from './Header';
import Hero, { HeroProps } from './Hero';
import Wrapper from './Wrapper';
import LoadingPlaceholder from '../LoadingPlaceholder';

const Container = styled.div`
  .header {
    &__header,
    &__hero {
      background-color: ${p => p.theme.color.primaryLight};
    }
    &__hero {
      padding-top: ${HEADER_HEIGHT + 50}px;
      @media ${p => p.theme.breakpoint.mobile} {
        padding-top: ${HEADER_HEIGHT_MOBILE + 30}px;
      }
    }
  }
  main {
    background-color: ${p => p.theme.color.background};
    position: relative;
    padding-bottom: 60px;
  }
`;

const DiagonalSeparator = styled.div`
  height: 200px;
  background: linear-gradient(
    -182deg,
    ${p => p.theme.color.primaryLight} 50%,
    transparent 0%
  );

  @media ${p => p.theme.breakpoint.tablet} {
    height: 150px;
  }

  @media ${p => p.theme.breakpoint.mobile} {
    height: 100px;
    background: linear-gradient(
      -184deg,
      ${p => p.theme.color.primaryLight} 50%,
      transparent 0%
    );
  }
`;

interface Props {
  wrapperSize?: 'sm' | 'normal';
  hero?: HeroProps;
  isLoading?: boolean;
}

const Layout: React.FC<Props> = ({
  hero,
  wrapperSize = 'normal',
  isLoading = false,
  children,
}) => {
  return (
    <Container>
      <div className="header__header">
        <Header />
      </div>

      <main>
        {hero && (
          <div className="header__hero">
            <Wrapper size={wrapperSize}>
              <Hero {...hero} />
              {isLoading && <LoadingPlaceholder.Hero />}
            </Wrapper>
          </div>
        )}

        <DiagonalSeparator />

        <Wrapper size={wrapperSize}>
          {children}
          {isLoading && <LoadingPlaceholder.Content />}
        </Wrapper>
      </main>

      <Footer />
    </Container>
  );
};

export default Layout;
