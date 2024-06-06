function useSerializable<T>(getKey: string, initialState: T) {
 
  const state = readFromLocalStorage(getKey, initialState);

  const setState = (newState: T) => {
    writeToLocalStorage(getKey, newState)
  }

  return [state, setState];
}

function readFromLocalStorage<T>(getKey: string, initialState: T) {
  const data = localStorage.getItem(getKey); 
  return data && data !== "undefined"
    ? JSON.parse(data)
    : initialState;
}

function writeToLocalStorage<T>(getKey: string, state: T) {
  localStorage.setItem(getKey, JSON.stringify(state));
}

export default useSerializable;
