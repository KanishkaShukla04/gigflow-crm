import type { Request, Response, NextFunction } from "express";
interface AuthRequest extends Request {
    user?: any;
}
declare const protect: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default protect;
//# sourceMappingURL=authMiddleware.d.ts.map