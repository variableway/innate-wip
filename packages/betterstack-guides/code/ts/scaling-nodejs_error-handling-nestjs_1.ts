# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nestjs/
# Original language: typescript
# Normalized: ts
# Block index: 1

@Get('users/:id')
findOne(@Param('id') id: string) {
  const user = this.usersService.findOne(id);
  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }
  return user;
}