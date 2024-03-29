import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import Drawer from '../Drawer';
import { Button } from '../inputs';
import MakeAppointmentContainer from './MakeAppointmentContainer';

const TriggerButtonContainer = styled.div`
  margin-top: ${p => p.theme.spacing.xl};
`;

export const MakeAppointmentDrawer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Drawer
      fullWidth
      triggerEl={(isOpen, onClick) => (
        <TriggerButtonContainer>
          <Button
            aria-expanded={isOpen}
            id="appointments__make-new-appointment-button"
            text={t('view.appointments.make_new.title')}
            color="primary"
            icon={<Icon name="plus square outline" size="large" />}
            onClick={onClick}
          />
        </TriggerButtonContainer>
      )}
      content={(drawerRef, onClose) => (
        <MakeAppointmentContainer onGoBack={onClose} containerRef={drawerRef} />
      )}
    />
  );
};

export default MakeAppointmentDrawer;
