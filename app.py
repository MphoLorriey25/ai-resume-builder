from flask import Flask, render_template, request, jsonify
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_resume():
    try:
        data = request.get_json()
        name = data.get('name')
        job_title = data.get('job_title')
        experience = data.get('experience')
        skills = data.get('skills')
        education = data.get('education')

        prompt = f"Create a professional resume for {name}, applying for a {job_title} position. Experience: {experience}. Skills: {skills}. Education: {education}."

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800
        )

        generated_text = response['choices'][0]['message']['content']
        return jsonify({"resume": generated_text})

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
        
        print(data)


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
