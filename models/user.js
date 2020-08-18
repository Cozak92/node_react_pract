const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxLength: 10,
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
    },
    lastName: {
        type: String,
        maxLength: 10,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        tpye: Number,
    },
});

//save 하기전에 무엇가를 하겠따 몽고 db의 pre함수
userSchema.pre('save', function (next) {
    //비밀번호 암호화
    // 솔트를 만들고 유저 패스워들 가져와서 솔트로 해싱

    var user = this;
    //유저 비밀번호가 바뀌었을때만 실행
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash.slice();
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = (plainPassword, cb) => {
    //플레인 패스워드랑 암호화딘 비밀번호랑 체크
    //복호화는 안되므로 인크립트 해서 맞는지 확인
    console.log(plainPassword, this.password);
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if (err) return cb(err), cb(null, isMatch);
    });
};

userSchema.methods.genrateToken = (user, cb) => {
    // jsonwebtoken을 사용해서 토큰을 생성하기.
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    //user._id + 'secretToken' = token
    //나중에 시크릿 토큰만으로도 아이디를 찾을수있음

    user.token = token;
    user.save((err, user) => {
        if (err) return cb(err);
        cb(null, user);
    });
};

const Users = mongoose.model('Users', userSchema);

module.exports = { Users };
