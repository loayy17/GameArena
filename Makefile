.PHONY: up down logs rebuild

up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f

rebuild:
	docker compose up --build --force-recreate -d
