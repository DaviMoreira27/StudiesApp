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
}

module "k8s" {
  source = "./modules/k8s/"
}

