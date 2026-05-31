# Source: https://betterstack.com/community/guides/scaling-nodejs/flutter-vs-react-native/
# Original language: javascript
# Normalized: js
# Block index: 0

const ProductList = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <ScrollView>
      {products.map(product => (
        <TouchableOpacity key={product.id} onPress={() => navigate(product)}>
          <Text>{product.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};