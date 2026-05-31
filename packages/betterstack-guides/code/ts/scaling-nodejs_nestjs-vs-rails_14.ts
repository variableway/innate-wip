# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: typescript
# Normalized: ts
# Block index: 14

@Controller('posts')
export class PostsController {
  @Get('my-posts')
  @UseGuards(JwtAuthGuard)
  getUserPosts(@Request() req) {
    return this.postsService.findByUser(req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  deletePost(@Param('id') id: string, @Request() req) {
    return this.postsService.deleteUserPost(id, req.user.id);
  }
}