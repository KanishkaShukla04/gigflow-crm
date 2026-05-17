import type { Request, Response } from "express";
export declare const createLead: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getLeads: (req: Request, res: Response) => Promise<void>;
export declare const updateLead: (req: Request, res: Response) => Promise<void>;
export declare const deleteLead: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=leadController.d.ts.map