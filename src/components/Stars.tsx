import React from 'react';
import styled from 'styled-components';
import StarSvg from '../assets/icons/star.svg';

const MOBILE_STAR_SIZE = 0.75;

const Container = styled.div`
  display: flex;
  gap: ${p => p.theme.spacing.sm};
`;

const Star = styled.div<{ fullStarWidth: number; width?: number }>`
  height: ${p => p.fullStarWidth}px;
  width: ${p => (p.width ? p.width : p.fullStarWidth)}px;
  background-size: ${p => p.fullStarWidth}px;
  background-image: url(${StarSvg});
  background-position: left;
  background-repeat: no-repeat;

  @media ${p => p.theme.breakpoint.mobile} {
    height: ${p => p.fullStarWidth}px;
    width: ${p =>
      p.width
        ? p.width * MOBILE_STAR_SIZE
        : p.fullStarWidth * MOBILE_STAR_SIZE}px;
    background-size: ${p => p.fullStarWidth * MOBILE_STAR_SIZE}px;
  }
`;

interface Props {
  stars: number;
  starWidth?: number;
}

const Stars: React.FC<Props> = ({ stars, starWidth = 40 }) => {
  const fullStars = Math.floor(stars);
  const lastStarWidth = (stars - fullStars) * starWidth;

  const starObjects = Array.from(Array(fullStars).keys()).map(star => ({
    id: star,
    width: starWidth,
  }));

  if (lastStarWidth) {
    starObjects.push({ id: starObjects.length, width: lastStarWidth });
  }

  return (
    <Container>
      {starObjects.map(({ id, width }) => (
        <Star key={id} fullStarWidth={starWidth} width={width} />
      ))}
    </Container>
  );
};

export default Stars;