/* eslint-disable no-extra-boolean-cast */
const axios = require('axios');

const apiUrl = 'https://hngi7-team-avengers.herokuapp.com/api/v1';

// This will be an external dashboard url to task 9

const dashboardUrl = 'https://dashboard.microapi.dev/';

//  Middleware
exports.isAuthenticated = (req, res, next) => {
  if (!!req.cookies.auth) {
    next();
  }
  return res.redirect('/login');
};

exports.isLoggedIn = (req, res, next) => {
  if (!!req.cookies.auth) {
    res.redirect(dashboardUrl);
  }
  return next();
};

exports.signup = (req, res) => {
  const data = req.body;
  axios.post(
    `${apiUrl}/register`,
    data,
  ).then(() => {
    const string = encodeURIComponent('You have successfully signup, please login');
    res.redirect(`/login?successMsg=${string}`);
  }).then(() => {
    res.render('Pages/Register', {
      error: err.response.data,
      data,
    });
  })

    .catch((err) => {
      return console.log(err)
    });
};


exports.login = (req, res) => {
  const data = req.body;
  axios.post(
    `${apiUrl}/login`,
    data,
  ).then((response) => {
    const { token } = response.data;
    res.cookie('auth', token);
    return res.redirect(`/dashboard?token=${token}`);
  }).catch((err) => {
    res.render('Pages/Login', {
      error: err.response ? err.response.data : '',
      successMsg: null,
    });
  });
};

exports.logout = (req, res) => {
  res.clearCookie('auth');
  return res.redirect('/');
};


exports.dashboard = (req, res) => {
  const token = req.cookies.auth;
  res.redirect(307, `${dashboardUrl}?token=${token}`);
};

exports.googleauth = (req, res) => {
  axios.get(
    `${apiUrl}/google/signin`,
  ).then((resp) => {
    const { response } = resp.data;
    res.redirect(response);
  });
};

exports.googlecallback = (req, res) => {
  const { code } = req.query;
  res.cookie('auth', code);
  res.redirect('/dashboard');
};
