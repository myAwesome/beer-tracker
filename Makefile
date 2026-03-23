.PHONY: backend frontend dev install

backend:
	cd backend && go run main.go

frontend:
	cd frontend && npm run dev

dev:
	make -j2 backend frontend

install:
	cd backend && go mod tidy
	cd frontend && npm install
