IMAGE_TAG := $(shell git rev-parse --short HEAD)
IMAGE_NAME=harbor.liebi.com/rainbow/daily-slack
Namespace=scripts
DEPLOYMENT_FILE := deploy.yaml

version:
	@echo "Version: $(IMAGE_NAME):$(IMAGE_TAG)"

build-image:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

update-deployment:
	sed -i 's|image: $(IMAGE_NAME):.*|image: $(IMAGE_NAME):$(IMAGE_TAG)|' $(DEPLOYMENT_FILE)

deploy:
	kubectl apply -f $(DEPLOYMENT_FILE)

push:
	docker push $(IMAGE_NAME):$(IMAGE_TAG)

deploy-latest: build-image push update-deployment deploy

clean:
	git stash --include-untracked
	git stash drop

deploy-and-clean: deploy-latest clean


