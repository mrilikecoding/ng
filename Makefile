.PHONY: start build lint preview test test-watch test-coverage

start:
	npm run dev

build:
	npm run build

lint:
	npm run lint

preview:
	npm run preview

test:
	npm run test

test-watch:
	npm run test:watch

test-coverage:
	npm run test:coverage