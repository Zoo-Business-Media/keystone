import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var CronColumn = React.createClass({
    displayName: 'CronColumn',
    propTypes: {
        col: React.PropTypes.object,
        data: React.PropTypes.object,
    },
    renderValue () {
        return this.props.data.fields[this.props.col.path];
    },
    render () {
        return (
            <ItemsTableCell>
                <ItemsTableValue field={this.props.col.type}>
                    {this.renderValue()}
                </ItemsTableValue>
            </ItemsTableCell>
        );
    },
});

module.exports = CronColumn;
