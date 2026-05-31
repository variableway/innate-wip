# Source: https://betterstack.com/community/guides/scaling-nodejs/flutter-vs-react-native/
# Original language: javascript
# Normalized: js
# Block index: 4

import { useQuery } from '@tanstack/react-query';

const ProductScreen = () => {
  const { data: products, isLoading } = useQuery(
    ['products'],
    fetchProducts
  );

  if (isLoading) return <ActivityIndicator />;

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
};