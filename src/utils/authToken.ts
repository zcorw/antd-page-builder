import { set as setStore, get, remove } from './store';

export function getToken(): string | undefined {
  return (get('access_token') || {}).token;
}

export function clear(): void {
  remove('access_token');
}

export function set(data: AccountToken) {
  setStore('access_token', data);
}
