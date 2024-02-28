import { PrismaClient } from '@prisma/client';
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { ApiError } from '../utils/apiError';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import constantVaribale from "../constant";

const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = constantVaribale;
const prisma = new PrismaClient();

type EmailDataType = {
  id: number;
  name: string;
  email: string;
  password: string;
}

const refreshTokenValue = async (id: number) => {
  const refreshTokenGenerated = jwt.sign(
    {
      id: id,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY
    }
  );
  return refreshTokenGenerated;
}

const generateAccessAndRefreshToken = async (userId: number) => {
  try {
    const emailDataType = await prisma.user.findFirst({
      where: {
        id: userId
      },
    });

    if (!emailDataType) {
      throw new Error("User not found");
    }

    const accessToken = jwt.sign(
      {
        id: emailDataType.id,
        email: emailDataType.email,
        name: emailDataType.name,
      },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      }
    );

    const refreshToken = await refreshTokenValue(emailDataType.id); // Temporary refresh token
    const storeRefreshToken = await prisma.user.update({
      where: {
        id: emailDataType.id
      },
      data: {
        refresh_token: refreshToken
      }
    })
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token");
  }
}

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ status: true, code: 400, msg: "Email required" });
  }

  if (!password) {
    return res.status(400).json({ status: true, code: 400, msg: "Password required" });
  }

  try {
    const emailData = await prisma.user.findFirst({
      where: {
        email: email
      },
    });

    if (!emailData) {
      return res.status(400).json({ status: true, code: 400, msg: "User does not exist" });
    }

    const databasePassword = emailData.password;
    const checkPassword = await bcrypt.compare(password, databasePassword);

    if (!checkPassword) {
      return res.status(401).json({ status: true, code: 401, msg: "Incorrect password" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(emailData.id);
    const options = {
      httpOnly: true,
      secure: true
  }
    return res.status(200).cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      status: false, code: 500, msg: "User Loging Successfully", data: {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    });
  } catch (error) {
    return res.status(500).json({ status: false, code: 500, msg: "Server error" });
  }
});

export { login };
