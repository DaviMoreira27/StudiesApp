# https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/finding-an-ami.html
# https://docs.aws.amazon.com/linux/al2023/ug/what-is-amazon-linux.html

data "aws_ami" "service_image" {
  most_recent = true

  filter {
    name   = "name"
    values = ["amazon-eks-node-al2023-x86_64-*"]
  }

  filter {
    name   = "owner-alias"
    values = ["amazon"]
  }

  filter {
    name = "free-tier-eligible"
    values = ["true"]
  }

  filter {
    name = "architecture"
    values = ["x86_64"]
  }

  owners = ["602401143452"]

  tags = {
    Name = "${local.project_name}-service-k8s-image"
    Environment = var.environment
    Region = var.region
  }
}

data "aws_ami" "database_image" {
  most_recent = true

  filter {
    name   = "name"
    values = ["al2023-ami-ecs-neuron-hvm-2023.0.*"]
  }

  filter {
    name = "free-tier-eligible"
    values = ["true"]
  }

  filter {
    name = "architecture"
    values = ["x86_64"]
  }

  owners = ["602401143452", "591542846629"]

  tags = {
    Name = "${local.project_name}-database-image"
    Environment = var.environment
    Region = var.region
  }
}
