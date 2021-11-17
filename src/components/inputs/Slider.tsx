import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getTrackBackground, Range } from 'react-range';
import { COLORS } from '../../theme';

const Container = styled.div`
  padding: ${p => p.theme.spacing.lg};
  padding-bottom: 80px;
  background-color: ${p => p.theme.color.grey3};
  border-radius: ${p => p.theme.borderRadius.md};

  font-family: ${p => p.theme.font.secondary};
  ${p => p.theme.font.size.sm};
`;

const Labels = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${p => p.theme.spacing.lg};
`;

const Track = styled.div`
  position: relative;
  height: 6px;
  width: 100%;
  border-radius: 10px;
  background-color: ${p => p.theme.color.primaryLight};
  box-shadow: 0px 1px 2px rgba(90, 97, 105, 0.1);
`;

const Thumb = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50px;
  background-color: ${p => p.theme.color.primary};
`;

const Mark = styled.div<{ isSelected: boolean }>`
  width: 1px;
  height: 12px;
  background-color: ${p => p.theme.color.primary};
  bottom: -36px;

  > div.slider-mark__index-number {
    position: absolute;
    bottom: -24px;
    left: -2px;
    color: ${p => p.theme.color.primary};
    font-weight: ${p => (p.isSelected ? 'bold' : 'normal')};
  }
`;

interface Props {
  options: SelectOption[];
  selectedOption?: SelectOption | null;
  onSelect: (answer?: SelectOption | null) => void;
  step?: number;
}

export const Slider: React.FC<Props> = ({
  options,
  selectedOption,
  onSelect,
  step = 1,
}) => {
  const min = 0;
  const max = options.length - 1;

  const defaultOptionIndex = Math.floor(options.length / 2);

  const initialValue = selectedOption
    ? options.map(({ id }) => id).indexOf(selectedOption.id)
    : defaultOptionIndex;

  const [values, setValues] = useState([initialValue]);

  useEffect(() => {
    if (!selectedOption) {
      const defaultOption = options[defaultOptionIndex];
      onSelect(defaultOption);
    }
  }, [defaultOptionIndex, onSelect, options, selectedOption]);

  const handleFinalChange = (values: number[]) => {
    if (values.length) {
      const optionIndex = values[0];
      const selectedOption = options[optionIndex];
      onSelect(selectedOption);
    }
  };

  return (
    <Container>
      <Labels>
        <div>{options[0].label}</div>
        <div>{options[options.length - 1].label}</div>
      </Labels>

      <Range
        step={step}
        min={min}
        max={max}
        values={values}
        onFinalChange={handleFinalChange}
        onChange={values => setValues(values)}
        renderThumb={({ props }) => <Thumb {...props} />}
        renderTrack={({ props, children }) => (
          <Track
            {...props}
            ref={props.ref}
            style={{
              background: getTrackBackground({
                values,
                colors: [COLORS.primary, COLORS.background],
                min,
                max,
              }),
            }}
          >
            {children}
          </Track>
        )}
        renderMark={({ props, index }) => (
          <Mark {...props} isSelected={values.includes(index)}>
            <div className="slider-mark__index-number">{index + 1}</div>
          </Mark>
        )}
      />
    </Container>
  );
};

export default Slider;
