import React, { Component } from "react";
import jsonp from "jsonp";
import '../../scss/signup-form.css';

const getAjaxUrl = url => url.replace('/post?', '/post-json?')

class SubscribeForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: null,
      msg: null
    }
  }
  onSubmit = e => {
    e.preventDefault()

    if (!this.input.value) {
      this.setState({
        status: 'error',
        msg: 'Your email is required.'
      });
      return;
    } else if (!this.input.value.includes('@')) {
      this.setState({
        status: 'error',
        msg: 'Must be a valid email address.'
      });
      return;
    }

    const url = getAjaxUrl(this.props.action) + `&EMAIL=${encodeURIComponent(this.input.value)}&group[2631][16]=16`;
    
    this.setState({ status: "sending", msg: null }, this.submit.bind(this, url));
  }
  
  submit(url) {
    jsonp(url, {param: "c", timeout: 2000}, (err, {result, msg} = {}) => {
      if (err) {
        let msg = err.message === 'Timeout' ? 'Looks like this Mailchimp ID is invalid. Please try again.' : err;
        this.setState({
          status: 'error',
          msg 
        });
      } else if (result !== 'success') {
        this.setState({
          status: 'error',
          msg
        });
      } else {
        this.setState({
          status: 'success',
          msg
        });
      }
    });
  }
  
  render() {
    const { action, messages } = this.props
    const { status, msg } = this.state
    return (
      <form className="SignupForm" action={action} method="post" noValidate>
        <input
          ref={node => (this.input = node)}
          type="email"
          defaultValue=""
          name="EMAIL"
          required={true}
          placeholder={messages.inputPlaceholder}
        />
        <button
          disabled={this.state.status === "sending"}
          onClick={this.onSubmit}
          type="submit"
        >
          {messages.btnLabel}
        </button>
        
        <p className="SignupForm__message" dangerouslySetInnerHTML={ {__html: messages[status] || msg } } />
      </form>
    );
  }
}

export default SubscribeForm
