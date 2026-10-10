export function updateAtPath(source, path, value) {
  const clone = structuredClone(source);
  let current = clone;
  for (let index = 0; index < path.length - 1; index += 1) {
    current = current[path[index]];
  }
  current[path[path.length - 1]] = value;
  return clone;
}

export function addArrayItem(source, path, item) {
  const clone = structuredClone(source);
  let current = clone;
  for (const key of path) current = current[key];
  current.push(item);
  return clone;
}

export function removeArrayItem(source, path, indexToRemove) {
  const clone = structuredClone(source);
  let current = clone;
  for (const key of path) current = current[key];
  current.splice(indexToRemove, 1);
  return clone;
}
