resource "aws_vpc" "main" {
  cidr_block = var.base_cidr_block

  tags = {
    Name        = "${local.project_name}-vpc"
    Environment = "${var.environment}"
  }
}

resource "aws_internet_gateway" "public_igw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route_table" "default" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${local.project_name}-rt-default"
    Environment = "${var.environment}"
  }
}

resource "aws_main_route_table_association" "default-association" {
  vpc_id         = aws_vpc.main.id
  route_table_id = aws_route_table.default.id
}

resource "aws_route" "igw_association" {
  route_table_id         = aws_route_table.default.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id = aws_internet_gateway.public_igw.id
}

resource "aws_subnet" "public" {
  /*
    for_each -> For each entry in the provided object, creates a new instance of an item

    toset -> Converts the var.availability_zones into a set, with this we can access the entry key,
    that means var.availability_zones[0] = "us-east-1a", for a string list, the key and value properties
    have the same value , IT DOES NOT WORK WITH A MAP!

    The "each" property garantees that a new resource will be created for each entry. "each.key" is the value
    of each element in a set
  */
  for_each = toset(var.availability_zones)

  vpc_id = aws_vpc.main.id

  /*
    cidrsubnet -> generates a sub-block CIDR with a provided generator rule

    base_cidr -> The base CIDR block that we will built the subnet CIDR
    newbits -> Adds a number of bits to the mask, that means if we use a /16 default block and add 8 bits,
    the subnet will have a /24 mask
    netnum -> the number of the subnet, for example, if the subnet initial block is 10.0.0.0/24,
    then the first netnum is 0, for 10.0.1.0/24, then the netnum value is 1...

    index -> get the index of an entry in a list

  */
  cidr_block        = cidrsubnet(var.base_cidr_block, 8, index(var.availability_zones, each.key)) # 10.0.0.0 and 10.0.1.0
  availability_zone = each.key

  tags = {
    Name        = "${local.project_name}-public-subnet-${index(var.availability_zones, each.key)}"
    Environment = "${var.environment}"
  }
}

resource "aws_route_table_association" "public" {
  for_each = aws_subnet.public

  route_table_id = aws_route_table.default.id
  subnet_id      = each.value.id
}

resource "aws_subnet" "private" {
  for_each = toset(var.availability_zones)

  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.base_cidr_block, 8, index(var.availability_zones, each.key) + length(var.availability_zones)) # 10.0.2.0 and 10.0.3.0
  availability_zone = each.key

  tags = {
    Name        = "${local.project_name}-private-subnet-${index(var.availability_zones, each.key)}"
    Environment = "${var.environment}"
  }
}

resource "aws_eip" "main" {
  for_each = aws_subnet.public

  domain = "vpc"

  tags = {
    Name        = "${local.project_name}-elastic-ip-${local.az_to_index[each.key]}"
    Environment = "${var.environment}"
  }
}

resource "aws_nat_gateway" "main_ngat" {
  for_each = aws_subnet.private

  allocation_id = aws_eip.main[each.key].id
  subnet_id     = aws_subnet.public[each.key].id

  tags = {
    Name        = "${local.project_name}-ngat-main-${local.az_to_index[each.key]}"
    Environment = "${var.environment}"
  }
}

resource "aws_route_table" "private" {
  for_each = aws_subnet.private

  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${local.project_name}-rt-${local.az_to_index[each.key]}"
    Environment = "${var.environment}"
  }
}

resource "aws_route" "ngat_internet" {
  for_each = aws_subnet.private

  route_table_id         = aws_route_table.private[each.key].id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.main_ngat[each.key].id
}

resource "aws_route_table_association" "private" {
  for_each = aws_subnet.private

  route_table_id = aws_route_table.private[each.key].id
  subnet_id      = aws_subnet.private[each.key].id
}
