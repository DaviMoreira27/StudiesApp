variable "region" {
  type        = string
  description = "The region that the infraestructure will be build upon it"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "The target environment that the infraestructure provide"
  default     = "development"
}

variable "ecr_repository_name" {
  type        = string
  description = "The ECR repository name"
}

variable "circle_ci_org_id" {
  description = "The unique ID of the CircleCI organization."
  type        = string
  validation {
    condition     = length(var.circle_ci_org_id) > 0
    error_message = "The CircleCI organization ID must not be empty."
  }
}

variable "circle_ci_project_id" {
  description = "The ID of the CircleCI project (e.g., 'my-app')."
  type        = string
  validation {
    condition     = length(var.circle_ci_project_id) > 0
    error_message = "The CircleCI project ID must not be empty."
  }
}

variable "circle_ci_values" {
  description = "List of values for the OIDC 'sub' condition."
  type        = list(string)
  default     = []
}