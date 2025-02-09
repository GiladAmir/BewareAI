import os
from langchain_community.llms import Ollama
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS function
import requests

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)  # This will allow all domains to access this API

OLLAMA_URL = "http://localhost:11434/api/generate"

llm = Ollama(model="llama3.2", base_url=OLLAMA_URL)


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json
        prompt = data.get("prompt", "")

        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400

        # Send request to Ollama using the available model
        print("send request to ollama")
        ollama_response = requests.post(
            OLLAMA_URL,
            json={"prompt": prompt, "model": "llama3.1:latest"}  # Specify the model here
        )
        print(ollama_response)
        if ollama_response.status_code != 200:
            return jsonify({"error": "Failed to get response from Ollama"}), 500

        response_data = ollama_response.json()
        return jsonify(response_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


app.run(host="0.0.0.0", port=5500, debug=True)
