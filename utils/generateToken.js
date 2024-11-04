import jsonwebtoken from 'jsonwebtoken';

export const generateToken = (id,req,res) => {
    const token = jsonwebtoken.sign({ id }, process.env.JWT_SECRET, {expiresIn: '30d'});
    res.cookie('token', token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
        path: '/'
    });

    return token

}
