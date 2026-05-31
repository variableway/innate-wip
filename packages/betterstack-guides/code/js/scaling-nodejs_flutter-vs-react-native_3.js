# Source: https://betterstack.com/community/guides/scaling-nodejs/flutter-vs-react-native/
# Original language: dart
# Normalized: js
# Block index: 3

class AnimatedProductList extends StatefulWidget {
  final List<Product> products;

  @override
  _AnimatedProductListState createState() => _AnimatedProductListState();
}

class _AnimatedProductListState extends State<AnimatedProductList>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 300),
      vsync: this,
    );
    _controller.forward();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _controller,
      child: ListView.builder(
        itemCount: widget.products.length,
        itemBuilder: (context, index) => ProductItem(widget.products[index]),
      ),
    );
  }
}