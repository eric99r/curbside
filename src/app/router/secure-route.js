import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';
import { connect } from 'react-redux';

// import SecureRedirect from './secure-redirect';

class SecureRoute extends React.Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        guard: PropTypes.func.isRequired
    };

    // shouldComponentUpdate(nextProps) {
    //     return !nextProps.criticalError; // disable update if critical error exists
    // }

    render() {
        const { user, guard, ...routeProps } = this.props;

        if (!user) {
            throw new Error('User is not defined');
        }

        return guard(user) ? (
            <Route {...routeProps} />
        ) : <Redirect exact from="/" to="/dashboard" />;
        // ) : (
        //     <SecureRedirect user={user} />
        // );
    }
}

const mapStateToProps = state => {
    return {
        // user: state.user.currentUser,
        user: state.auth.user.userData,
        // criticalError: state.error.criticalError
    };
};

export default connect(mapStateToProps)(SecureRoute);
