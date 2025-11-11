import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/types/auth-user';
import { Body } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('comments')
@UseGuards(PermissionsGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // GET /comments → retrieve all comments
  @Get()
  @Public()
  async getAllComments() {
    return this.commentService.findAll();
  }

  // GET /comments/product/:productId → retrieve comments by product ID
  @Get(':productId')
  @Public()
  async getCommentsByProductId(@Param('productId') productId: string) {
    return this.commentService.findByProductId(productId);
  }

  // POST /comments → create a new comment
  @Post()
  async createComment(
    @CurrentUser() user: AuthUser,
    @Body() commentData: CreateCommentDto,
  ) {
    return this.commentService.create(commentData, user.id);
  }

  // DELETE /comments/:commentId → delete a comment by ID
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentService.delete(commentId, user.id);
  }
}
