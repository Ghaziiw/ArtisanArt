import { Controller } from '@nestjs/common';
import { CraftsmanService } from './craftsman.service';

@Controller('craftsmen')
export class CraftsmanController {
  constructor(private readonly craftsmanService: CraftsmanService) {}
}
