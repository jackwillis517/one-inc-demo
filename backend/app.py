import os
import openai, threading
from flask import Flask, Response, request
from flask_cors import CORS
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
load_dotenv()

openai.api_key=os.getenv("OPENAI_API_KEY")

styles=["Professional", "Casual", "Polite", "Social-media"]

flag = threading.Event()

def stream_styles(prompt):
    for style in styles:
        if flag.is_set():  # Halt generation if cancellation requested
            break

        yield f"\n\n{style}:\n"

        stream = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": f"Write the given user prompt in {style} style. DO NOT write a response simply rephrase provided text in the {style} style."},
                      {"role": "user", "content": prompt}],
            stream=True
        )

        for chunk in stream:
            if flag.is_set():
                f"\n\n"
                break
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    yield f"\n"


@app.route("/generate", methods=["POST"])
def generate():
    flag.clear()
    prompt = request.json.get("prompt", "")
    print(prompt)
    return Response(stream_styles(prompt), mimetype="text/plain")

@app.route("/cancel", methods=["POST"])
def cancel():
    flag.set()
    return {"status": "canceled"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, threaded=True)


# if __name__ == "__main__":
#     promt="Hey guys, let's huddle about AI."

#     for chunk in stream_styles(promt):
#         print(chunk, end="", flush=True)