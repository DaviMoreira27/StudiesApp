// PUBLIC -----------------------------------

resource "aws_security_group" "public" {
  name        = "public_sg"
  description = "Allow TLS and non TLS inbound traffic and all outbound traffic"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name        = "${local.project_name}-sg-public"
    Environment = var.environment
  }
}

// INGRESS ---------------------------------------------

resource "aws_vpc_security_group_ingress_rule" "allow_tls_ipv4_tcp" {
  for_each = toset(var.availability_zones)

  security_group_id = aws_security_group.public.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  ip_protocol       = "tcp"
  to_port           = 443
}

resource "aws_vpc_security_group_ingress_rule" "allow_http_tcp" {
  for_each = toset(var.availability_zones)

  security_group_id = aws_security_group.public.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 80
  ip_protocol       = "tcp"
  to_port           = 80
}

resource "aws_vpc_security_group_ingress_rule" "allow_tls_ipv4_udp" {
  for_each = toset(var.availability_zones)

  security_group_id = aws_security_group.public.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  ip_protocol       = "udp"
  to_port           = 443
}

resource "aws_vpc_security_group_ingress_rule" "allow_http_udp" {
  for_each = toset(var.availability_zones)

  security_group_id = aws_security_group.public.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 80
  ip_protocol       = "udp"
  to_port           = 80
}

resource "aws_vpc_security_group_ingress_rule" "allow_ssh_tcp" {
  security_group_id = aws_security_group.public.id
  cidr_ipv4         = "0.0.0.0/0" // TODO: #10 Configure a VPN Client
  from_port         = 22
  to_port           = 22
  ip_protocol       = "tcp"
}

// EGRESS ---------------------------------------------

resource "aws_vpc_security_group_egress_rule" "allow_tls_ipv4_tcp" {
  for_each = toset(var.availability_zones)

  security_group_id = aws_security_group.public.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = -1
  ip_protocol       = "tcp"
  to_port           = -1
}

resource "aws_vpc_security_group_egress_rule" "allow_tls_ipv4_udp" {
  for_each = toset(var.availability_zones)

  security_group_id = aws_security_group.public.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = -1
  ip_protocol       = "udp"
  to_port           = -1
}

resource "aws_vpc_security_group_egress_rule" "allow_icmp_public" {
  for_each = toset(var.availability_zones)

  security_group_id = aws_security_group.public.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = -1
  ip_protocol       = "icmp"
  to_port           = -1
}

// PRIVATE -----------------------------------

resource "aws_security_group" "private" {
  name        = "private_sg"
  description = "Configure private traffic"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name        = "${local.project_name}-sg-private"
    Environment = var.environment
  }
}

// INGRESS ---------------------------------------------

resource "aws_vpc_security_group_ingress_rule" "allow_service_ports_tcp" {
  security_group_id = aws_security_group.private.id
  cidr_ipv4         = aws_vpc.main.cidr_block
  from_port         = 3000
  ip_protocol       = "tcp"
  to_port           = 3010
}

resource "aws_vpc_security_group_ingress_rule" "allow_service_ports_udp" {
  security_group_id = aws_security_group.private.id
  cidr_ipv4         = aws_vpc.main.cidr_block
  from_port         = 3000
  ip_protocol       = "udp"
  to_port           = 3010
}

resource "aws_vpc_security_group_ingress_rule" "allow_database_ports" {
  security_group_id = aws_security_group.private.id
  cidr_ipv4         = aws_vpc.main.cidr_block
  from_port         = 5430
  ip_protocol       = "tcp"
  to_port           = 5435
}

resource "aws_vpc_security_group_ingress_rule" "allow_icmp" {
  security_group_id = aws_security_group.private.id
  cidr_ipv4         = aws_vpc.main.cidr_block
  from_port         = -1
  to_port           = -1
  ip_protocol       = "icmp"
}

// EGRESS ---------------------------------------------

resource "aws_vpc_security_group_egress_rule" "allow_service_ports_tcp" {
  security_group_id = aws_security_group.private.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = -1
  ip_protocol       = "tcp"
  to_port           = -1
}

resource "aws_vpc_security_group_egress_rule" "allow_service_ports_udp" {
  security_group_id = aws_security_group.private.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = -1
  ip_protocol       = "udp"
  to_port           = -1
}

resource "aws_vpc_security_group_egress_rule" "allow_database_ports" {
  security_group_id = aws_security_group.private.id
  cidr_ipv4         = aws_vpc.main.cidr_block
  from_port         = 5430
  ip_protocol       = "tcp"
  to_port           = 5435
}

resource "aws_vpc_security_group_egress_rule" "allow_icmp_private" {
  security_group_id = aws_security_group.private.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = -1
  to_port           = -1
  ip_protocol       = "icmp"
}