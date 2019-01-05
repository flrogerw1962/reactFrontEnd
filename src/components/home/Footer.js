import React from 'react';
import { Link } from 'react-router';

import '../../assets/stylesheets/_footer.scss';
const facebookImg = require('../../assets/images/facebook_footer.png');
const instagramImg = require('../../assets/images/instagram_footer.png');
const twitterImg = require('../../assets/images/twitter_footer.png');
const youtubeImg = require('../../assets/images/youtube_footer.png');

function Footer() {
  return (
    <footer className="footer">
      <div className="container img_container">
        <img className="footer__img" alt="footer" />
      </div>
      <div className="container">
        <div className="row">
          <div className=".col-xs-12 col-sm-4">
            <h3>The Smile Guarantee</h3>
            <p>
              Be prepared for a big smile when you open your order.
              We’re certain you’ll love it, and that’s why we can provide you a 100% Smile Guarantee.
              If you’re not happy and smiling, tell us and we’ll take care of it. We promise.
            </p>
          </div>
          <div className=".col-xs-12 col-sm-4 footer__item">
            <h3>Our Story</h3>
            <p>
              I grew up in the printing business, learning alongside family for 25 years now,
              passionately dedicated to making the more than 1 million customers we've served happy...
            </p>
            <h3 className="h3_item">Connect</h3>
            <a href="https://www.facebook.com/" target="_blank">
              <img src={facebookImg} alt="facebook_social" />
            </a>
            <a href="https://www.instagram.com//" target="_blank">
              <img src={instagramImg} alt="instagram_social" />
            </a>
            <a href="https://twitter.com/" target="_blank">
              <img src={twitterImg} alt="twitter_social" />
            </a>
            <a href="https://www.youtube.com/channel/UC2jdPBBgcw5nfqj5DVf8-IA" target="_blank">
              <img src={youtubeImg} alt="youtube_social" />
            </a>
          </div>
          <div className=".col-xs-12 col-sm-3">
            <h3>Contact Us</h3>
            <p>
              We're "Crazy Easy. Crazy Fast."<br />
              Live Chat:<a href="https://lc.chat/now/8410621/"> We're here for you</a> <br />
              Email: <a href="mailto: hello@bob.com">hello@bob.com</a> <br />
              Phone: 800.485.1760
            </p>
          </div>
          <div className=".col-xs-12 col-sm-1">
            <h3>More</h3>
            <p>
              <a href="http://www.com/express/faq/cid-75-326be895">FAQ</a><br />
              <a href="http://www.com/express/stores/cid-75-326be895">Stores</a><br />
              <a href="http://www.com/" target="_blank">Wallkeepers</a><br />
            </p>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 footer__rights">
            <span>
             &copy; All Rights Reserved. patent pending.
              <Link to="/conditions"> Privacy Policy </Link>
              <Link to="/terms"> Terms & Conditions </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
