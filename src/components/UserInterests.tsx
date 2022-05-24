import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Divider, Grid, Icon as SemanticIcon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/storeContext';
import { useWindowDimensions } from '../utils/hooks';
import { Button } from './inputs';
import UserTagsModal from './UserTagsModal';
import { Carousel } from './Carousel';
import Card from './Card';
import UserTagsDrawer from './UserTagsDrawer';
import LoadingPlaceholder from './LoadingPlaceholder';

export const UserInterests: React.FC = observer(() => {
  const {
    userInterests: { fetchUserInterests, state, userInterests },
    auth: { userData },
  } = useStore();

  const [tagsFormOpen, setTagsFormOpen] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (!['FETCHED', 'FETCHING', 'ERROR'].includes(state)) {
      fetchUserInterests();
    }
  }, [fetchUserInterests, state]);

  useEffect(() => {
    fetchUserInterests();
  }, [userData, fetchUserInterests]);

  const getLinkLabel = (type: string) => {
    switch (type) {
      case (type = 'exercise'):
        return t('view.tests.action.start_exercise');
      case (type = 'test'):
        return t('view.tests.action.start_test');
      case (type = 'page'):
        return t('view.content_pages.navigate_to_page');
      default:
        return null;
    }
  };

  const carouselElements = userInterests.map(interest => {
    const link = interest.link && {
      ...interest.link,
      label: getLinkLabel(interest.type),
    };

    return (
      <Grid.Column key={`interest-${interest.type}-${interest.id}`}>
        <Card
          title={interest.title}
          text={interest.description}
          tags={interest.tags}
          link={link}
        />
      </Grid.Column>
    );
  });

  const openTagsModal = () => {
    setTagsFormOpen(true);
  };

  const { isMobile, isTablet } = useWindowDimensions();

  const columns = isMobile ? 1 : isTablet ? 2 : 3;

  if (state === 'FETCHING') {
    return <LoadingPlaceholder.Content />;
  }

  return (
    <section>
      <Carousel
        title={t('view.user_tags.title')}
        elements={carouselElements}
        columns={columns}
      />
      {userInterests.length === 0 && (
        <div>{t('view.user_tags.no_tags_chosen')}</div>
      )}

      <Divider hidden aria-hidden="true" />
      <Button
        id="user-interests__set-tags-button"
        text={t('view.user_tags.choose_tags')}
        color="primary"
        icon={<SemanticIcon name="plus square outline" size="large" />}
        onClick={openTagsModal}
      />
      {isTablet ? (
        <UserTagsDrawer
          tagsFormOpen={tagsFormOpen}
          setTagsFormOpen={setTagsFormOpen}
        />
      ) : (
        <UserTagsModal
          tagsFormOpen={tagsFormOpen}
          setTagsFormOpen={setTagsFormOpen}
        />
      )}
    </section>
  );
});
