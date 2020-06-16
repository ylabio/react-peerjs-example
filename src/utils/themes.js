import cn from 'classnames';

/**
 * Prefix for the classes
 * @param block
 * @param classes optionals
 * @returns {function(...[*]=)|String}
 */
export default function (block, ...classes) {
  const base = block + '_theme_';
  const f = (...classes) => {
    return base + cn(classes).replace(/(\s+)/g, `$1${base}`);
  };
  return classes && classes.length ? f(classes) : f;
}
