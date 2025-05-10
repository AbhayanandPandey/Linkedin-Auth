
exports.logoutUser = (req, res) => {
        res.clearCookie('GithubToken', {
            httpOnly: false,
            secure: true, 
            sameSite: 'Lax',
          });
        res.redirect(process.env.FRONTEND_URL);
};