import { useState, useEffect } from 'react';
import { useCallToActionContext } from '../state/CallToActionContext';

const DAYS_UNTIL_SHOW_AGAIN = 7;
const CLOUD_CREATED_COUNT = 10;

function getDaysSinceLastSeen(lastSeen: number, now: number): number {
  if (lastSeen === 0) return 0;
  return (now - lastSeen) / (1000 * 60 * 60 * 24);
}

export type UseCallToActionProps = {
  shouldShowOnFirstVisit?: boolean;
};

export type UseCallToAction = {
  shouldDisplayCallToAction: boolean;
  incrementCloudCount: () => void;
};

export function useCallToAction({
  shouldShowOnFirstVisit = false,
}: UseCallToActionProps = {}): UseCallToAction {
  const [shouldShow, setShouldShow] = useState(false);
  const { stats, incrementCloudCount } = useCallToActionContext();

  useEffect(() => {
    const now = Date.now();
    const isFirstVisit = stats.visitCount === 0;
    const isLongTimeSinceLastSeen =
      getDaysSinceLastSeen(stats.lastSeen, now) > DAYS_UNTIL_SHOW_AGAIN;
    const isNthCloud = stats.cloudCreatedCount % CLOUD_CREATED_COUNT === 0;
    const isThirdCloud = stats.cloudCreatedCount === 3;

    const shouldDisplay =
      (shouldShowOnFirstVisit && isFirstVisit) ||
      (!shouldShowOnFirstVisit && isThirdCloud) ||
      isLongTimeSinceLastSeen ||
      isNthCloud;

    setShouldShow(shouldDisplay);
  }, [stats, shouldShowOnFirstVisit]);

  return { shouldDisplayCallToAction: shouldShow, incrementCloudCount };
}
