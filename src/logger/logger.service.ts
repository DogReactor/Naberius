import { Logger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
class CustomLogger extends Logger {}

export { CustomLogger as Logger };
