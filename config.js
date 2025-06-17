const API_KEY = "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";  // ← Replace this

async function generateResumeFromAPI(prompt) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://yourdomain.com/'  // Optional
    },
    body: JSON.stringify({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that writes professional resumes.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) throw new Error("Failed to generate resume.");
  const data = await response.json();
  return data.choices[0].message.content;
}

