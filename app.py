from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

@app.route("/generate", methods=["POST"])
def generate_resume():
    data = request.json

    # Build the prompt with user input
    prompt = f"""
    Create a professional, ATS-friendly resume with this info:
    Name: {data.get('name', '')}
    Personal Summary: {data.get('summary', '')}
    Address: {data.get('address', '')}
    Phone: {data.get('phone', '')}
    Email: {data.get('email', '')}
    Education: {data.get('education', '')}
    Work Experience: {data.get('experience', '')}
    Skills: {data.get('skills', '')}
    Job Description for keyword optimization: {data.get('job_description', '')}
    """

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-3.5-turbo",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7
            }
        )
        response.raise_for_status()  # Raise HTTPError for bad responses
        res_json = response.json()

        # Extract AI-generated text
        result = res_json["choices"][0]["message"]["content"]

        return jsonify({"output": result})

    except requests.exceptions.HTTPError as http_err:
        return jsonify({"error": f"HTTP error: {http_err}"}), 500
    except ValueError:  # includes JSONDecodeError
        return jsonify({"error": "Invalid response from OpenRouter API"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
