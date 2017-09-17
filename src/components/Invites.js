import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class Invites extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { invites } = this.props;
    return (
      <div className="invites">

        <div className="row justify-content-center">
          <div className="col-3 col-md-1">
            <a href="https://vk.com/idem_poltava" target="_blank">Vk</a>
          </div>
          <div className="col-3 col-md-1">
            <a href="http://idem.today/signin">Вход</a>
          </div>
          <div className="col-3 col-md-1">
            <a href="#" onClick={() => {
              localStorage.clear();
              window.location.assign(`//idem.today/`);
            }}>Выход</a>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 ">
            <div className="list-group">
              {invites && invites.map && invites.map((invite) => {
                  const url =`/invite/${invite.url}`;
                  return (
                    <Link
                      key={url}
                      to={url}
                      className="list-group-item list-group-item-action justify-content-between">
                      {invite.name}
                      <span>
                        {invite.isOwner && <span className="badge badge-primary">приглашаю</span>}
                        {invite.isSubscribed && <span className="badge badge-success">иду</span>}
                        &nbsp; &nbsp; <span className="badge badge-default">{invite.subCount}</span>
                      </span>
                    </Link>
                  );
                })
              }
            </div>
          </div>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return { invites: state.invites };
}

export default connect(mapStateToProps)(Invites);
