import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckboxProps } from 'semantic-ui-react';
import styled from 'styled-components';
import i18n from '../../../i18n';
import { AppointmentIn, RepeatScope } from '../../../store/models';
import { formatDateTime } from '../../../utils/date';
import ConfirmDialog from '../../ConfirmDialog';
import { RadioButtons } from '../../inputs';

const REPEAT_SCOPE_OPTIONS = Object.values(RepeatScope).map(scope => ({
  value: scope,
  label: i18n.t(`view.admin.appointments.repeat.scope.${scope}`),
}));

const Container = styled.div`
  h2 {
    ${p => p.theme.font.h5};
    margin-top: ${p => p.theme.spacing.lg};
    margin-bottom: ${p => p.theme.spacing.md};
  }
  span {
    line-height: 160%;
  }

  .radio-buttons-container {
    margin: ${p => p.theme.spacing.md} 0;
  }
`;

interface Props {
  appointment: AppointmentIn;
  actionType: 'edit' | 'delete';
  onConfirm: (scope: RepeatScope) => void;
  disabled?: boolean;
}

const EditAppointmentButton: React.FC<Props> = ({
  appointment,
  actionType = 'edit',
  onConfirm,
  disabled,
}) => {
  const { t } = useTranslation();

  const [selectedScope, setSelectedScope] = useState<RepeatScope>(
    RepeatScope.none
  );

  const { startTime, endTime, repeatRule } = appointment;

  const isDeleteAction = actionType === 'delete';
  const isRepeating = repeatRule !== 'once';

  const _startTime = formatDateTime(startTime);
  const _endTime = formatDateTime(endTime, {
    format: 'T',
  });
  const appointmentTime = `${_startTime}\u2013${_endTime}`;

  const handleScopeChange = (
    _: React.FormEvent<HTMLInputElement>,
    data: CheckboxProps
  ) => {
    setSelectedScope(data.value as RepeatScope);
  };

  return (
    <ConfirmDialog
      buttonProps={{
        id: `appointment-form__${actionType}-button`,
        text: isDeleteAction ? t('action.delete') : t('action.save'),
        color: isDeleteAction ? 'accent' : undefined,
        disabled,
      }}
      title={t(`view.admin.appointments.form.${actionType}_title`)}
      onSubmit={() => onConfirm(selectedScope)}
      submitLabel={t(`action.confirm_${actionType}`)}
    >
      <Container>
        <h2>{t('label.date')}</h2>
        <span>{appointmentTime}</span>

        {isRepeating && (
          <>
            <h2>{t('label.repeat')}</h2>
            <span>
              {t(`view.admin.appointments.repeat.${actionType}_confirm_text`)}
            </span>

            <div className="radio-buttons-container">
              <RadioButtons
                groupName="repeat-scope"
                selected={selectedScope}
                options={REPEAT_SCOPE_OPTIONS}
                onChange={handleScopeChange}
              />
            </div>
          </>
        )}
      </Container>
    </ConfirmDialog>
  );
};

export default EditAppointmentButton;
