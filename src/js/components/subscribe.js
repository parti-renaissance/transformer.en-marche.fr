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
    let { locale, messages } = this.props;

    if (!this.input.value) {
      this.setState({
        status: 'error',
        msg: messages.missingEmail[locale]
      });
      return;
    } else if (!this.input.value.includes('@')) {
      this.setState({
        status: 'error',
        msg: messages.invalidEmail[locale]
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
          msg: 'Une erreur est survenue',
        });
      } else {
        this.setState({
          status: 'success',
          msg: 'Merci pour votre inscription !',
        });
      }
    });
  }

  render() {
    const { action, messages, locale } = this.props
    let { status, msg } = this.state
    if (messages[status]) {
      msg = messages[status][locale];
    }
    return (
      <form className="SignupForm" action={action} method="post" noValidate>
        <input
          ref={node => (this.input = node)}
          type="email"
          defaultValue=""
          name="EMAIL"
          required={true}
          placeholder={messages.inputPlaceholder[locale]}
        />
        <button
          disabled={this.state.status === "sending"}
          onClick={this.onSubmit}
          type="submit"
        >
          {messages.btnLabel[locale]}
        </button>

        <p className="SignupForm__message" dangerouslySetInnerHTML={{__html: msg }} />
      </form>
    );
  }
}

export default SubscribeForm
