import params from '@utils/query-params';

class Common {
  /**
   * @param http {AxiosInstance}
   * @param path {String}
   */
  constructor(http, path = 'common') {
    this.http = http;
    this.path = path;
  }

  /**
   * Get List
   * @param search {Object}
   * @param fields {String}
   * @param limit {Number}
   * @param skip {Number}
   * @param path {String}
   * @param other {Object}
   * @returns {Promise}
   */
  getList({ search, fields = 'items(*),count', limit = 20, skip = 0, path = undefined, ...other }) {
    return this.http.get(`/api/v1/${path || this.path}`, {
      params: params({ search, fields, limit, skip, ...other }),
    });
  }

  /**
   * Get One
   * @param id {String}
   * @param fields {String}
   * @param path {String}
   * @param other {Object}
   * @returns {Promise}
   */
  getOne({ id, fields = '*', path = undefined, ...other }) {
    return this.http.get(`/api/v1/${path || this.path}/${id}`, {
      params: params({ fields, ...other }),
    });
  }

  /**
   * Create
   * @param data {Object}
   * @param fields {String}
   * @param path {String}
   * @param other {Object}
   * @returns {Promise}
   */
  create({ data, fields = '*', path = undefined, ...other }) {
    return this.http.post(`/api/v1/${path || this.path}`, data, {
      params: params({ fields, ...other }),
    });
  }

  /**
   * Update
   * @param id {String}
   * @param data {Object}
   * @param fields {String}
   * @param path {String}
   * @param other {Object}
   * @returns {Promise}
   */
  update({ id, data, fields = '*', path = undefined, ...other }) {
    return this.http.put(`/api/v1/${path || this.path}/${id}`, data, {
      params: params({ fields, ...other }),
    });
  }

  /**
   * Delete
   * @param id {String}
   * @param fields {String}
   * @param path {String}
   * @param other {Object}
   * @returns {Promise}
   */
  delete({ id, fields = '*', path = undefined, ...other }) {
    return this.http.delete(`/api/v1/${path || this.path}/${id}`, {
      params: params({ fields, ...other }),
    });
  }
}

export default Common;
