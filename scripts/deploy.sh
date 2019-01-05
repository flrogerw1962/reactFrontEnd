#!/usr/bin/env bash
set -u

configure_aws_cli(){
	aws --version
	aws configure set default.region us-east-1
	aws configure set default.output json
}

deploy_cluster() {
	CLUSTER_ARN=`aws ecs list-clusters --output text | grep -i staging | awk '{ print $2}'`
	LIST_CONTAINERS=`aws ecs list-tasks --cluster $CLUSTER_ARN --output text | awk '{ print $2}'`

	for CONTAINER in $LIST_CONTAINERS
	do
     echo "Stopping $CONTAINER\n"
     aws ecs stop-task --output text --cluster $CLUSTER_ARN --task "$CONTAINER"
     sleep 45
	done
	echo 'deployed!'
}

push_ecr_image(){
	eval $(aws ecr get-login --region us-east-1)
	docker tag $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/frontend:$CIRCLE_SHA1 $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
	docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/frontend:$CIRCLE_SHA1
	docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
}


configure_aws_cli
push_ecr_image
deploy_cluster
