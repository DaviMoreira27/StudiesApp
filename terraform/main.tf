provider "aws" {
  region = var.region
}

provider "kubernetes" {
}

module "network" {
  source = "./modules/aws-network"

  availability_zones = var.availability_zones
  environment = var.environment
  region = var.region
  base_cidr_block = var.base_cidr_block
}

module "compute" {
  source = "./modules/aws-compute"

  availability_zones = var.availability_zones
  environment = var.environment
  region = var.region
}

module "storage" {
  source = "./modules/aws-storage"

  environment = var.environment
  region = var.region
}

module "iam" {
  source = "./modules/aws-iam"

  ecr_repository_name = module.compute.ecr_repo_name
  environment = var.environment
  region = var.region
  circle_ci_project_id = var.circle_ci_project_id
  circle_ci_org_id = var.circle_ci_org_id
}

module "k8s" {
  source = "./modules/k8s/"
}

