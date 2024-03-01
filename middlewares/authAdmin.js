const adminRequired = (req, res, next) => {
    console.log(req.session.isAdmin);
    if (req.session.isAdmin) {
        next();
    }
    else {
        res.redirect('/auth/login');
    }
}

module.exports = adminRequired;