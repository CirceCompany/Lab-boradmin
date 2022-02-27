module.exports ={
    isLoggedIn(req, res, next){
        if (req.isAuthenticated()){
            return next();
        }
        return res.redirect('/login');
    },

    //Para que no vea el registro o se registre otra vez, si esta iniciado el usuario
    isNotLoggedIn(req, res, next){
        if (!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/Index')
    }
};