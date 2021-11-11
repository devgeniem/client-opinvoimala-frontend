import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import TestsList from '../components/tests/TestsList';
import { useStore } from '../store/storeContext';

export const Tests: React.FC = observer(() => {
  const { t } = useTranslation();

  const {
    tests: {
      categories,
      categoriesState,
      fetchCategories,
      exercises,
      exercisesState,
      fetchExercises,
    },
  } = useStore();

  const isBusy = [categoriesState, exercisesState].includes('FETCHING');

  useEffect(() => {
    if (categoriesState === 'NOT_FETCHED') fetchCategories();
  }, [categoriesState, fetchCategories]);

  useEffect(() => {
    if (exercisesState === 'NOT_FETCHED') fetchExercises();
  }, [exercisesState, fetchExercises]);

  const hero = {
    title: t('route.tests'),
  };

  return (
    <Layout hero={hero} isLoading={isBusy}>
      {categories?.map(({ id, label, tests }) => (
        <TestsList key={id} title={label} items={tests} />
      ))}

      {exercises && (
        <TestsList title={t('view.tests.exercises')} items={exercises} />
      )}
    </Layout>
  );
});