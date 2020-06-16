import params from '@utils/query-params';
import Common from '@api/common';

export default class Users extends Common {
  constructor(api, path = 'users') {
    super(api, path);
  }

  getList({
    search,
    fields = 'items(*), count, allCount, newCount, confirmCount, rejectCount',
    limit = 20,
    skip = 0,
    path,
    ...other
  }) {
    return super.getList({ search, fields, limit, skip, path, ...other });
  }

  current({ fields = '*', ...other }) {
    return this.http.get(`/api/v1/${this.path}/self`, { params: params({ fields, ...other }) });
  }

  login({ login, password, remember = false, fields = '*', ...other }) {
    return this.http.post(
      `/api/v1/users/sign`,
      { login, password, remember },
      { params: params({ fields, ...other }) },
    );
  }

  logout() {
    return this.http.delete(`/api/v1/users/sign`);
  }

  registration({ profile = {}, ...rest }) {
    return this.http.post(`/api/v1/users`, { profile, ...rest });
  }

  resetPassword({ login }) {
    return this.http.post(`/api/v1/users/password`, { login });
  }
}
