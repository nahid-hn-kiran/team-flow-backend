import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../config/env";
import status from "http-status";
import AppError from "../errorHelpers/appError";
import { prisma } from "../../lib/prisma";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new AppError(status.UNAUTHORIZED, "No valid session found!");
      }

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (!sessionExists || !sessionExists.user) {
          throw new AppError(status.UNAUTHORIZED, "Invalid or expired session");
        }

        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentageRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentageRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());

            console.log("Session Expiring soon.");
          }

          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
              status.FORBIDDEN,
              "Forbidden access! You do not have permission to access this resoure.",
            );
          }
        }
      }

      const token = cookieUtils.getCookie(req, "accessToken");

      const verifyToken = jwtUtils.verifyToken(
        token,
        envVars.ACCESS_TOKEN_SECRET,
      );

      if (!verifyToken.success) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access!");
      }

      if (verifyToken.data.status !== UserStatus.ACTIVE) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access!");
      }

      if (verifyToken.data.isDeleted) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access!");
      }

      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifyToken.data.role as Role)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden access! You do not have permission to access this resoure.",
        );
      }

      req.user = {
        userId: verifyToken.data.id,
        role: verifyToken.data.role,
        email: verifyToken.data.email,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
