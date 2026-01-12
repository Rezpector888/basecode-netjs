import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SanitizeInputMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const hasNullByte = this.containsNullByte(req.body);
    if (hasNullByte) {
      throw new BadRequestException('Input contains invalid characters');
    }
    next();
  }

  private containsNullByte(obj: any): boolean {
    if (typeof obj === 'string') {
      return obj.includes('\u0000');
    }

    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (this.containsNullByte(obj[key])) return true;
      }
    }

    return false;
  }
}
