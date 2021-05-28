const serialize = (value: any): string => {
    return JSON.stringify(value)
  }
  const deserialize = (value?: string): any => {
    if (typeof value !== 'string') { return undefined }
    try { return JSON.parse(value) }
    catch (e) { return value || undefined }
  }
  
  export const remove = (key: string) => { localStorage.removeItem(key) }
  
  export const set = (key: string, value: any): void => {
    if (value === undefined) { 
        localStorage.remove(key);
        return;
    }
    localStorage.setItem(key, serialize(value));
  }
  
  export const get = (key: string) => {
    const item = localStorage.getItem(key);
    const val = deserialize(item === null ? undefined : item);
    return val;
  }
  
  
  const forEach = (callback: (key: string, val: any) => void) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < localStorage.length; i++) {
        const key = (localStorage.key(i) as string);
        callback(key, get(key));
    }
  }
  
  export const getAll = () => {
    const ret = {}
    forEach((key, val) => {
        ret[key] = val
    })
    return ret
  }
  
  
  export const {clear} = localStorage;