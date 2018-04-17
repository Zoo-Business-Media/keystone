import React from 'react';
import Field from '../Field';
import CronSelect from '../../components/CronSelect'
import WeekSelect from '../../components/WeekSelect'

module.exports = Field.create({

    displayName: 'CronField',
    statics: {
        type: 'Cron',
    },

    getInitialState () {
        return {
        };
    },
    minutesChanged (newValue) {
        let cronValue = newValue + " " + this.props.value.split(" ").slice(1).join(" ")
        this.props.onChange({
            path: this.props.path,
            value: cronValue,
        });
    },
    hoursChanged (newValue) {
        let cronValue = this.getValue(0) + " " + newValue + " " + this.props.value.split(" ").slice(2).join(" ")
        this.props.onChange({
            path: this.props.path,
            value: cronValue,
        });
    },
    weeksChanged (newValue) {
        let cronValue = this.props.value.split(" ").slice(0,4).join(" ") + " " + newValue
        this.props.onChange({
            path: this.props.path,
            value: cronValue,
        });
    },
    getValue (index) {
        if (this.props.value) {
            let parts = this.props.value.split(" ")
            if (parts.length > index) {
                return parts[index]
            }
        }
        return "*"
    },
    renderField () {
        return (
            <div>
                <input type="text" 
                    style={{ position: 'absolute', width: 1, height: 1, zIndex: -1, opacity: 0 }} 
                    tabIndex="-1" 
                    name={this.getInputName(this.props.path)}
                    value={this.props.value}
                />
                <CronSelect value={this.getValue(0)} valueChanged={this.minutesChanged} 
                    extraTextEvery="minutes" extraTextAt="minutes past the hour" everyLimit={60}
                />
                <CronSelect value={this.getValue(1)} valueChanged={this.hoursChanged} 
                    extraTextEvery="hours" extraTextAt="hours past midnight" everyLimit={24}
                />
                <WeekSelect valueChanged={this.weeksChanged} value={this.getValue(4)} />
            </div>
        );
    }
});