const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const AccessToken = require("../models/AccessToken");
const asyncWrapper = require("../middleware/asyncWrapper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = (user) => {
  // return jwt.sign(
  //   { id: user.id, isAdmin: user.isAdmin },
  //   process.env.TOKEN_SECRET,
  //   //expiration time
  //   { expiresIn: "5m" }
  // );
  try {
    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.TOKEN_SECRET,
      //expiration time
      { expiresIn: "5m" }
    );
    (async function () {
      const accessToken = new AccessToken({
        // user,
        token,
      });

      await accessToken.save();
    })();

    return token;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
// const generateRefreshToken = (user) => {
//   return jwt.sign(
//     { id: user.id, isAdmin: user.isAdmin },
//     process.env.REFRESH_SECRET,
//     //expiration time
//     { expiresIn: "15m" }
//   );
// };

const generateRefreshToken = (user) => {
  try {
    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.REFRESH_SECRET,
      // expiration time
      { expiresIn: "15m" }
    );

    (async function () {
      const refreshToken = new RefreshToken({
        // user,
        token,
      });

      await refreshToken.save();
    })();

    return token;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
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

// const refreshToken = (req, res) => {
//   //get refresh token from the user
//   const refreshToken = req.body.token;
//   //send error if no token or token is invalid
//   if (!refreshToken) return res.status(401).json("you are not authenticated");
//   //if token is valid, create a new access token, refresh token and send to the user
//   if (!refreshTokens.includes(refreshToken)) {
//     return res.status(403).json("refresh token is not valid");
//   }
//   jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
//     if (err) {
//       return res.sendStatus(403);
//     }
//     //delete the old refresh token
//     refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
//     //generate new access token and refresh token
//     const newAccessToken = generateAccessToken(user);
//     const newRefreshToken = generateRefreshToken(user);
//     //push the new refresh token to the array
//     refreshTokens.push(newRefreshToken);
//     //send the new access token and refresh token to the user
//     res.status(200).json({
//       accessToken: newAccessToken,
//       refreshToken: newRefreshToken,
//     });
//   });
// };

const refreshToken = async (req, res) => {
  //get refresh token from the user
  const tokenFromRequest = req.body.token;
  //send error if no token or token is invalid
  if (!tokenFromRequest)
    return res.status(401).json("you are not authenticated");
  //check if the token exists in the database
  const token = await RefreshToken.findOne({ token: tokenFromRequest });
  if (!token) return res.status(403).json("refresh token is not valid");
  jwt.verify(
    tokenFromRequest,
    process.env.REFRESH_SECRET,
    async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      //delete the old refresh token from the database
      await RefreshToken.deleteOne({ token: tokenFromRequest });
      //generate new access token and refresh token
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      //create a new refresh token in the database
      // const newToken = new RefreshToken({ token: newRefreshToken });
      // await newToken.save();
      //send the new access token and refresh token to the user
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    }
  );
};

// const destroyToken = (req, res) => {
//   const refreshToken = req.body.token;
//   if (!refreshToken) return res.status(401).json("you are not authenticated");
//   if (!refreshTokens.includes(refreshToken)) {
//     return res.status(403).json("refresh token is not valid");
//   }
//   refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
//   res.status(200).json("refresh token is deleted");
// };

const getRefreshToken = async (token) => {
  const refreshToken = await RefreshToken.findOne({ token });

  return refreshToken;
};

const destroyToken = async (req, res) => {
  const token = req.body.token;
  try {
    const deletedToken = await RefreshToken.findOneAndDelete({ token });
    if (!deletedToken) {
      return res.status(404).send({ error: "Token not found" });
    }
    return res.send({ message: "Token deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Server error" });
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  refreshToken,
  destroyToken,
  getRefreshToken,
};
