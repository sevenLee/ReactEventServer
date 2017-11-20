import React, { Component } from 'react'
import {connect} from 'react-redux'
import { Form, DatePicker } from 'antd';
import moment from 'moment'

import {fetchHistoryEvents, addEvent} from '../actions'
import io from 'socket.io-client';


const FormItem = Form.Item

class MyChild extends Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
        console.log('MyChild Mount!')
        console.log('this.props:', this.props)
        this.props.changeWord('Meeee');
    }
    render(){

        return (
            <div>

                <div>{this.props.word}</div>
            </div>
        )
    }
}

class Home extends Component {
    constructor(props){
        super(props)

        // this.handleChangeWord = this.handleChangeWord.bind(this)

        // if(typeof window === 'object') {
        //     this.socket = io.connect('http://localhost:3000/')
        //     this.socket.on('update-from-server', data => this.props.addEvent(data));
        //     this.socket.on('disconnect', function(){
        //         console.log("Disconnecting Socket as component will unmount")
        //     });
        //
        // }


        this.state = {
            initDateValue: moment().valueOf(),
            formValid: true,
            myWord: 'Default word!'

        }
    }
    handleChangeWord(newWord){
        this.setState({
            myWord: newWord
        })
    }
    componentDidMount(){
        this.props.fetchHistoryEvents()


    }
    componentWillUnmount() {
        if(this.socket) {
            this.socket.disconnect()
            console.log("Disconnecting Socket as component will unmount")
        }
    }
    makeEventList(){
        return this.props.events.map((elm) => {
            return (
                <li key={elm.id}>{elm.name}</li>
            )
        })
    }
    setStartOfInitDateValue() {
        return moment(this.state.initDateValue).startOf('day')
    }
    getDateInitValue(tempFormFields, locationQueryValue, fieldName) {
        if(tempFormFields && tempFormFields[fieldName]){
            return moment(tempFormFields[fieldName])
        }else if(locationQueryValue){
            return moment(this.state.initDateValue)

            // return getTimeValueToTimeFields(locationQueryValue*1, fieldName.split('-')[1])
        }else {
            if(fieldName === 'end-time'){
                return moment(this.state.initDateValue)
            }else{
                return this.setStartOfInitDateValue()
            }
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <MyChild word={this.state.myWord} changeWord={(w) => this.handleChangeWord(w)}/>
                <Form>
                    <FormItem
                        label="DatePicker"
                    >
                        {getFieldDecorator('date-picker', {
                            initialValue: this.getDateInitValue(null, null, 'start-date'),
                        })(
                            <DatePicker />
                        )}
                    </FormItem>
                </Form>

                <ul>{this.makeEventList()}</ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { events: state.events}
}

export const loadData = (store) => {
    return store.dispatch(fetchHistoryEvents())
}

const onValuesChange = (props, values) => {
    console.log('#props:', props)
    console.log('#values:', values)
}

const mapPropsToFields = (props, value) => {
    return {

    }
}

// export default connect(mapStateToProps, {fetchHistoryEvents})(Home)
export default {
    loadData,
    component: connect(mapStateToProps, {fetchHistoryEvents, addEvent})(Form.create({mapPropsToFields, onValuesChange})(Home))
}