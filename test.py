from transformers import pipeline

# Load the model
pipe = pipeline("text-generation", model="meta-llama/Llama-3.1-405B")

# Define the pre-text and main prompt
pre_text = "You are a helpful assistant that generates questions and answers for quizzes. "
prompt = pre_text + "Generate a question and provide three possible answers:\n\nQuestion: "

# Generate text
output = pipe(prompt, max_length=150, do_sample=True, temperature=0.7)

# Print result
print(output[0]['generated_text'])
