import React, { useEffect } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store/storeContext';
import { useCookiebotConsent } from '../utils/hooks/useCookiebotConsent';

const Container = styled.div`
  position: relative;
  p {
    line-height: 160% !important;
  }
`;

const noConsentContainerStyle = `
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  margin: 16px 0;

  background: #eee;
  border: 1px solid #ddd;
  border-radius: 8px;

  color: #666;
  font-size: 0.875rem;
  font-style: italic;
`;

interface Props {
  html: string;
}

const InnerHtmlDiv: React.FC<Props> = observer(({ html }) => {
  const {
    settings: { isCookiebotActivated },
  } = useStore();

  const cookieConsent = useCookiebotConsent(isCookiebotActivated);

  /**
   * Detect embedded Pym.js content and initialize Pym if found any
   */
  useEffect(() => {
    // @ts-ignore
    if (window.pym && html.includes('data-pym-src')) {
      // @ts-ignore
      window.pym.autoInit();
    }
  }, [html]);

  let __html = html;

  /**
   * Replace all embedded iframes with placeholder text if cookies are not accepted
   */
  if (!cookieConsent?.marketing) {
    // Matches an <iframe ... src="xyz"></iframe> element and captures its src-value as a group $1.
    const embedContentRegex = /<iframe[^>]*src="([^"]*)"[^<]*<\/iframe>/gi;

    // Placeholder element to be shown instead of the embedded iframe element.
    const placeholderElement = `
      <div style="${noConsentContainerStyle}">
        <div>Markkinointievästeet tulee olla hyväksyttynä, jotta tämä sisältö voidaan näyttää.</div>
        <a href="$1" target="_blank">$1</a>
      </div>`;

    // Marketing cookies are not accepted. Show placeholder div instead of iframe elements (youtube embeds etc)
    __html = __html.replaceAll(embedContentRegex, placeholderElement);
  }

  // Replace all img src attributes of form <img src="/uploads/..." /> with api url prefixed
  const imgSrcRegex = /(<img[^>]*src=")(\/uploads[^"]*)"/gi;
  __html = __html.replaceAll(
    imgSrcRegex,
    `$1${process.env.REACT_APP_API_URL}$2"`
  );

  return <Container dangerouslySetInnerHTML={{ __html }}></Container>;
});

export default InnerHtmlDiv;
