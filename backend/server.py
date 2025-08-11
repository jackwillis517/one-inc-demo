import os
import openai, threading
from flask import Flask, Response, request
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()

openai.api_key=os.getenv("OPENAI_API_KEY")

styles=["Professional", "Casual", "Polite", "Social-media"]

flag = threading.Event()

def stream_styles(prompt):
    for style in styles:
        if flag.is_set():  # Halt generation if cancellation requested
            break

        yield f"\n--- {style.upper()} ---\n"

        stream = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": f"Write in {style} style."},
                      {"role": "user", "content": prompt}],
            stream=True
        )

        for chunk in stream:
            if flag.is_set():
                break
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

@app.route("/generate", methods=["POST"])
def generate():
    flag.clear()
    prompt = request.json.get("prompt", "")
    return Response(stream_styles(prompt), mimetype="text/plain")

@app.route("/cancel", methods=["POST"])
def cancel():
    flag.set()
    return {"status": "canceled"}

if __name__ == "__main__":
    app.run(debug=True, threaded=True)


# if __name__ == "__main__":
#     promt="Hey guys, let's huddle about AI."

#     for chunk in stream_styles(promt):
#         print(chunk, end="", flush=True)