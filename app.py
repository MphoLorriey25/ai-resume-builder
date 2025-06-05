from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_resume():
    data = request.get_json()
    job_title = data.get('job_title')
    experience = data.get('experience')
    skills = data.get('skills')

    if not OPENROUTER_API_KEY:
        return jsonify({"error": "Missing API key"}), 400

    prompt = f"Generate an ATS-friendly professional resume for the job title: {job_title}, with experience: {experience}, and skills: {skills}."

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}]
    }

    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        resume = result["choices"][0]["message"]["content"]
        return jsonify({"resume": resume})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Failed to generate resume"}), 500

if __name__ == '__main__':
    app.run(debug=True)
