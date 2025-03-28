.PHONY: dev build start clean

# Development server
dev:
	npm run dev

# Production build
build:
	npm run build

# Start production server
start:
	npm run start

# Clean build artifacts
clean:
	rm -rf .next
	rm -rf node_modules/.cache

# Install dependencies
install:
	npm install --legacy-peer-deps

# Setup project (create env file if it doesn't exist)
setup:
	@if [ ! -f .env.local ]; then \
		cp .env.example .env.local; \
		echo "Created .env.local file. Please update it with your API keys."; \
	else \
		echo ".env.local already exists."; \
	fi
	npm install --legacy-peer-deps

# Help target
help:
	@echo "Available targets:"
	@echo "  make dev      - Start the development server"
	@echo "  make build    - Build for production"
	@echo "  make start    - Start the production server"
	@echo "  make clean    - Clean build artifacts"
	@echo "  make install  - Install dependencies"
	@echo "  make setup    - Setup project (create env file and install dependencies)" 