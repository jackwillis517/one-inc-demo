import pytest
from unittest.mock import patch, MagicMock
from app import app

def fake_stream_response():
    # Replicate OpenAI stream chunks with a .choices[0].delta.content attribute
    class Chunk:
        def __init__(self, content):
            self.choices = [MagicMock(delta=MagicMock(content=content))]
    yield Chunk("Testing ") 
    yield Chunk("testing")

# Make Flask test server
@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@patch('app.styles', ["Professional", "Casual"])
@patch('app.openai.chat.completions.create')
def test_stream_endpoint(mock_create, client):
    mock_create.side_effect = lambda *args, **kwargs: fake_stream_response()

    response = client.post('/generate', buffered=True, json={"prompt": "Test prompt"})
    assert response.status_code == 200

    # Collect streamed data then decode
    output = b' '.join(response.iter_encoded()).decode()

    expected_output = "\n\nProfessional:\n Testing  testing \n\nCasual:\n Testing  testing \n"

    print(output)
    print(expected_output)
    assert output == expected_output 