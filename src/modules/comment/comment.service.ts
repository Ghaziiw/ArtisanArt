import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/product.entity';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Comment[]> {
    return await this.commentRepository.find();
  }

  async findByProductId(productId: string): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { productId },
    });
  }

  // Create a new comment
  async create(
    commentData: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const product = await this.productRepository.findOne({
      where: { id: commentData.productId },
    });

    // If product not found, throw NotFoundException
    if (!product) throw new NotFoundException('Product not found');

    const comment = this.commentRepository.create({
      ...commentData,
      userId,
    });

    return this.commentRepository.save(comment);
  }

  async delete(commentId: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    // If comment not found, throw NotFoundException
    if (!comment) throw new NotFoundException('Comment not found');

    // Verify user permission
    if (comment.userId !== userId) {
      throw new NotFoundException(
        'You do not have permission to delete this comment',
      );
    }

    await this.commentRepository.delete(commentId);

    return { message: 'Comment deleted successfully' };
  }
}
