provider "aws" {
  region = local.region
}

resource "aws_vpc" "studies-app-vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_internet_gateway" "vpc-gateway" {
  vpc_id = aws_vpc.studies-app-vpc.id
}

resource "aws_route_table" "studies-app-default-rt" {
  vpc_id = aws_vpc.studies-app-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.vpc-gateway.id
  }
}

resource "aws_route_table_association" "studies-app-public-subnet-a-association" {
  route_table_id = aws_route_table.studies-app-default-rt.id
  subnet_id      = aws_subnet.studies-app-public-subnet-a.id
}

resource "aws_route_table_association" "studies-app-public-subnet-b-association" {
  route_table_id = aws_route_table.studies-app-default-rt.id
  subnet_id      = aws_subnet.studies-app-public-subnet-b.id
}

resource "aws_subnet" "studies-app-public-subnet-a" {
  vpc_id = aws_vpc.studies-app-vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = local.az1
}

resource "aws_subnet" "studies-app-private-subnet-a" {
  vpc_id = aws_vpc.studies-app-vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = local.az1
}

resource "aws_subnet" "studies-app-public-subnet-b" {
  vpc_id = aws_vpc.studies-app-vpc.id
  cidr_block = "10.0.3.0/24"
  availability_zone = local.az2
}

resource "aws_subnet" "studies-app-private-subnet-b" {
  vpc_id = aws_vpc.studies-app-vpc.id
  cidr_block = "10.0.4.0/24"
  availability_zone = local.az2
}

resource "aws_eip" "studies-app-eip-a" {
  domain   = "vpc"
}

resource "aws_eip" "studies-app-eip-b" {
  domain   = "vpc"
}

resource "aws_nat_gateway" "nat-public-a" {
  allocation_id = aws_eip.studies-app-eip-a.id
  subnet_id = aws_subnet.studies-app-public-subnet-a.id
}

resource "aws_nat_gateway" "nat-public-b" {
  allocation_id = aws_eip.studies-app-eip-b.id
  subnet_id = aws_subnet.studies-app-public-subnet-b.id
}

resource "aws_route_table" "studies-app-private-rt-a" {
  vpc_id = aws_vpc.studies-app-vpc.id
}

resource "aws_route_table" "studies-app-private-rt-b" {
  vpc_id = aws_vpc.studies-app-vpc.id
}

resource "aws_route" "nat-private-route-a" {
  route_table_id            = aws_route_table.studies-app-private-rt-a.id
  destination_cidr_block    = "0.0.0.0/0"
  nat_gateway_id  = aws_nat_gateway.nat-public-a.id
}

resource "aws_route" "nat-private-route-b" {
  route_table_id            = aws_route_table.studies-app-private-rt-b.id
  destination_cidr_block    = "0.0.0.0/0"
  nat_gateway_id = aws_nat_gateway.nat-public-b.id
}

resource "aws_route_table_association" "studies-app-private-subnet-a-association" {
  route_table_id = aws_route_table.studies-app-private-rt-a.id
  subnet_id = aws_subnet.studies-app-private-subnet-a.id
}

resource "aws_route_table_association" "studies-app-private-subnet-b-association" {
  route_table_id = aws_route_table.studies-app-private-rt-b.id
  subnet_id = aws_subnet.studies-app-private-subnet-b.id
}