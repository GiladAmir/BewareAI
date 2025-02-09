import debugpy
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from langchain.llms import Ollama
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from pydantic import BaseModel


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this to specific domains if needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

OLLAMA_URL = "http://host.docker.internal:11434"

debugpy.listen(("0.0.0.0", 5678))

llm = Ollama(
    base_url=OLLAMA_URL,
    model="llama3.2:latest",
    callback_manager=CallbackManager([StreamingStdOutCallbackHandler()]))

class AnalyzeRequest(BaseModel):
    prompt: str


def create_chain(user_prompt: str) -> str:
    pre_text = """You are a monitor tool that validates prompt messages for compliance with PII, GDPR, CCPA, HIPAA, FERPA, COPPA, and SOX regulations. Your task is to analyze the following prompt and determine if it contains any violations.
                Respond *exclusively* in JSON format. Do not include any other text or explanations outside the JSON structure. The JSON object *must* contain the following four keys:
                *   `answer` (boolean): `true` if a violation is found, `false` otherwise.
                *   `violation` (string or null): A concise label describing the type of violation *and the specific section of the regulation it violates*.  Use the following format: "[Violation Type] ([Regulation Name] [Section Number(s)])".  For example: "PII_SSN (GDPR Article 4, CCPA Section 1798.100)", "GDPR_Address (GDPR Article 17)", "CCPA_Financial (CCPA Section 1798.120)", "HIPAA_PHI (HIPAA 164.502)", "FERPA_StudentData (FERPA Section 99.3)", "COPPA_ChildData (COPPA Section 312.5)", "SOX_FinancialData (SOX Section 404)".  If no violation is found, this should be `null`. Use consistent violation labels for easier downstream processing. Consider a pre-defined list of violation types and their corresponding regulation sections.  If a violation spans multiple sections, list them separated by commas (e.g., "GDPR Article 17, 21"). If the regulation refers to a subsection, include that information (e.g., "HIPAA 164.502(b)").
                *   `description` (string or null): A clear and detailed explanation of the violation, including the specific regulation it violates (e.g., "Contains a Social Security Number, which is considered PII under GDPR and CCPA."). If no violation is found, this should be `null`.
                *   `violating_prompt_text` (string or null): The *shortest possible* substring of the prompt that, if removed, would eliminate the violation.  This should be the *most specific* violating text.  If the entire prompt is violating, return the entire prompt. If multiple violations exist, choose one representative example. If no violation is found, this should be `null`.
                *CRITICAL:* When identifying the `violating_prompt_text`, prioritize the *most specific* instance of the violation. The goal is to identify the actual sensitive data, not just the generic description of it.
                Here is the prompt message to analyze:
                """
    full_prompt = pre_text + user_prompt
    response = llm.invoke(full_prompt)
    return response


@app.post("/analyze")
async def analyze_text(request: AnalyzeRequest) -> JSONResponse:
    try:
        print(request)
        if not request.prompt:
            raise HTTPException(status_code=400, detail="No prompt provided")

        # Call the chain function to modify the prompt and send the request
        response_data = create_chain(request.prompt)
        return JSONResponse(content={"response": response_data})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
