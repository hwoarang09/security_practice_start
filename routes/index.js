//라이브러리
var express = require("express");
var router = express.Router();
var path = require("path");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
require("dotenv").config();
const cookieSession = require("cookie-session");
const helmet = require("helmet");

//환경파일
const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

//passport의 전략을 수립하기 위한 인자.
const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

//확인용 콜백함수.
//로그인이 잘 진행되면 profile이 출력된다.
function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log("in verifyCallback");
  console.log("accessToken : ", accessToken);
  console.log("refreshToken : ", refreshToken);
  console.log("Google profile", profile);
  done(null, profile); //null은 에러가 없다는 표시. 그냥 에러 없을거다 가정하고 짠 코드.
}

//패스포트에 구글 로그인 전략을 사용함.
//Strategy자체가 오름캠프 강의에서는 local이었지만
//지금은 google 전략임.

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

// Save the session to the cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Read the session from the cookie
passport.deserializeUser((id, done) => {
  // User.findById(id).then(user => {
  //   done(null, user);
  // });
  done(null, id);
});
//일반적인 보안모듈
router.use(helmet());

router.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
  })
);

router.use(passport.initialize());
router.use(passport.session()); //req.user사용할 수 있게 해줌

//로그인이 되었는지 확인하는 미들웨어 함수
//아직 구현 제대로 안함.
function checkLoggedIn(req, res, next) {
  console.log("router start");
  const isLoggedIn = req.isAuthenticated() && req.user; //일단 고정값 true
  if (!isLoggedIn) {
    return res.status(401).json({ error: "You must login!" });
  }
  next();
}

//여기서 로그인
//미들웨어로 passport.authenticate('google'을 쓰는 것임. 로그인할 때
//email만 요구
router.get(
  "/auth/google/",
  passport.authenticate("google", {
    scope: ["email"],
  })
);

//구글에서 authorization code를 보내주는 라우터
//구글 OAuth에서 등록한 라우팅 경로임
//passport.authenticate('google')이 알아서 로그인함.
//여기의 2번재 인자는 옵션. 성공하거나 실패할 때 향할 주소 옵션??
//세번째 인자는 뭐가 됐든 처리하는 핸들러.
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    session: true,
  }),
  (req, res) => {
    console.log("Google called us back!");
  }
);

//로그아웃 하는 경로
router.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/secret", checkLoggedIn, (req, res) => {
  return res.send("Your Secret Value is 42HANMOOL!!");
});

router.get("/failure", (req, res) => {
  return res.send("Failed to log in!");
});

/* GET home page. */
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
module.exports = router;
