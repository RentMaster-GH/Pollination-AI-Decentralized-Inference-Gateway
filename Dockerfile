FROM ghcr.io/huggingface/text-generation-inference:latest
ENV MODEL_ID=meta-llama/Meta-Llama-3-8B-Instruct
ENV MAX_INPUT_LENGTH=1024 MAX_TOTAL_TOKENS=2048
