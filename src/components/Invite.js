import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  subscribeUser,
  unsubscribeUser,
  archiveUser,
  deleteUser } from '../actions';

class Invite extends Component {

  constructor(props) {
    super(props);

    this.state = { visibleGroup: "subscribe" };
  }

  renderUserButtons() {
    {/* войдите, чтобы записаться на мероприятие */}
    const { loader } = this.state;
    const { subscribeUser, unsubscribeUser, invite, invite: { isSubscribed } } = this.props;
    return (
      <div className="invite row justify-content-center">
        {!isSubscribed && !loader &&
          <button
            className="btn btn-lg btn-success"
            onClick={() => {
                this.setState({loader: true});
                setTimeout(() => {this.setState({loader: false});}, 500);
                subscribeUser(invite);
              }
            }
          >
            Иду!
          </button>
        }
        {isSubscribed && !loader &&
          <button
            className="btn btn-lg btn-secondary"
            onClick={() => {
                this.setState({loader: true});
                setTimeout(() => {this.setState({loader: false});}, 500);
                unsubscribeUser(invite);
              }
            }
          >
            Передумал
          </button>
        }
        {loader && <div className="loader"></div>}
      </div>
    );
  }

  renderOwnerButtons() {
    const { visibleGroup: v } = this.state;

    return (
      <div className="btn-group" role="group" aria-label="Inviter buttons">
        <button
          className={`btn btn-secondary ${v == 'subscribe' ? 'active' : ''}`}
          onClick={() => this.setState({visibleGroup: "subscribe"})}
        >
          Идут
        </button>
        <button
          className={`btn btn-secondary ${v == 'unsubscribe' ? 'active' : ''}`}
          onClick={() => this.setState({visibleGroup: "unsubscribe"})}
        >
          Передумали
        </button>
        <button
          className={`btn btn-secondary ${v == 'archive' ? 'active' : ''}`}
          onClick={() => this.setState({visibleGroup: "archive"})}
        >
          Архив
        </button>
      </div>
    );
  }

  /* списки идущих, передумавших и заархивированных */
  renderSubscribers() {
    const { invite: { subscribe, unsubscribe, archive, url }, archiveUser, deleteUser } = this.props;
    const {visibleGroup : v} = this.state;
    const subscribers = v == 'subscribe' ? subscribe :
                        v == 'unsubscribe' ? unsubscribe : archive;

    return (
      <div>
        <div className="list-group">
          { subscribers.map((subscriber, index) => {
            return (
              <div
                key={index}
                className="list-group-item justify-content-between">
                <a href={`//vk.com/id${subscriber.uid}`}>
                  <img
                    src={subscriber.photo_rec}
                    className="rounded-circle img-thumbnail"
                  />
                  &nbsp; {subscriber.first_name}
                </a>
                {v != 'archive' && <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => archiveUser({ subscriber, url })}
                >в архив</button>}
                {v == 'archive' && <button
                  className="btn btn-danger btn-sm "
                  onClick={() => deleteUser({ subscriber, url })}>удалить</button>}
              </div>
            );
          })}
        </div>
        <p> </p>
      </div>
    );
  }

  render() {
    if (!this.props.invite) {
      return (
        <div className="invite row justify-content-center">
          <div className="loader"></div>
        </div>
      );
    }

    const {visibleGroup} = this.state;
    const {invite: { owner, isOwner, description, name, time, place, place_gmap, price, phone, link}} = this.props;

    return (
      <div className="invite row justify-content-center">
        <div className="col-12 col-sm-8 ">
          <div className="row justify-content-center name">
            <h1>{name}</h1>
          </div>
          <p>
            <p>{description}</p>
            <em>{time}</em><br></br>
            <em>{place} {place_gmap && <a href={place_gmap} target="_blank"> (карта)</a>}</em><br></br>
            <em>{price}</em>{/* <br></br>
            <small className="text-muted"><em>{phone}</em></small><br></br>
            <small className="text-muted"><em>{link}</em></small> */}
          </p>
          <h5> Приглашает: </h5>
          <p>
            <a href={`//vk.com/id${owner.uid}`} target="_blank" >
              <img
                src={owner.photo_rec}
                className="rounded-circle img-thumbnail"
              />
              &nbsp; {owner.first_name}
            </a>
          </p>
          {!isOwner && this.renderUserButtons()}
          {isOwner && this.renderOwnerButtons()}
          {isOwner && this.renderSubscribers()}
          <p> </p>
          <div className="row justify-content-center">
            <Link to='/' className="btn btn-outline-primary">К списку приглашений</Link>
          </div>
        </div>
      </div>
    );
  }

};

function mapStateToProps(state, ownProps) {
  const {params: { url }} = ownProps;
  const { invites } = state;

  const invite = _.find( invites, (invite) => {
    return invite.url == url;
  });

  return { invite };
}

export default connect(mapStateToProps, {
  subscribeUser,
  unsubscribeUser,
  archiveUser,
  deleteUser })(Invite);
