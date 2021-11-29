import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { HashLink } from 'react-router-hash-link';
import { Divider } from 'semantic-ui-react';
import Annotation from '../components/Annotation';
import Icon from '../components/Icon';
import Layout from '../components/Layout';
import NoPrint from '../components/NoPrint';
import TestsList from '../components/tests/TestsList';
import TestsSummary from '../components/tests/TestsSummary';
import { path } from '../routes/routes';
import { useStore } from '../store/storeContext';

const VISIBLE_TESTS = 9;
const VISIBLE_EXERCISES = 3;

export const WellBeingProfile: React.FC = observer(() => {
  const { t } = useTranslation();
  const history = useHistory();

  const {
    tests: {
      testsSummary,
      testsSummaryState,
      fetchTestsSummary,
      allTests,
      categoriesState,
      fetchCategories,
      exercises,
      exercisesState,
      fetchExercises,
    },
  } = useStore();

  const isBusy = testsSummaryState === 'FETCHING';
  const initialLoading = !testsSummary && isBusy;

  useEffect(() => {
    fetchTestsSummary();
  }, [fetchTestsSummary]);

  useEffect(() => {
    if (categoriesState === 'NOT_FETCHED') fetchCategories();
  }, [categoriesState, fetchCategories]);

  useEffect(() => {
    if (exercisesState === 'NOT_FETCHED') fetchExercises();
  }, [exercisesState, fetchExercises]);

  const heroActions = [
    {
      id: 'well-being-profile__appointment-button',
      text: t('view.well_being_profile.make_appointment'),
      icon: <Icon type="Chat" />,
      onClick: () => history.push(`/${path('appointments')}`),
    },
    {
      id: 'well-being-profile__download-button',
      text: t('action.download'),
      icon: <Icon type="Download" color="none" />,
      onClick: () => window.print(),
    },
  ];

  const hero = {
    title: t('view.well_being_profile.title'),
    actions: heroActions,
  };

  const getTestsLink = (type: 'tests' | 'exercises') => {
    let isVisible = false;
    let label = '';
    let to = `/${path('tests')}`;

    switch (type) {
      case 'tests':
        isVisible = allTests?.length > VISIBLE_TESTS;
        label = t('view.well_being_profile.all_tests');
        break;
      case 'exercises':
        isVisible = !!exercises && exercises.length > VISIBLE_EXERCISES;
        label = t('view.well_being_profile.all_exercises');
        to = `${to}#exercises`;
        break;
    }

    return (
      isVisible && (
        <HashLink to={to} style={{ marginTop: 32 }}>
          {label}
          <Icon type="ArrowRight" strokeColor="secondary" color="none" />
        </HashLink>
      )
    );
  };

  return (
    <Layout hero={hero} isLoading={initialLoading}>
      {testsSummary && <TestsSummary {...testsSummary} />}

      <Divider section hidden />

      <Annotation text={t('annotation.well_being_profile')} />

      <NoPrint>
        <Divider section hidden />

        <TestsList
          id="tests"
          title={t('view.well_being_profile.tests')}
          items={allTests}
          initialItemCount={VISIBLE_TESTS}
          disableExpand
        >
          {getTestsLink('tests')}
        </TestsList>

        {exercises && (
          <TestsList
            id="exercises"
            title={t('view.well_being_profile.exercises')}
            items={exercises}
            initialItemCount={VISIBLE_EXERCISES}
            disableExpand
          >
            {getTestsLink('exercises')}
          </TestsList>
        )}
      </NoPrint>
    </Layout>
  );
});