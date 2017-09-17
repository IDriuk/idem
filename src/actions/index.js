import axios from 'axios';

export const FETCH_INVITES = 'fetch_invites';
export const SUBSCRIBE_USER = 'subscribe_user';
export const UNSUBSCRIBE_USER = 'unsubscribe_user';
export const ARCHIVE_USER = 'archive_user';
export const DELETE_USER = 'delete_user';

export function subscribeUser (invite) {
  return function(dispatch) {
    const { url } = invite;

    const user = localStorage.getItem('user');
    const hash = user ? JSON.parse(user).hash : 'unauthorized';

    if (hash == 'unauthorized') {
        alert('чтобы записаться на мероприятие или посмотреть, кто собирается прийти к тебе, надо войти с помощью Вконтакта'); 
    }

    const subscription = 'subscribe';
    axios.post(`/subscribe`, { subscription, url, hash })
      .then(response => {
        dispatch({
          type: SUBSCRIBE_USER,
          payload: invite
        });
      })
      .catch(() => {
        alert('Ошибка подключения. Проверьте состояние подключения к интернету.');
      });
  }
}

export function unsubscribeUser (invite) {
  return function(dispatch) {
    const { url } = invite;

    const user = localStorage.getItem('user');
    const hash = user ? JSON.parse(user).hash : 'unauthorized';
    const subscription = 'unsubscribe';
    axios.post(`/subscribe`, { subscription, url, hash })
      .then(response => {
        dispatch({
          type: UNSUBSCRIBE_USER,
          payload: invite
        });
      })
      .catch(() => {
        alert('Ошибка подключения. Проверьте состояние подключения к интернету.');
      });
  }
}

export function archiveUser (user) {
  return function(dispatch) {
    const { hash } = JSON.parse(localStorage.getItem('user'));
    const subscription = 'archive';
    const {subscriber: {uid}, url} = user;
    axios.post(`/archive`, { subscription, uid, hash, url })
      .then(response => {
        dispatch({
          type: ARCHIVE_USER,
          payload: user
        });
      })
      .catch(() => {
        alert('Ошибка подключения. Проверьте состояние подключения к интернету.');
      });
  }
}

export function  deleteUser (user) {

  return function(dispatch) {
    const { hash } = JSON.parse(localStorage.getItem('user'));
    const subscription = 'delete';
    const {subscriber: {uid}, url} = user;
    axios.post(`/archive`, { subscription, uid, hash, url })
      .then(response => {
        dispatch({
          type: DELETE_USER,
          payload: user
        });
      })
      .catch(() => {
        alert('Ошибка подключения. Проверьте состояние подключения к интернету.');
      });
  }
}
