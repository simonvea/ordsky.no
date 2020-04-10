/* eslint-disable no-param-reassign */
import produce from 'immer';
import { CloudState, CloudActions, initialState } from './cloudReducer.types';

export const wordsReducer = produce(
  // eslint-disable-next-line consistent-return
  (draft: CloudState = initialState, action: CloudActions) => {
    switch (action.type) {
      case 'CLOUD_START_COUNT':
        draft.loading = true;
        delete draft.wordCount;
        break;
      case 'CLOUD_FINISH_COUNT':
        draft.wordCount = action.data;
        console.log(action.data);
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
      default:
        return draft;
    }
  }
);
/* eslint-enable no-param-reassign */
