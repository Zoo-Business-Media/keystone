import React from 'react';
import Select from 'react-select';
import Checkbox from './Checkbox';

module.exports = React.createClass({
    getInitialState () {
        let scope = "any";
        let parts = [0,1,2,3,4,5,6]
        if (this.props.value !== "*") {
            scope = "only";
            parts = this.props.value.split(",").map((val) => parseInt(val));
        }
        return {
            scope: scope,
            days: {
                1: {"value": 1, label: "Mon", checked: parts.indexOf(1) !== -1},
                2: {"value": 2, label: "Tues", checked: parts.indexOf(2) !== -1},
                3: {"value": 3, label: "Wed", checked: parts.indexOf(3) !== -1},
                4: {"value": 4, label: "Thurs", checked: parts.indexOf(4) !== -1},
                5: {"value": 5, label: "Fri", checked: parts.indexOf(5) !== -1},
                6: {"value": 6, label: "Sat", checked: parts.indexOf(6) !== -1},
                0: {"value": 0, label: "Sun", checked: parts.indexOf(0) !== -1}
            }
        };
    },
    getValue (scope, days) {
        if (scope === "only") {
            let value = Object.values(days).filter((day) => day.checked).map((day) => day.value).join(",")
            if (value == "") {
                // Empty isn't a value cron part
                // No day of week is divisible by 8 so this suffices
                return "*/8"
            } else {
                return value
            }
        } else {
            return "*"
        }
    },
    scopeChanged (newValue) {
        this.props.valueChanged(this.getValue(newValue, this.state.days))
        this.setState({
            scope: newValue
        })
    },
    valueChanged (day, newValue) {
        let days = this.state.days;
        days[day].checked = newValue;
        this.props.valueChanged(this.getValue(this.state.scope, days));
        this.setState({
            days: days
        })
    },
    renderSelect () {
        return (
            <div style={{width: "200px", float: "left", "margin-right": "20px", "margin-top": "20px"}} >
                <Select
                    simpleValue
                    name="something"
                    value={this.state.scope}
                    options={[{label: "Any Day", value: "any"}, {label: "Only days", value: "only"}]}
                    onChange={this.scopeChanged}
                />
            </div>
        );
    },
    renderCheckboxes () {
        if (this.state.scope === "only") {
            let days = Object.values(this.state.days)
            // Monday is the start of the week not Sunday, fight me
            days = days.slice(1).concat(days[0])

            return days.map((day) => {
                return (
                    <div style={{width: "70px", float: "left", "margin-right": "20px", "margin-top": "20px"}} >
                        <label style={{ height: '2.3em' }}>
                            <Checkbox
                                checked={day.checked}
                                onChange={this.valueChanged.bind(this, day.value)}
                            />
                            <span style={{ marginLeft: '.75em' }}>
                                {day.label}
                            </span>
                        </label>
                    </div>
                )
            })
        } else {
            return "";
        }
    },
    render () {
        return (
            <div>
                {this.renderSelect()}
                {this.renderCheckboxes()}
                <div style={{clear: "both"}} />
            </div>
        );
    }
});
