import React from 'react';
import { TextField, RaisedButton } from 'material-ui';
import DoneIcon from 'material-ui/svg-icons/action/done';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import ChipInput from 'material-ui-chip-input';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import VideoPlayer from '../../components/VideoPlayer';
import s from './Admin.css';

class Admin extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.string,
  };

  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    id: null,
  }

  constructor(props) {
    super(props);

    this.token = process.env.BROWSER ? localStorage.getItem('token') : null;
    this.state = {
      isLoading: false,
      webm: null,
      tagsArray: [],
      autoCompleteTags: [],
    };
  }

  componentDidMount = () => {
    this.getWebm();
  }

  getWebm = () => {
    this.context.fetch(`/graphql?query=
    {
      getWebm(
        isChecked: ${!!this.props.id},
        id: ${this.props.id ? `"${this.props.id}"` : null}
      ) {
        id,
        source,
        url,
        createdAt,
        tags {
          id,
          name
        }
      } 
    }`).then(response => response.json()).then((data) => {
      const tagsArray = data.data.getWebm ? data.data.getWebm.tags.map(tag => tag.name) : [];

      this.setState({
        isLoading: false,
        webm: data.data.getWebm,
        tagsArray,
      });
    });
  }

  handleConfirm = () => {
    this.setState({
      isLoading: true,
    });

    this.context.fetch(`/graphql?query=
      mutation {
        confirmWebm(
          id: "${this.state.webm.id}",
          source: ${this.state.webm.source ? `"${this.state.webm.source}"` : null},
          tags: ${JSON.stringify(this.state.tagsArray)}
        ) {
          id
        }
    }`, {
      headers: {
        Authorization: this.token ? `${this.token}` : null,
      },
    }).then(response => response.json()).then((data) => {
      if (!data.data.confirmWebm || !data.data.confirmWebm.id) {
        return;
      }

      this.getWebm();
    });
  }

  handleRemove = () => {
    this.setState({
      isLoading: true,
    });

    this.context.fetch(`/graphql?query=
      mutation {
        removeWebm(
          id: "${this.state.webm.id}"
        ) {
          id
        }
    }`, {
      headers: {
        Authorization: this.token ? `${this.token}` : null,
      },
    }).then(response => response.json()).then((data) => {
      if (!data.data.removeWebm.id) {
        return;
      }

      if (this.props.id) {
        window.location.href = '/admin';
      } else {
        this.getWebm();
      }
    });
  }

  addTag = (tag) => {
    const tagsArray = this.state.tagsArray;

    tagsArray.push(tag);

    this.setState({
      tagsArray,
    });
  }

  deleteTag = (tag, index) => {
    const tagsArray = this.state.tagsArray;

    tagsArray.splice(index, 1);

    this.setState({
      tagsArray,
    });
  }

  handleSourceChange = (e, value) => {
    const webm = { ...this.state.webm };

    webm.source = value;

    this.setState({
      webm,
    });
  }

  handleTagsInputFocus = () => {
    document.body.classList.add('disable-hotkeys');

    if (this.state.autoCompleteTags.length > 0) {
      return;
    }

    this.context.fetch(`/graphql?query=
    {
      getTags {
        name
      }
    }`).then(response => response.json()).then((data) => {
      const autoCompleteTags = data.data.getTags.map(tag => tag.name);

      this.setState({
        autoCompleteTags,
      });
    });
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          {
            this.state.webm ?
              <div>
                <VideoPlayer source={this.state.webm.url} />
                <div className={s.webmInfoWrapper}>
                  <div className={s.leftBlock}>
                    <strong>
                      Uploaded: {this.state.webm.createdAt}
                    </strong>
                    <strong className={s.sourceWrapper}>
                      <span>Source:</span>
                      <TextField
                        id="webm-source"
                        className={s.sourceInput}
                        value={this.state.webm.source ? this.state.webm.source : ''}
                        onChange={this.handleSourceChange}
                        onFocus={() => document.body.classList.add('disable-hotkeys')}
                        onBlur={() => document.body.classList.remove('disable-hotkeys')}
                      />
                    </strong>
                    <strong>Tags:</strong>
                    <ChipInput
                      id="webm-tags"
                      className={s.tagsWrapper}
                      value={this.state.tagsArray}
                      dataSource={this.state.autoCompleteTags}
                      onFocus={this.handleTagsInputFocus}
                      onBlur={() => document.body.classList.remove('disable-hotkeys')}
                      onRequestAdd={this.addTag}
                      onRequestDelete={this.deleteTag}
                    />
                  </div>
                  <div className={s.rightBlock}>
                    <RaisedButton
                      label="Confirm"
                      icon={<DoneIcon />}
                      onTouchTap={this.handleConfirm}
                      primary
                      disabled={this.state.isLoading}
                    />
                    <RaisedButton
                      label="Remove"
                      icon={<DeleteIcon />}
                      onTouchTap={this.handleRemove}
                      secondary
                      disabled={this.state.isLoading}
                    />
                  </div>
                </div>
              </div>
              :
              <p>No results.</p>
          }
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Admin);
