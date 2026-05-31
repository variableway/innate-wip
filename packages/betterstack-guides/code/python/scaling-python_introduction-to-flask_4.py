# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-flask/
# Original language: python
# Normalized: python
# Block index: 4

[label app.py]
from flask import Flask


def create_app():
    app = Flask(__name__)

    @app.route("/", methods=["GET"])
    def hello_world():
        return {"message": "Welcome to the Blog API"}

    return app


# Create the app instance
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)