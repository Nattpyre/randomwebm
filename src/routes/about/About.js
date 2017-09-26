import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './About.css';
import image from './coming-soon.jpg';

class About extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <p>
            Hello, stranger! Glad to see you on my website. I hope that you enjoy my webm
            collection and would be very grateful if you uploaded something from your collection.
            Of course, the right to decide whether to leave these webms or not, I leave to myself.
          </p>
          <p>
            This is the second reincarnation of this project on a new stack of technologies and I
            decided to do it in order to help my brother get experience developing Android
            applications. The project is absolutely free and does not require registration,
            I support it for my own money.
          </p>
          <p>
            All the bugs found can be reported to me personally or create a issue in
            the <a href="https://github.com/Nattpyre/randomwebm/issues" target="_blank" rel="noopener noreferrer">github
              repository</a>.
          </p>
          <p>
            If you want to contact me please use these links:
          </p>
          <ul className={s.socials}>
            <li>
              <a href="https://vk.com/nattpyre" target="_blank" rel="noopener noreferrer">
                Vkontakte
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/profile.php?id=100005043488592" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://github.com/Nattpyre" target="_blank" rel="noopener noreferrer">
                Github
              </a>
            </li>
            <li>
              <a href="mailto:nattpyre@gmail.com">
                Gmail
              </a>
            </li>
          </ul>
          <p>
            Also, if you want to try my brother&#39;s application use these button:
          </p>
          <div>
            <img src={image} alt="Coming Soon!" height={55} />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(About);
