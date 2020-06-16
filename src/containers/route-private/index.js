import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import useSelectorMap from '@utils/hooks/use-selector-map';
import useInit from '@utils/hooks/use-init';
import session from '@store/session/actions';

function RoutePrivate(props) {
  const { component: Component, ...routeProps } = props;

  const select = useSelectorMap(state => ({
    session: state.session,
  }));

  useInit(async () => {
    await session.remind();
  });

  routeProps.render = useCallback(
    props => {
      if (select.session.wait) {
        return (
          <div>
            <i>Check session...</i>
          </div>
        );
      } else if (select.session.exists) {
        return <Component {...props} />;
      } else {
        return <Redirect to={{ pathname: routeProps.failPath, state: { from: props.location } }} />;
      }
    },
    [select, Component],
  );

  return <Route {...routeProps} />;
}

RoutePrivate.propTypes = {
  component: PropTypes.any.isRequired,
  failPath: PropTypes.string,
};

RoutePrivate.defaultProps = {
  failPath: '/login',
};

export default React.memo(RoutePrivate);
