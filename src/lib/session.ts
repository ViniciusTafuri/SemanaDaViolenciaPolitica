import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  isAdmin?: boolean;
}

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret || sessionSecret.length < 32) {
  throw new Error(
    "SESSION_SECRET precisa estar definido no .env com pelo menos 32 caracteres."
  );
}

export const sessionOptions = {
  cookieName: "sdsd_admin_session",
  password: sessionSecret,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const session = await getSession();
  return session.isAdmin === true;
}
