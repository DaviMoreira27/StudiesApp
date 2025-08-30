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
