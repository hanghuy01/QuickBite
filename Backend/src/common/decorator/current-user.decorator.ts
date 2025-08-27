import { JwtPayload } from '@/common/types/payloads';
import { JwtRequest } from '@/common/types/requests';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<JwtRequest>();
    return request.user; // 👈 giá trị được set trong guard (JWT hoặc Refresh)
  }
);
