import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import express, { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import type { AppBootstrap, AppUser } from "../../shared/contracts";
import {
  createSessionRecord,
  getExpiredCookieOptions,
  getSessionCookieName,
  getSessionCookieOptions,
  hashSessionToken,
} from "./session";
import type { AppRepository } from "./repository";

type AuthenticatedRequest = Request & {
  authUser?: AppUser | null;
  sessionTokenHash?: string;
};

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

const pantryItemSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

const commentSchema = z.object({
  content: z.string().trim().min(1).max(500),
});

interface CreateAppOptions {
  repository: AppRepository;
  sessionSecret: string;
  secureCookie: boolean;
}

export function createApp({ repository, sessionSecret, secureCookie }: CreateAppOptions) {
  const app = express();
  const cookieName = getSessionCookieName();

  app.use(express.json());
  app.use(cookieParser());

  app.use(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const sessionToken = req.cookies?.[cookieName];

    if (!sessionToken) {
      req.authUser = null;
      return next();
    }

    const sessionTokenHash = hashSessionToken(sessionToken, sessionSecret);
    const session = await repository.findSession(sessionTokenHash);

    if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
      if (session) {
        await repository.deleteSession(sessionTokenHash);
      }
      res.clearCookie(cookieName, getExpiredCookieOptions(secureCookie));
      req.authUser = null;
      return next();
    }

    req.sessionTokenHash = sessionTokenHash;
    req.authUser = await repository.findUserById(session.userId);
    next();
  });

  app.get("/api/auth/session", async (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({ user: req.authUser ?? null });
  });

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const parsed = credentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: { code: "invalid_request", message: "Invalid credentials payload." } });
    }

    const email = parsed.data.email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    try {
      const user = await repository.createUser(email, passwordHash);
      const { session, token } = createSessionRecord(user.id, sessionSecret);
      await repository.createSession(session);
      res.cookie(cookieName, token, getSessionCookieOptions(session.expiresAt, secureCookie));
      req.authUser = user;
      req.sessionTokenHash = session.tokenHash;
      return res.status(201).json({ user });
    } catch (error) {
      if (error instanceof Error && error.message === "email_taken") {
        return res.status(409).json({ error: { code: "email_taken", message: "Email is already registered." } });
      }

      return res.status(500).json({ error: { code: "internal_error", message: "Unable to register user." } });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const parsed = credentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: { code: "invalid_request", message: "Invalid credentials payload." } });
    }

    const userRecord = await repository.findUserByEmail(parsed.data.email);
    if (!userRecord || !(await bcrypt.compare(parsed.data.password, userRecord.passwordHash))) {
      return res.status(401).json({ error: { code: "invalid_credentials", message: "Email or password is incorrect." } });
    }

    const { session, token } = createSessionRecord(userRecord.id, sessionSecret);
    await repository.createSession(session);
    res.cookie(cookieName, token, getSessionCookieOptions(session.expiresAt, secureCookie));
    req.authUser = { id: userRecord.id, email: userRecord.email };
    req.sessionTokenHash = session.tokenHash;
    return res.status(200).json({ user: { id: userRecord.id, email: userRecord.email } });
  });

  app.post("/api/auth/logout", async (req: AuthenticatedRequest, res: Response) => {
    if (req.sessionTokenHash) {
      await repository.deleteSession(req.sessionTokenHash);
    }
    res.clearCookie(cookieName, getExpiredCookieOptions(secureCookie));
    res.status(204).send();
  });

  app.get("/api/app/bootstrap", async (req: AuthenticatedRequest, res: Response) => {
    if (!req.authUser) {
      return res.status(401).json({ error: { code: "unauthorized", message: "Authentication is required." } });
    }

    const bootstrap = await buildBootstrap(repository, req.authUser);
    return res.status(200).json(bootstrap);
  });

  app.post("/api/pantry/items", async (req: AuthenticatedRequest, res: Response) => {
    if (!req.authUser) {
      return res.status(401).json({ error: { code: "unauthorized", message: "Authentication is required." } });
    }

    const parsed = pantryItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: { code: "invalid_request", message: "Invalid pantry item." } });
    }

    const pantry = await repository.addPantryItem(req.authUser.id, parsed.data.name);
    return res.status(200).json({ pantry });
  });

  app.delete("/api/pantry/items/:name", async (req: AuthenticatedRequest, res: Response) => {
    if (!req.authUser) {
      return res.status(401).json({ error: { code: "unauthorized", message: "Authentication is required." } });
    }

    const pantryName = Array.isArray(req.params.name) ? req.params.name[0] : req.params.name;
    const pantry = await repository.removePantryItem(req.authUser.id, pantryName);
    return res.status(200).json({ pantry });
  });

  app.get("/api/community-recipes/:id/comments", async (req: AuthenticatedRequest, res: Response) => {
    if (!req.authUser) {
      return res.status(401).json({ error: { code: "unauthorized", message: "Authentication is required." } });
    }

    const recipeId = req.params.id;
    const comments = await repository.getComments(recipeId);
    return res.status(200).json({ comments });
  });

  app.post("/api/community-recipes/:id/comments", async (req: AuthenticatedRequest, res: Response) => {
    if (!req.authUser) {
      return res.status(401).json({ error: { code: "unauthorized", message: "Authentication is required." } });
    }

    const parsed = commentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: { code: "invalid_request", message: "Comment content is required." } });
    }

    const recipeId = req.params.id;
    const comments = await repository.addComment(recipeId, req.authUser.id, req.authUser.email, parsed.data.content);
    return res.status(201).json({ comments });
  });

  return app;
}

async function buildBootstrap(repository: AppRepository, user: AppUser): Promise<AppBootstrap> {
  const [seedSnapshot, pantry] = await Promise.all([
    repository.getSeedSnapshot(),
    repository.getPantry(user.id),
  ]);

  return {
    user,
    pantry,
    commonIngredients: seedSnapshot.commonIngredients,
    foodItems: seedSnapshot.foodItems,
    disruptions: seedSnapshot.disruptions,
    recipes: seedSnapshot.recipes,
    communityRecipes: seedSnapshot.communityRecipes,
  };
}
