export function isAmdin(req, res, next) {
  if(req.session.email && req.session.admin == true) {
    return next();
  }
  return res.status(401).render('error-page', { msg: 'please log in as ADMIN!' });
}

export function isUser(req, res, next) {
  if (req.session.email) {
    return next();
  }
  return res.status(401).render('error-page', { msg: 'please log in!' });
}

export function isUserNotAdmin(req, res, next) {
  if (req.session.email && req.session.admin == false) {
    return next();
  }
  return res.status(401).render('error-page', { msg: 'please log in USER NOT ADMIN!' });
}

export function isUserOwner(req, res, next) {
  if (req.session.email && req.session.admin == true) {
    return next();
  }
  return res.status(401).render('error-page', { msg: 'please log in AS ADMIN!' });
}