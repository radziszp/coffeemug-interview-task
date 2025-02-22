up: ## Run a local development environment with Docker Compose.
	@docker-compose -f ./docker-compose.yml up -d --build --force-recreate
database-d: 
	@docker-compose up -d mongo_db
