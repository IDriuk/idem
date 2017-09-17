import React, { Component } from 'react';
import axios from 'axios';

export default class Signin extends Component {
  componentDidMount() {
    window.VK.init({apiId: 5782746});

    this.vkTarget = document.createElement('div');
    this.vkTarget.id = 'vk_auth';
    this.vkTarget.className= 'vkwidget';
    document.body.appendChild(this.vkTarget);

    const props = this.props;

    window.VK.Widgets.Auth("vk_auth", {
      width: "200px",
      onAuth: function(user) {
        axios.post(`/signin`, JSON.stringify(user))
          .then(response => {
            const url = localStorage.getItem('url');
            localStorage.clear();
            localStorage.setItem('user', JSON.stringify(user));
            url ? window.location.assign(`//idem.today/invite/${url}`):
                  window.location.assign('//idem.today/');
          })
          .catch((err) => {
            alert('Ошибка подключения. Проверьте состояние подключения к интернету.');
          });
      }
    });
  }

  componentWillUnmount() {
    document.body.removeChild(this.vkTarget);
  }

  render() {
    return (
      <div className='signin row justify-content-center'>
          <div className="row justify-content-center" >
            <a
              href="https://vk.com/idem_poltava"
            >
              <img src="images/group_logo.png" />
            </a>
          </div>
      </div>
    );
  }

}
