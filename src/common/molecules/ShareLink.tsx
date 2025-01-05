import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { SecondaryButton } from '../atoms/Button';

const ShareButton = styled(SecondaryButton)`
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  gap: 0.5rem;
`;

const ShareTextContainer = styled.span`
  display: grid;
`;

const slideFromTop = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ShareText = styled.span<{ $show: boolean }>`
  width: 104px;
  opacity: ${(props) => (props.$show ? 1 : 0)};
  transform: ${(props) =>
    props.$show ? 'translateY(0)' : 'translateY(-100%)'};
  grid-column: 1;
  grid-row: 1;
  animation: ${(props) => (props.$show ? slideFromTop : 'none')} 0.3s
    ease-in-out;
`;

const shareText = 'Link til Ordsky';

export const ShareLink = (): React.ReactElement => {
  const [showCopiedJoinUrlMessage, setShowCopiedJoinUrlMessage] =
    useState(false);

  const shareableLink =
    globalThis.location.origin + globalThis.location.pathname;

  const handleShare = (): void => {
    navigator.clipboard.writeText(shareableLink);
    // logger.logEvent('share_cloud');
    setShowCopiedJoinUrlMessage(true);
    const timeout = setTimeout(() => {
      setShowCopiedJoinUrlMessage(false);
      clearTimeout(timeout);
    }, 3000);
  };

  return (
    <ShareButton type="button" onClick={handleShare}>
      <FontAwesomeIcon icon={faLink} />
      <ShareTextContainer>
        <ShareText $show={!showCopiedJoinUrlMessage}>{shareText}</ShareText>
        <ShareText $show={showCopiedJoinUrlMessage}>Link kopiert!</ShareText>
      </ShareTextContainer>
    </ShareButton>
  );
};
