from unittest.mock import patch, MagicMock
from app import openai_stream

# openai_stream and flag from app.py 
from app import openai_stream, flag

def fake_stream_response():
    # Replicate OpenAI stream chunks with a .choices[0].delta.content attribute
    class Chunk:
        def __init__(self, content):
            self.choices = [MagicMock(delta=MagicMock(content=content))]
    yield Chunk("Testing ") 
    yield Chunk("testing")

@patch('app.styles', ["Professional", "Casual"])
@patch('app.openai.chat.completions.create')
def test_openai_stream(mock_create):
    # Setup the flag to simulate no cancel
    flag.clear()

    # Make sure each style gets it's own generator  
    # This has to do with the fact that each style in the openai_stream function gets it's own api call
    mock_create.side_effect = lambda *args, **kwargs: fake_stream_response()

    # Original attempt to stream response to yield fake chunks
    # mock_create.return_value = fake_stream_response()

    # Collect all output chunks from the generator
    output = list(openai_stream("Test prompt"))

    # Expected: ["\n\nProfessional:\n", "Hello ", "world", "\n\nCasual:\n", "Hello ", "world", "\n"]
    expected_output = [
        "\n\nProfessional:\n", "Testing ", "testing",
        "\n\nCasual:\n", "Testing ", "testing",
        "\n"
    ]

    assert output == expected_output

    # Test the cancel functionallity 
    flag.set()
    output_cancel = list(openai_stream("Test prompt"))
    # Since flag is set before the call to the openai_stream function, all that should be yieded is the \n at the end 
    assert output_cancel[0] == "\n"
    assert len(output_cancel) < len(expected_output)