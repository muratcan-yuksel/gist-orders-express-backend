const User = require("../models/User");
const asyncWrapper = require("../middleware/asyncWrapper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    "secretKey",
    //expiration time
    { expiresIn: "20s" }
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    "myRefreshSecretKey"
    //expiration time
    // { expiresIn: "15m" }
  );
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "secretKey", (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.send({ message: "token not found" });
  }
};

const refreshToken = (req, res) => {
  //get refresh token from the user
  const refreshToken = req.body.token;
  //send error if no token or token is invalid
  if (!refreshToken) return res.status(401).json("you are not authenticated");
  //if token is valid, create a new access token, refresh token and send to the user
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("refresh token is not valid");
  }
  jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    //delete the old refresh token
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    //generate new access token and refresh token
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    //push the new refresh token to the array
    refreshTokens.push(newRefreshToken);
    //send the new access token and refresh token to the user
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  refreshTokens,
  verifyToken,
  refreshToken,
};
