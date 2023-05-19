/* eslint-disable no-param-reassign */
import { produce } from 'immer';
import { CloudState, CloudActions } from './cloudReducer.types';

export const initialState = {
  loading: false,
};

export const wordsReducer = produce(
  // eslint-disable-next-line consistent-return
  (draft: CloudState, action: CloudActions) => {
    switch (action.type) {
      case 'CLOUD_START_COUNT':
        draft.loading = true;
        delete draft.wordCount;
        break;
      case 'CLOUD_FINISH_COUNT':
        draft.wordCount = action.data;
        draft.loading = false;
        break;
      case 'CLOUD_ERROR':
        draft.error = action.error;
        draft.loading = false;
        break;
      case 'CLOUD_CREATE':
        draft.loading = true;
        break;
      case 'CLOUD_CREATED':
        draft.loading = false;
        draft.cloud = action.data;
        delete draft.error;
        break;
      case 'CLOUD_RESET':
        delete draft.cloud;
        delete draft.error;
        delete draft.wordCount;
        draft.loading = false;
        break;
      default:
        return draft;
    }
  },
  initialState
);
/* eslint-enable no-param-reassign */
