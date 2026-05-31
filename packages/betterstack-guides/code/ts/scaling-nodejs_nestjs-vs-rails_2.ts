# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: typescript
# Normalized: ts
# Block index: 2

import { Controller, Get, Post, Body } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postsService.findAll();
  }

  @Post()
  createPost(@Body() postData: CreatePostDto) {
    return this.postsService.create(postData);
  }
}