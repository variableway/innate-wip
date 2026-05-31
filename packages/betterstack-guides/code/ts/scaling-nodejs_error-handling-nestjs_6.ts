# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nestjs/
# Original language: typescript
# Normalized: ts
# Block index: 6

@Get('products/:id')
async findProduct(@Param('id') id: string) {
  const product = await this.productsService.findOne(id);
  if (!product) {
    throw new ResourceNotFoundException('Product', id);
  }
  return product;
}