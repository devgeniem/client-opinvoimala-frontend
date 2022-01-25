import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useStore } from '../store/storeContext';
import Layout from '../components/Layout';
import { Divider, Grid } from 'semantic-ui-react';
import Watermark from '../components/Layout/Watermark';
import InnerHtmlDiv from '../components/InnerHtmlDiv';
import Cards from '../components/Cards';

const Details = styled(InnerHtmlDiv)`
  p {
    ${p => p.theme.font.size.sm}
  }
  h1 {
    ${p => p.theme.font.h2};
  }
  h2 {
    ${p => p.theme.font.h3};
  }
  h3 {
    ${p => p.theme.font.h4};
  }
  h4 {
    ${p => p.theme.font.h5};
  }
`;

export const FrontPage: React.FC = observer(() => {
  const {
    frontPage: { state, frontPage, fetchFrontPage },
  } = useStore();

  const { details, detailsImage, cards } = frontPage ?? {};

  const isLoading = state === 'NOT_FETCHED' || state === 'FETCHING';

  const hero = {
    title: frontPage?.title,
    lead: frontPage?.lead,
    image: frontPage?.image,
    align: 'center',
  };

  useEffect(() => {
    if (!frontPage && state === 'NOT_FETCHED') {
      fetchFrontPage();
    }
  }, [fetchFrontPage, frontPage, state]);

  return (
    <Layout hero={hero} isLoading={isLoading}>
      <Divider section hidden aria-hidden="true" />

      {cards && <Cards cards={cards} />}

      <Divider section hidden aria-hidden="true" />

      <Grid
        stackable
        centered
        reversed="computer tablet mobile"
        style={{ position: 'relative', marginTop: '80px' }}
      >
        <Grid.Row columns={2}>
          {details && (
            <Grid.Column mobile={16} tablet={16} computer={8}>
              <Details html={details} />
              <Divider hidden aria-hidden="true" />
            </Grid.Column>
          )}
          {detailsImage && (
            <Grid.Column mobile={16} tablet={16} computer={8}>
              <img src={detailsImage.url} alt="" />
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </Layout>
  );
});

export default FrontPage;
