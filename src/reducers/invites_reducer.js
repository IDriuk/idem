import _ from 'lodash';
import { FETCH_INVITES,
  SUBSCRIBE_USER,
  UNSUBSCRIBE_USER,
  ARCHIVE_USER,
  DELETE_USER
} from '../actions';
import { fakeInvites } from './fake_invites';

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_INVITES:
      return action.payload;
    case SUBSCRIBE_USER:
      return state.map((invite) => {
        const newInvite = {...invite};
        const url = action.payload.url;
        if (newInvite.url == url) {
          newInvite.isSubscribed = true;
          newInvite.subCount++;
        }
        return newInvite;
      });
    case UNSUBSCRIBE_USER:
      return state.map((invite) => {
        const newInvite = {...invite};
        const url = action.payload.url;
        if (newInvite.url == url) {
          newInvite.isSubscribed = false;
          newInvite.subCount--;
        }
        return newInvite;
      });
    case ARCHIVE_USER:
      return state.map((invite) => {
        const {url, subscriber}  = action.payload;
        const newInvite = {...invite};
        if (newInvite.url == url) {
          const { subscribe, unsubscribe, archive } = newInvite;
          const { uid } = subscriber;
          newInvite.subscribe =  _.filter(subscribe, (user) => user.uid != uid );
          newInvite.unsubscribe = _.filter(unsubscribe, (user) => user.uid != uid );
          if ( _.findIndex(archive, (user) => user.uid == uid ) < 0 ) {
            newInvite.archive.unshift(subscriber);
          }
        }
        return newInvite;
      });
    case DELETE_USER:
      return state.map((invite) => {
        const {url, subscriber}  = action.payload;
        const newInvite = {...invite};
        if (newInvite.url == url) {
          const { archive } = newInvite;
          const { uid } = subscriber;
          newInvite.archive = _.filter(archive, (user) => user.uid != uid );
        }
        return newInvite;
      });
  }

  return state;
}
