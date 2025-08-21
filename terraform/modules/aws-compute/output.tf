output "ecr_repo_name" {
  value = aws_ecr_repository.main.name

  depends_on = [ aws_ecr_repository.main ]
}