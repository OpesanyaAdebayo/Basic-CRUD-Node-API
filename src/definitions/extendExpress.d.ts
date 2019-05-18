export{}

declare global {
  namespace Express {
    interface Request {
      userEmail?: string | object;
    }
  }
}
