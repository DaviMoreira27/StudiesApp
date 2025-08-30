resource "aws_ecr_repository" "main" {
    name = "k8s_images_${var.environment}"
    image_tag_mutability = "IMMUTABLE"

    image_scanning_configuration {
      scan_on_push = true
    }

    tags = {
        Name = "${local.project_name}-ecr-k8s-app-images"
        Environment = var.environment
        Region = var.region
    }
}

resource "aws_ecr_lifecycle_policy" "main" {
    repository = aws_ecr_repository.main.name

    policy = <<EOF
        "rules": [
            {
                "rulePriority": 1,
                "description": "Keep at least one tagged image",
                "selection": {
                    "tagStatus": "tagged",
                    "tagPrefixList": [
                        "v"
                    ],
                    "countType": "imageCountMoreThan",
                    "countNumber": 1
                },
                "action": {
                    "type": "expire"
                }
            },
            {
                "rulePriority": 2,
                "description": "Deleting images older than one month",
                "selection": {
                    "tagStatus": "tagged",
                    "tagPrefixList": [
                        "v"
                    ],
                    "countType": "sinceImagePushed",
                    "countUnit": "days",
                    "countNumber": 30
                },
                "action": {
                    "type": "expire"
                }
            }
            {
                "rulePriority": 3,
                "description": "Removes all untagged images",
                "selection": {
                    "tagStatus": "untagged",
                    "tagPrefixList": [
                        "v"
                    ],
                    "countType": "imageCountMoreThan",
                    "countNumber": 0
                },
                "action": {
                    "type": "expire"
                }
            }
        ]
    EOF
}