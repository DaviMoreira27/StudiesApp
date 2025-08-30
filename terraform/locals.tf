locals {
  project_name = "studies-app"
  az_to_index = {
    for i, az in var.availability_zones : az => i
  }
}

