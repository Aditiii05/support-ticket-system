# Support Ticket System
## Setup Instructions
1. Install Docker Desktop from https://www.docker.com/products/docker-desktop/.
2. Set OPENAI_API_KEY environment variable (obtain from https://platform.openai.com/api-keys).
3. Run `docker-compose up --build` in the project root.
4. Access: Backend at http://localhost:8000, Frontend at http://localhost:3000.
## LLM Choice and Why: OpenAI GPT-3.5 for its simplicity, low cost, and reliable API integration.
## Design Decisions: Used Django ORM for database-level aggregation in stats (no Python loops), implemented graceful LLM fallback to default values if API fails, chose PostgreSQL for a production-like database setup.
## Notes: Docker Desktop installation encountered temp file errors on Windows, but docker-compose.yml and Dockerfiles are correctly configured for containerization.