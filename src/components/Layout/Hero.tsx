import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { Image } from '../../store/models';
import useWindowDimensions from '../../utils/hooks';
import Icon from '../Icon';
import { Button } from '../inputs';
import Watermark from './Watermark';

const Container = styled.div`
  margin-bottom: -40px;
  position: relative;
  display: flex;
  justify-content: space-between;

  .hero {
    &__main-column {
      flex: 1;
      h1 {
        line-height: 77px;
      }
    }

    &__side-column {
      position: absolute;
      right: 0;
      top: 0;
      width: 30%;
    }

    &__side-column-placeholder {
      width: 35%;
    }

    &__back-button-label {
      display: flex;
      align-items: center;

      svg {
        margin-left: -10px;
        margin-right: 5px;
      }
    }
  }

  @media ${p => p.theme.breakpoint.mobile} {
    flex-direction: column;
    align-items: center;
    .hero {
      &__side-column,
      &__main-column {
        position: initial;
        width: 100%;
      }
      &__main-column {
        h1 {
          line-height: 43px;
        }
        &.align-center {
          text-align: center;
        }
        > img {
          width: 80px;
          float: left;
          margin-right: ${p => p.theme.spacing.lg};
        }
      }
    }
  }
`;

export interface HeroProps {
  title?: string | null;
  lead?: string | JSX.Element | null;
  image?: Image | null;
  smallImage?: boolean;
  align?: string;
  goBackText?: string;
  showGoBack?: boolean;
  onGoBackClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({
  title,
  lead,
  image,
  smallImage,
  align = 'left',
  goBackText,
  showGoBack,
  onGoBackClick,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { isMobile } = useWindowDimensions();

  const handleGoBack = () => {
    if (onGoBackClick) {
      onGoBackClick();
    } else {
      history.goBack();
    }
  };

  const goBackButton = (
    <Button
      id="hero__back-button"
      onClick={handleGoBack}
      isSmall
      text={
        <div className="hero__back-button-label">
          <Icon type="ChevronLeft" />
          {goBackText ?? t('action.go_back')}
        </div>
      }
    />
  );

  const imageEl = !image?.url ? undefined : (
    <img src={image?.url} alt="" width={smallImage ? '150px' : '300px'} />
  );

  return (
    <Container>
      <Watermark isNegative left={-220} top={40} />

      <div className={`hero__main-column align-${align}`}>
        {(showGoBack || goBackText || onGoBackClick) && goBackButton}
        <h1>{title}</h1>
        {isMobile && imageEl}
        <div>{lead}</div>
      </div>

      {imageEl && !isMobile && (
        <>
          <div className="hero__side-column">{imageEl}</div>
          <div className="hero__side-column-placeholder"></div>
        </>
      )}
    </Container>
  );
};

export default Hero;
