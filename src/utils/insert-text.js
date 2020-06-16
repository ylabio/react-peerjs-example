export default {
  after: (source, after, insert) => {
    const index = source.indexOf(after);
    if (index !== -1) {
      return source.substr(0, index) + insert + source.substr(index);
    } else {
      return source;
    }
  },

  before: (source, before, insert) => {
    let index = source.indexOf(before);
    if (index !== -1) {
      index += before.length;
      return source.substr(0, index) + insert + source.substr(index);
    } else {
      return source;
    }
  },
};
