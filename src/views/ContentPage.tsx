import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import Layout from '../components/Layout';
import { useParams } from '../routes/hooks';
import { useStore } from '../store/storeContext';
import Watermark from '../components/Layout/Watermark';

export const ContentPage = observer(() => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const slugRef = useRef<string>();

  const [fetchFailCount, setFetchFailCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string>();

  const {
    auth: { openLoginModal, isLoggedIn },
    contentPages: { state, getPage, fetchPage },
  } = useStore();

  const page = getPage(slug);

  const isLoading = state === 'FETCHING';

  const fetchPageFromApi = useCallback(
    async (slug: string) => {
      slugRef.current = slug;
      try {
        const pageId = Number(slug);
        if (pageId) {
          // If given slug was number, assume it's an page ID and fetch by it
          await fetchPage({ id: pageId });
        } else {
          // Otherwise fetch by slug
          await fetchPage({ slug });
        }
        setFetchFailCount(0);
      } catch (error: any) {
        setFetchFailCount(fetchFailCount + 1);
        if ([401, 403].includes(error?.statusCode)) {
          setErrorMsg(t('view.content_pages.unauthorized_info'));
          openLoginModal();
        }
      }
    },
    [fetchFailCount, fetchPage, openLoginModal, t]
  );

  useEffect(() => {
    if (fetchFailCount > 2) return;

    if (state === 'UNAUTHORIZED' && slugRef.current === slug) {
      if (isLoggedIn) {
        fetchPageFromApi(slug);
      }
    } else if (!page && slug.length && state !== 'FETCHING') {
      fetchPageFromApi(slug);
    }
  }, [fetchFailCount, fetchPageFromApi, isLoggedIn, page, slug, state]);

  const defaultTitle = errorMsg ? t('view.content_pages.error') : '';

  const hero = {
    title: page?.title ?? defaultTitle,
    lead: page?.lead ?? errorMsg,
  };

  return (
    <Layout wrapperSize="sm" hero={hero} isLoading={isLoading}>
      <Watermark right={-80} top={-40} />
      {page?.content && (
        <div dangerouslySetInnerHTML={{ __html: page.content }}></div>
      )}
    </Layout>
  );
});
