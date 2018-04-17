import React from 'react';
import Select from 'react-select';

module.exports = React.createClass({
    getInitialState () {
        return {
            scope: "any",
            frequency: 5,
            frequencyShown: false,
            extraText: "",
            value: "none"
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
        let extraText = ""
        let frequency = this.state.frequency
        if (newScope === "every") {
            extraText = "minutes"
            frequency = 5
        }
        if (newScope == "at") {
            extraText = "minutes past the hour"
        }
        let value = this.getValue(newScope, frequency)
        this.setState({
            scope: newScope,
            frequencyShown: frequencyShown,
            extraText: extraText,
            value: value,
            frequency: frequency
        })
    },
    frequencyChanged (newFrequency) {
        let value = this.getValue(this.state.scope, newFrequency)
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
        let reduced = [5,10,15,20,30];
        let all = []
        for (let i=0; i<60; i++) {
            all.push(i)
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
            <div style={{width: "200px", float: "left", "margin-right": "20px"}} >
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
                <div style={{width: "200px", float: "left", "margin-right": "20px"}} >
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
                {this.state.extraText}
                <br/>
                {this.state.value}
            </div>
        );
    }
});
