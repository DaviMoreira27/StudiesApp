resource "aws_instance" "service_instance" {
  for_each = toset(var.availability_zones)

  ami = data.aws_ami.service_image.id
  hibernation = true
  # https://aws.amazon.com/ec2/instance-types/
  instance_type = "t3.medium"
  subnet_id = aws_subnet.private[each.key].id
  monitoring = true

  instance_market_options {
    market_type = "spot"
  }

  tags = {
    Name = "${local.project_name}-service-k8s-instance-${each.key}"
    Environment = var.environment
    Region = var.region
    AvailabilityZone = each.key
  }
}

resource "aws_instance" "database_instance" {
  for_each = toset(var.availability_zones)

  ami = data.aws_ami.database_image.id
  hibernation = true
  instance_type = "t3.medium"
  subnet_id = aws_subnet.private[each.key].id
  disable_api_termination = true

  instance_market_options {
    market_type = "spot"
  }

  root_block_device {
    volume_size = 15
    # https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html
    volume_type = "sc1"
    delete_on_termination = true
  }

  ebs_block_device {
    volume_size = 50
    volume_type = "gp3"
    # https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/device_naming.html
    device_name = "/dev/xvdh"
    delete_on_termination = false
  }

  tags = {
    Name = "${local.project_name}-database-instance-${each.key}"
    Environment = var.environment
    Region = var.region
    AvailabilityZone = each.key
  }
}