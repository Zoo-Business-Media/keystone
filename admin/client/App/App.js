/**
 * The App component is the component that is rendered around all views, and
 * contains common things like navigation, footer, etc.
 */

import React from 'react';
import { Container } from './elemental';
import { Link } from 'react-router';
import { css } from 'glamor';

import MobileNavigation from './components/Navigation/Mobile';
import PrimaryNavigation from './components/Navigation/Primary';
import SecondaryNavigation from './components/Navigation/Secondary';
import Footer from './components/Footer';
import { connect } from 'react-redux';

const classes = {
	wrapper: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100vh',
	},
	body: {
		flexGrow: 1,
	},
};

const App = React.createClass({
	render() {
		if (!this.props.nav) {
			return (
				<div></div>
			)
		}
		const listsByPath = require('../utils/lists').listsByPath;
		let props = this.props;
		let children = props.children;
		// If we're on either a list or an item view
		let currentList, currentSection;
		if (props.params.listId) {
			currentList = listsByPath[props.params.listId];
			// If we're on a list path that doesn't exist (e.g. /keystone/gibberishasfw34afsd) this will
			// be undefined
			if (!currentList) {
				children = (
					<Container>
						<p>List not found!</p>
						<Link to={`${Keystone.adminPath}`}>
							Go back home
						</Link>
					</Container>
				);
			} else {
				// Get the current section we're in for the navigation
				currentSection = props.nav.by.list[currentList.key];
			}
		}
		// Default current section key to dashboard
		const currentSectionKey = (currentSection && currentSection.key) || 'dashboard';
		return (
			<div className={css(classes.wrapper)}>
				<header>
					<MobileNavigation
						brand={Keystone.brand}
						currentListKey={props.params.listId}
						currentSectionKey={currentSectionKey}
						sections={props.nav.sections}
						signoutUrl={Keystone.signoutUrl}
					/>
					<PrimaryNavigation
						currentSectionKey={currentSectionKey}
						brand={Keystone.brand}
						sections={props.nav.sections}
						signoutUrl={Keystone.signoutUrl}
					/>
					{/* If a section is open currently, show the secondary nav */}
					{(currentSection) ? (
						<SecondaryNavigation
							currentListKey={props.params.listId}
							lists={currentSection.lists}
							itemId={props.params.itemId}
						/>
					) : null}
				</header>
				<main className={css(classes.body)}>
					{children}
				</main>
				<Footer
					appversion={Keystone.appversion}
					backUrl={Keystone.backUrl}
					brand={Keystone.brand}
					User={Keystone.User}
					user={Keystone.user}
					version={Keystone.version}
				/>
			</div>
		);
	}
});

export default connect((state) => {
	return {
		nav: state.home.nav
	}
})(App);
