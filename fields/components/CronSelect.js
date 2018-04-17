import React from 'react';
import Select from 'react-select';

module.exports = React.createClass({
    getInitialState () {
        let scope = "any";
        let frequency = 2;
        let frequencyShown = "";
        let extraText = this.props.extraTextEvery;
        let value = this.props.value;
        if (value.indexOf("/") != -1) {
            scope = "every";
            frequency = parseInt(value.split("/")[1]);
            frequencyShown = true;
            extraText = this.props.extraTextEvery;
        } else {
            if (value != "*") {
                scope = "at";
                frequency = parseInt(value);
                frequencyShown = true;
                extraText = this.props.extraTextAt;
            }
        }
        return {
            scope: scope,
            frequency: frequency,
            frequencyShown: frequencyShown,
            extraText: extraText,
            value: value
        };
    },
    getValue (scope, frequency) {
        switch(scope) {
            case "every":
                return "*/" + frequency.toString()
            case "at":
                return frequency.toString()
            default:
            case "any":
                return "*"
        }
    },
    scopeChanged (newScope) {
        let frequencyShown = newScope != "any"
        let extraText = this.props.extraTextEvery;
        let frequency = this.state.frequency
        if (newScope === "every") {
            extraText = this.props.extraTextEvery;
            if (this.props.everyLimit % frequency != 0) {
                frequency = 2;
            }
        }
        if (newScope == "at") {
            extraText = this.props.extraTextAt;
        }
        let value = this.getValue(newScope, frequency)
        this.props.valueChanged(value)
        this.setState({
            scope: newScope,
            frequencyShown: frequencyShown,
            extraText: extraText,
            value: value,
            frequency: frequency
        })
    },
    frequencyChanged (newFrequency) {
        let value = this.getValue(this.state.scope, newFrequency);
        this.props.valueChanged(value)
        this.setState({
            frequency: newFrequency,
            value: value
        })
    },
    scopeOptions () {
        return [
            {value: "any", label: "Any"},
            {value: "at", label: "At"},
            {value: "every", label: "Every"},
        ]
    },
    frequencyOptions () {
        let reduced = [];
        let all = []
        for (let i=0; i<this.props.everyLimit; i++) {
            all.push(i);
            if (this.props.everyLimit % i == 0) {
                reduced.push(i);
            }
        }
        let options = reduced
        if (this.state.scope === "at") {
            options = all
        }
        return options.map((option) => {
            return {
                value: option,
                label: option.toString()
            }
        })
    },
    renderScope () {
        return (
            <div style={{width: "200px", float: "left", "margin-right": "20px", "margin-top": "20px"}} >
                <Select
                    simpleValue
                    name="something"
                    value={this.state.scope}
                    options={this.scopeOptions()}
                    onChange={this.scopeChanged}
                />
            </div>
        )
    },
    renderFrequency () {
        if (this.state.frequencyShown) {
            return (
                <div style={{width: "200px", float: "left", "margin-right": "20px", "margin-top": "20px"}} >
                    <Select
                        simpleValue
                        name="something"
                        value={this.state.frequency}
                        options={this.frequencyOptions()}
                        onChange={this.frequencyChanged}
                    />
                </div>
            )
        } else {
            return ""
        }
    },
    render () {
        return (
            <div>
                {this.renderScope()}
                {this.renderFrequency()}
                <div style={{"padding-top": "7px", "margin-top": "20px", float: "left"}}>
                    {this.state.extraText}
                </div>
                <div style={{clear: "both"}} />
            </div>
        );
    }
});
