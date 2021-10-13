import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Appointment } from '../store/AppointmentsStore';
import { formatDateTime } from '../utils/date';
import { Button } from './inputs';

const Container = styled.section`
  margin-bottom: ${p => p.theme.spacing.xl};

  h1 {
    ${p => p.theme.font.h2};
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      font-family: ${p => p.theme.font.secondary};
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: ${p => p.theme.spacing.lg};
      padding: ${p => p.theme.spacing.lg};
      ${p => p.theme.shadows[0]};

      .appointment {
        &__time,
        &__specialist--role {
          color: ${p => p.theme.color.foreground};
        }

        &__time {
          min-width: 160px;
        }

        &__specialist {
          flex: 1;
          margin-left: ${p => p.theme.spacing.lg};
          &--role {
            margin-right: ${p => p.theme.spacing.lg};
            font-weight: bold;
          }
        }

        &__action-buttons {
          display: flex;
          gap: ${p => p.theme.spacing.lg};
        }
      }
    }
  }

  @media ${p => p.theme.breakpoint.tablet} {
    ul {
      li {
        flex-direction: column;
        align-items: flex-start;

        .appointment {
          &__specialist {
            margin: 0;
            margin-top: ${p => p.theme.spacing.lg};
            span {
              display: block;
            }
          }
          &__action-buttons {
            margin-top: ${p => p.theme.spacing.lg};
            flex-direction: column-reverse;
            gap: ${p => p.theme.spacing.md};
          }
        }
      }
    }
  }
`;

interface Props {
  title?: string;
  items: Appointment[];
  onCancel?: (id: number) => void;
  onJoin?: (link: string) => void;
}

const AppointmentsList: React.FC<Props> = ({
  title,
  items,
  onCancel,
  onJoin,
}) => {
  const { t } = useTranslation();

  const showButtons = onCancel || onJoin;

  return (
    <Container>
      {title && <h1>{title}</h1>}

      <ul>
        {items.map(({ id, startTime, appointmentSpecialist, meetingLink }) => (
          <li key={id}>
            <div className="appointment__time">{formatDateTime(startTime)}</div>

            <div className="appointment__specialist">
              <span className="appointment__specialist--role">
                {appointmentSpecialist?.role}
              </span>
              <span>{appointmentSpecialist?.name}</span>
            </div>

            {showButtons && (
              <div className="appointment__action-buttons">
                {onCancel && (
                  <Button
                    aria-label="Cancel meeting"
                    id={`appointment-${id}__cancel-button`}
                    text={t('view.appointments.action.cancel_appointment')}
                    onClick={() => onCancel(id)}
                    color="grey3"
                    negativeText
                    noMargin
                  />
                )}
                {onJoin && meetingLink && (
                  <Button
                    aria-label="Join meeting"
                    id={`appointment-${id}__join-meet-button`}
                    text={t('view.appointments.action.join_meeting')}
                    onClick={() => onJoin(meetingLink)}
                    noMargin
                  />
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default AppointmentsList;
