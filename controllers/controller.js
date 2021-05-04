const { Users } = require('../models/user');
const bcrypt = require('bcrypt');

exports.home = (req, res) => res.send('hello world');

exports.register = (req, res) => {
    //회원가입에 필요한 Client를 가져오면 USER에 넣어준다.
    const user = new Users(req.body);
    user.save((err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ sucess: false, err });
        }
        return res.status(200).json({ sucess: true, user });
    });
};

exports.login = (req, res) => {
    //요청된 이멜일이 데이터베이스에서 있는지 확인
    //해당 메소드들은 user 모델에서 만듬
    Users.findOne({ email: req.body.email }, (err, user) => {
        console.log(req.body.email);
        if (!user) {
            return res.json({
                loginSucess: false,
                message: '제공된 이메일에 해당하는 유저가 없습니다. ',
            });
        }
        //요청된 이메일이 데이터베이스에 있다면 비밀번호 확인
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
            if (!isMatch) {
                console.log('compare', err);
                return res.status(400).json({
                    loginSucess: false,
                    message: '비밀번호가 틀렸습니다.',
                });
            }
        });

        //비밀번호까지 확인 완료됐으면 토큰 생성
        user.genrateToken(user, (err, user) => {
            if (err) {
                console.log('token', err);
                return res.status(400).send(err);
            }

            //토큰을 쿠키에 저장한다.
            res.cookie('x_auth', user.token)
                .status(200)
                .json({ loginSucess: true, userID: user._id });
        });
    });
};
