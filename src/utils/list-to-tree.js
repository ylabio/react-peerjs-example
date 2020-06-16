import _get from 'lodash.get';

export default function listToTree(
  list,
  privateKey = '_id',
  parentKey = 'parent._id',
  childrenKey = 'children',
) {
  let trees = {};
  let roots = {};
  for (const item of list) {
    if (!trees[item[privateKey]]) {
      trees[item[privateKey]] = item;
      trees[item[privateKey]][childrenKey] = [];
      roots[item[privateKey]] = trees[item[privateKey]];
    } else {
      trees[item[privateKey]] = Object.assign(trees[item[privateKey]], item);
    }
    if (_get(item, parentKey)) {
      if (!trees[_get(item, parentKey)]) {
        trees[_get(item, parentKey)] = { [childrenKey]: [] };
      }
      trees[_get(item, parentKey)][childrenKey].push(trees[item[privateKey]]);
      if (roots[item[privateKey]]) {
        delete roots[item[privateKey]];
      }
    }
  }
  return Object.values(roots);
}
