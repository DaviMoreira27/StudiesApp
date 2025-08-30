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

variable "availability_zones" {
  type        = list(string)
  description = "The AZs that the resource will be provided"
  default     = ["us-east-1a", "us-east-1b"]
}

variable "base_cidr_block" {
  type    = string
  default = "10.0.0.0/16"
}

variable "circle_ci_project_id" {
  type    = string
  sensitive = true
}

variable "circle_ci_org_id" {
  type    = string
  sensitive = true
}