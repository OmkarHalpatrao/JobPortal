const User = require("../models/User")
const OTP = require("../models/OTP")
const Profile = require("../models/Profile")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const otpGenerator = require("otp-generator")
require("dotenv").config()
const redis = require("redis")

// Send OTP for Email Verification
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body

    // Check if user already exists
    const checkUserPresent = await User.findOne({ email })
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      })
    }

    // Generate OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })

    // Check if OTP is unique
    let result = await OTP.findOne({ otp: otp })
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
      result = await OTP.findOne({ otp: otp })
    }

    // Create OTP entry in DB
    const otpPayload = { email, otp }
    const otpBody = await OTP.create(otpPayload)

    // await redis.set(`otp:${email}`,otp,{
    //   EX:300
    // })

    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      otp,
    })
  } catch (error) {
    console.error("Error in sendOTP:", error)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, companyName, email, password, confirmPassword, accountType, contactNumber, otp } =
      req.body

    // Validate required fields
    if (!email || !password || !confirmPassword || !otp) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      })
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      })
    }

    // Verify OTP
    // DB
    let recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    recentOtp = recentOtp[0].otp;

    //Redis
    // const recentOtp = await redis.get(`otp:${email}`);

    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      })
    } else if (otp !== recentOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      })
    }

    // Create user profile
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      bio: null,
      skills: [],
    })

    // Create user based on account type
    const userData = {
      email,
      password,
      accountType,
      contactNumber,
      additionalDetails: profileDetails._id,
    }

    if (accountType === "JobSeeker") {
      if (!firstName || !lastName) {
        return res.status(403).json({
          success: false,
          message: "First name and last name are required for job seekers",
        })
      }
      userData.firstName = firstName
      userData.lastName = lastName
      userData.profilePhoto = `https://api.dicebear.com/6.x/initials/svg?seed=${firstName} ${lastName}&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-350,-340,-330,-320&fontFamily=Arial&fontWeight=600`
    } else {
      if (!companyName) {
        return res.status(403).json({
          success: false,
          message: "Company name is required for recruiters",
        })
      }
      userData.companyName = companyName
      userData.companyLogo = `https://api.dicebear.com/6.x/initials/svg?seed=${companyName}&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-350,-340,-330,-320&fontFamily=Arial&fontWeight=600`
    }

    const user = await User.create(userData)

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    })
  } catch (error) {
    console.error("Error in signup:", error)
    return res.status(500).json({
      success: false,
      message: "User registration failed",
      error: error.message,
    })
  }
}

// Login Controller
exports.login = async (req, res) => {

  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      })
    }

    // Check if user exists
    const user = await User.findOne({ email }).populate("additionalDetails")
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      })
    }

    // Compare password
    if (await bcrypt.compare(password, user.password)) {
      // Create Access Token
      const accessToken = jwt.sign(
        { email: user.email, id: user._id, accountType: user.accountType },
        process.env.JWT_SECRET,
        {
          expiresIn: "15m",
        },
      )

      // Create Refresh Token
      const refreshToken = jwt.sign(
        { email: user.email, id: user._id, accountType: user.accountType },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        },
      )

      // Update user with refresh token
      await User.findByIdAndUpdate(user._id, { refreshToken });

      user.password = undefined
      user.refreshToken = undefined

      // Set cookie options
      const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      }

      // Return success response with cookie
      return res.cookie("refreshToken", refreshToken, options).status(200).json({
        success: true,
        accessToken,
        user,
        message: "Logged in successfully",
      })
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      })
    }
  } catch (error) {
    console.error("[Auth] Error in login:", error)
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    })
  }
}

// Refresh Session Controller
exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Refresh token not found" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("additionalDetails");

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }

    // Generate new Access Token
    const newAccessToken = jwt.sign(
      { email: user.email, id: user._id, accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    user.password = undefined;
    user.refreshToken = undefined;

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user
    });

  } catch (error) {
    console.error("[Auth] Error in refresh:", error);
    return res.status(401).json({ success: false, message: "Session expired, please login again" });
  }
}

// Logout Controller
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.decode(refreshToken);
      if (decoded && decoded.id) {
        await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("[Auth] Error in logout:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
}


