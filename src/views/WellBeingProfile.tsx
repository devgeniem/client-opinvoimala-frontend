import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import TestsSummary from '../components/tests/TestsSummary';
import { useStore } from '../store/storeContext';

export const WellBeingProfile: React.FC = observer(() => {
  const { t } = useTranslation();

  const {
    tests: { testsSummaryState, testsSummary, fetchTestsSummary },
  } = useStore();

  const isBusy = testsSummaryState === 'FETCHING';

  useEffect(() => {
    fetchTestsSummary();
  }, [fetchTestsSummary]);

  const hero = {
    title: t('view.well_being_profile.title'),
  };

  return (
    <Layout hero={hero} isLoading={isBusy}>
      {testsSummary && <TestsSummary {...testsSummary} />}
    </Layout>
  );
});
