exports.logoutUser = (req, res) => {
        res.clearCookie('GithubToken', {
            httpOnly: false,
            secure: true, 
            sameSite: 'Lax',
          });
        res.redirect('http://localhost:5173/');
};