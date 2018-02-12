/**
 * The Home view is the view one sees at /keystone. It shows a list of all lists,
 * grouped by their section.
 */

import React from 'react';
import { Container, Spinner } from '../../elemental';
import { connect } from 'react-redux';

import Lists from './components/Lists';
import Section from './components/Section';
import AlertMessages from '../../shared/AlertMessages';
import {
	loadCounts,
} from './actions';

var HomeView = React.createClass({
	displayName: 'HomeView',
	getInitialState () {
		return {
			modalIsOpen: true,
		};
	},
	// When everything is rendered, start loading the item counts of the lists
	// from the API
	componentDidMount () {
		this.props.dispatch(loadCounts());
	},
	getSpinner () {
		if (this.props.counts && Object.keys(this.props.counts).length === 0
			&& (this.props.error || this.props.loading)) {
			return (
				<Spinner />
			);
		}
		return null;
	},
	getNav() {
		const spinner = this.getSpinner();
		if (this.props.nav) {
			return this.props.nav.flat ?
				(<Lists
					counts={this.props.counts}
					lists={Keystone.lists}
					spinner={spinner} />)
				:
				(<div>
					{/* Render nav with sections */}
					{this.props.nav.sections.map((navSection) => {
						return (
							<Section key={navSection.key} id={navSection.key} label={navSection.label}>
								<Lists
									counts={this.props.counts}
									lists={navSection.lists}
									spinner={spinner}
								/>
							</Section>
						);
					})}
					{/* Render orphaned lists */}
					{Keystone.orphanedLists.length ? (
						<Section label="Other" icon="octicon-database">
							<Lists
								counts={this.props.counts}
								lists={Keystone.orphanedLists}
								spinner={spinner}
							/>
						</Section>
					) : null}
				</div>);
		}
		return null;
	},
	render () {
		return (
			<Container data-screen-id="home">
				<div className="dashboard-header">
					<div className="dashboard-heading">{Keystone.brand}</div>
				</div>
				<div className="dashboard-groups">
					{(this.props.error) && (
						<AlertMessages
							alerts={{ error: { error:
								"There is a problem with the network, we're trying to reconnect...",
							} }}
						/>
					)}
					{/* Render flat nav */}
					{this.getNav()}
				</div>
			</Container>
		);
	},
});

export {
	HomeView,
};

export default connect((state) => {
	return {
		counts: state.home.counts,
		nav: state.home.nav,
		loading: state.home.loading,
		error: state.home.error,
	}
})(HomeView);
